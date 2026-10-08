# Modul KDS Barista (Kitchen Display System)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **KDS Barista** (Fase 1 Core) yang dipasang pada monitor/tablet dapur/barista untuk memandu peracikan minuman dan mengotomatisasi pemotongan stok bahan baku.

---

## UC-KDS-01: Pantau Antrean Tiket Pesanan (Baru, Dibuat, Siap)

```
Use Case ID      : UC-KDS-01
Nama Use Case    : Pantau Antrean Tiket Pesanan
Modul            : KDS Barista
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Barista Outlet
```

### 1. Deskripsi
Menyajikan papan antrean tiket pesanan (*kitchen board*) berbasis 3 kolom alur kerja: **Baru (New)**, **Dibuat (In Progress)**, dan **Siap Diambil (Ready for Pick-Up)** secara layar penuh (*full screen*), membedakan tiket pesanan kasir vs online, serta menampilkan penghitung waktu tunggu.

### 2. Prekondisi
- Aplikasi KDS Barista aktif di layar dapur outlet dan terhubung ke event bus lokal.

### 3. Pemicu (Trigger)
- Transaksi lunas di kasir POS atau pesanan online diterima.

### 4. Alur Utama (Main Flow)
1. Barista memantau layar KDS yang terbagi dalam 3 kolom besar:
   - Kolom 1 (Kiri): **Baru** (badge biru `--info` berteks putih).
   - Kolom 2 (Tengah): **Dibuat** (badge kuning `--warning` berteks putih).
   - Kolom 3 (Kanan): **Siap** (badge hijau `--success` berteks putih).
2. Setiap kali ada pesanan baru masuk (event `OrderPlaced` / `OrderAccepted`):
   - Sistem membunyikan nada ping audio yang jelas.
   - Tiket baru muncul di bagian atas kolom **Baru**.
3. Kartu tiket menampilkan:
   - **Nomor Tiket Besar**: Tipografi JetBrains Mono berukuran 36 px (contoh: `#A-101`).
   - **Nama Pemesan & Kanal Asal**: Badge biru *"Online App"* atau badge netral *"Kasir Walk-In"*.
   - **Daftar Item & Kuantitas**: Teks kontras tinggi dengan modifier yang dicetak tebal (contoh: *1x Es Kopi Susu - Less Sugar, Oatmilk*).
   - **Catatan Barista Khusus**: Disorot dengan latar kuning lembut (contoh: *"es dipisah"*).
   - **Timer Waktu Tunggu Berjalan**: Menghitung menit dan detik sejak pesanan dibuat.

### 5. Postkondisi
- Barista memiliki visibilitas beban kerja yang teratur tanpa resiko pesanan terselip atau hilang.

---

## UC-KDS-02: Mulai Proses Pembuatan Minuman (Status In Progress)

```
Use Case ID      : UC-KDS-02
Nama Use Case    : Mulai Proses Pembuatan Minuman
Modul            : KDS Barista
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Barista Outlet
Aktor Pendukung  : App Pelanggan, POS Kasir
```

### 1. Deskripsi
Barista menandai bahwa tiket pesanan tertentu sedang mulai diracik di meja bar (*espresso station*), memindahkan tiket ke kolom kerja aktif, dan memperbarui status pelacakan secara live di aplikasi pelanggan.

### 2. Prekondisi
- Tiket pesanan berada di kolom "Baru".

### 3. Pemicu (Trigger)
- Barista siap meracik pesanan dan mengetuk tombol aksi pada tiket.

### 4. Alur Utama (Main Flow)
1. Barista mendekati layar KDS dan mengetuk tombol besar **Mulai (Start)** pada kartu tiket di kolom "Baru".
2. Sistem menganimasikan perpindahan kartu tiket dari kolom "Baru" menuju kolom tengah **"Dibuat"**.
3. Status pesanan diperbarui menjadi `IN_PROGRESS`.
4. Sistem memancarkan event `OrderPrepStarted`.
5. Event tersebut disiarkan seketika:
   - Pada **App Pelanggan**: Tampilan pelacak live berpindah ke tahap *"Sedang Dibuat oleh Barista"* (UC-CUS-06).
   - Pada **POS Kasir**: Status pesanan di daftar transaksi terupdate menjadi *In Preparation*.
6. Barista fokus meracik pesanan sesuai instruksi tiket.

### 5. Postkondisi
- Pelanggan mengetahui bahwa pesanannya sedang diproses aktif oleh barista.

---

## UC-KDS-03: Tandai Pesanan Siap & Pemotongan Stok Resep Otomatis

```
Use Case ID      : UC-KDS-03
Nama Use Case    : Tandai Pesanan Siap & Pemotongan Stok Resep Otomatis
Modul            : KDS Barista (Domain Inventory Sync)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Barista Outlet
Aktor Pendukung  : App Pelanggan, POS Kasir, ERP Inventory
```

### 1. Deskripsi
Barista menandai bahwa minuman telah selesai diracik dan diletakkan di counter pengambilan. Aksi ini secara otomatis memicu pemotongan saldo bahan baku fisik outlet sesuai resep dan modifier produk, serta memberitahu pelanggan bahwa pesanan siap diambil.

### 2. Prekondisi
- Minuman selesai diracik dan tiket berada di kolom "Dibuat".

### 3. Pemicu (Trigger)
- Barista mengetuk tombol **Siap (Ready)** pada kartu tiket.

### 4. Alur Utama (Main Flow)
1. Barista meletakkan gelas minuman di meja pick-up counter.
2. Barista mengetuk tombol hijau besar **Siap (Ready)** pada kartu tiket di layar KDS.
3. Sistem menganimasikan perpindahan kartu ke kolom **"Siap Diambil"**.
4. Status pesanan diperbarui menjadi `READY`.
5. **Eksekusi Pengurangan Stok Otomatis (Domain Engine)**:
   - Sistem membaca formula resep dari seluruh item dan modifier di tiket tersebut (UC-BO-08 & UC-BO-09).
   - Sistem memotong kuantitas bahan baku dari warehouse stok outlet terkait:
     - *Biji Kopi House Blend*: berkurang 18 gram.
     - *Susu Fresh Milk*: berkurang 120 ml.
     - *Sirup Aren*: berkurang 25 ml.
     - *Cup Plastik 16oz*: berkurang 1 pcs.
     - *Tutup & Sedotan*: berkurang 1 set.
   - Sistem memeriksa saldo sisa stok: jika stok bahan baku melewati batas minimum safety stock, sistem otomatis memicu event `LowStockAlert` (BR-08).
6. Sistem memancarkan event `OrderReady` dan `StockConsumed`.
7. Efek event disinkronkan ke seluruh aplikasi:
   - Di **App Pelanggan**: Smartphone bergetar dan membunyikan alert *"Pesanan Siap Diambil!"*.
   - Di **POS Kasir**: Status pesanan berubah menjadi *Ready*.
   - Di **App Operasi Outlet & Backoffice**: Angka saldo stok bahan berkurang seketika (dan alert stok menipis muncul jika relevan).

### 5. Postkondisi
- Pesanan siap diserahkan dan saldo persediaan outlet terpotong presisi tanpa intervensi input manual.

### 6. Aturan Bisnis Terkait
- **BR-08**: Stok berkurang otomatis berdasarkan resep saat pesanan selesai dibuat di KDS.

---

## UC-KDS-04: Tandai Pesanan Telah Diserahkan / Diambil Pelanggan

```
Use Case ID      : UC-KDS-04
Nama Use Case    : Tandai Pesanan Telah Diserahkan / Diambil Pelanggan
Modul            : KDS Barista
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Barista / Kasir Outlet
Aktor Pendukung  : Pelanggan
```

### 1. Deskripsi
Menyelesaikan siklus hidup tiket di layar KDS setelah pelanggan atau kurir mengambil gelas minuman dari counter, mengarsipkan tiket ke riwayat transaksi selesai.

### 2. Prekondisi
- Tiket berada di kolom "Siap Diambil". Pelanggan mendatangi counter dan menunjukkan nomor tiket.

### 3. Pemicu (Trigger)
- Barista/Kasir menyerahkan minuman dan mengetuk tombol **Selesai / Diambil (Picked Up)**.

### 4. Alur Utama (Main Flow)
1. Pelanggan menunjukkan nomor tiket (misal: `#A-101`) di ponsel atau struk kertas.
2. Barista mencocokkan nomor tiket dan menyerahkan minuman.
3. Barista mengetuk tombol **Diambil (Picked Up)** pada tiket di layar KDS.
4. Sistem menganimasikan penghapusan kartu dari layar (fade out) dan mengarsipkan tiket ke riwayat selesai.
5. Status pesanan diperbarui menjadi `COMPLETED / PICKED_UP`.
6. Sistem memancarkan event `OrderPickedUp`.
7. Layar App Pelanggan menampilkan pesan ramah: *"Pesanan telah diambil. Selamat menikmati!"*.

### 5. Postkondisi
- Papan KDS bersih dari tiket yang telah selesai diserahkan.

---

## UC-KDS-05: Intip Formula Resep Cepat & Gramatur Bahan

```
Use Case ID      : UC-KDS-05
Nama Use Case    : Intip Formula Resep Cepat & Gramatur Bahan
Modul            : KDS Barista
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Barista Outlet
```

### 1. Deskripsi
Menampilkan popup panduan takaran gramatur dan ml bahan racikan minuman secara cepat saat item pada tiket diketuk, membantu barista baru menjaga konsistensi rasa sesuai standar SOP.

### 2. Prekondisi
- Tiket pesanan tampil di layar KDS.

### 3. Pemicu (Trigger)
- Barista baru ragu mengenai takaran takar sirup atau susu untuk varian menu tertentu.

### 4. Alur Utama (Main Flow)
1. Barista mengetuk nama item minuman pada kartu tiket KDS (contoh: *Matcha Latte Large - Less Sweet*).
2. Sistem membuka popup modal ringkas **Panduan Resep Cepat**:
   - Bubuk Matcha: 15 gram (larutkan dalam 30 ml air panas).
   - Susu Fresh Milk: 180 ml (kondisi dingin).
   - Simple Syrup: 10 ml (takaran disesuaikan untuk permintaan *Less Sweet*).
   - Es Batu: 150 gram.
3. Barista membaca takaran dan mengetuk area luar popup untuk menutupnya.
4. Barista meracik minuman sesuai panduan yang tampil.

### 5. Postkondisi
- Minuman dibuat sesuai standar SOP tanpa harus membuka buku manual fisik.

---

## UC-KDS-06: Indikator SLA Keterlambatan Tiket Pesanan

```
Use Case ID      : UC-KDS-06
Nama Use Case    : Indikator SLA Keterlambatan Tiket Pesanan
Modul            : KDS Barista
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Barista Outlet / Sistem
```

### 1. Deskripsi
Secara visual mengubah warna bingkai dan latar belakang tiket apabila durasi penyiapan pesanan melampaui batas standar layanan (*Service Level Agreement / SLA*, default: 7 menit), memprioritaskan pesanan yang tertunda.

### 2. Prekondisi
- Tiket pesanan berada di layar KDS.

### 3. Pemicu (Trigger)
- Timer waktu tunggu tiket berjalan melebihi ambang batas SLA.

### 4. Alur Utama (Main Flow)
1. Sistem KDS secara kontinu memperbarui penghitung waktu tunggu (*elapsed time*) pada setiap tiket.
2. Kondisi Visual Berdasarkan Waktu:
   - **Waktu 0 s/d 4 Menit**: Bingkai kartu normal, timer berwarna abu-abu netral.
   - **Waktu 4 s/d 7 Menit (Mendekati Batas)**: Timer berubah menjadi warna oranye (`--warning`).
   - **Waktu > 7 Menit (Terlambat / Overdue)**:
     - Bingkai kartu berubah menjadi garis merah tebal 2 px (`--danger`).
     - Latar belakang header tiket berkedip halus.
     - Kartu dipindahkan otomatis ke posisi paling atas kolom antrean.
3. Barista segera memprioritaskan pembuatan pesanan tiket berbingkai merah tersebut terlebih dahulu.

### 5. Postkondisi
- Waktu tunggu pelanggan terkendali dan antrean lama tidak terabaikan.
