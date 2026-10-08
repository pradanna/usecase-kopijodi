# Modul Demo Stage Orchestrator (Shell Presentasi Interaktif)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **Demo Stage Orchestrator** (Shell Presentasi Lintas Aplikasi) yang bertindak sebagai bingkai orkestrasi multi-perangkat di laptop presenter untuk mendemokan seluruh ekosistem secara interaktif kepada calon klien / investor.

---

## UC-STG-01: Orkestrasi Multi-Perangkat (Device Frames Laptop, HP, Tablet)

```
Use Case ID      : UC-STG-01
Nama Use Case    : Orkestrasi Multi-Perangkat (Device Frames)
Modul            : Demo Stage Orchestrator
Fase             : Demo Shell (Cross-Phase)
Prioritas        : P0
Aktor Utama      : Presenter / Developer
Aktor Pendukung  : Audiens Presentasi (Calon Klien)
```

### 1. Deskripsi
Menampilkan beberapa aplikasi mini secara simultan di dalam bingkai perangkat fisik yang realistis (smartphone portrait, tablet POS landscape, monitor KDS, dan browser desktop Backoffice) di dalam satu layar laptop presenter dengan tata letak (*layout*) yang fleksibel.

### 2. Prekondisi
- Presenter membuka browser pada rute `/stage`.

### 3. Pemicu (Trigger)
- Presenter memulai sesi presentasi ekosistem aplikasi di hadapan klien.

### 4. Alur Utama (Main Flow)
1. Presenter membuka Demo Stage.
2. Sistem merender antarmuka panggung multi-perangkat:
   - **Bingkai Smartphone Kiri**: Menjalankan App Pelanggan (PWA).
   - **Bingkai Tablet Tengah**: Menjalankan POS Kasir.
   - **Bingkai Monitor Dapur**: Menjalankan KDS Barista.
   - **Bingkai Smartphone Kanan**: Menjalankan App Operasi Outlet.
3. Seluruh aplikasi dimuat menggunakan iframe mandiri dengan query parameter `?embed=1` (menghilangkan chrome luar browser).
4. Setiap bingkai perangkat digambar menggunakan border bezel abu-abu elegan, bayangan elevasi halus, dan label peran di bawahnya (contoh: *"POS Kasir - Tablet"*, *"App Pelanggan - HP"*).
5. Presenter dapat memilih mode tata letak:
   - *Grid Seimbang (2x2)*.
   - *Fokus 1 Aplikasi Besar + 3 Aplikasi Mini*.
   - *Layar Penuh Tunggal (Full Screen)*.

### 5. Postkondisi
- Klien dapat melihat interaksi seluruh aplikasi bekerja bersamaan secara visual dalam satu pandangan mata.

---

## UC-STG-02: Mode Presentasi Otomatis "Satu Gelas, Satu Cerita"

```
Use Case ID      : UC-STG-02
Nama Use Case    : Mode Presentasi Otomatis "Satu Gelas, Satu Cerita"
Modul            : Demo Stage Orchestrator
Fase             : Demo Shell (Cross-Phase)
Prioritas        : P0
Aktor Utama      : Presenter / Developer
Aktor Pendukung  : Klien
```

### 1. Deskripsi
Menjalankan skenario utama "Satu Gelas, Satu Cerita" secara otomatis dari awal hingga akhir (9 langkah berurutan) dengan jeda waktu teratur, penyorotan visual (*glow highlight*) pada aplikasi yang sedang aktif, dan teks narasi penjelasan di bilah bawah layar selama 5–7 menit.

### 2. Prekondisi
- Demo Stage aktif dan data seed awal bersih.

### 3. Pemicu (Trigger)
- Presenter menekan tombol besar **"Play Demo (Skenario Utama)"**.

### 4. Alur Utama (Main Flow)
1. Presenter menekan tombol **Play Demo**.
2. Sistem memulai orkestrator skenario otomatis:
   - **Langkah 1 (Pelanggan Pesan)**: Bingkai App Pelanggan mendapat sorotan cincin bersinar (`ring-2 ring-brand-600`). Narasi muncul di bawah: *"Pelanggan memesan Es Kopi Susu via aplikasi dan membayar dengan QRIS"*. Event `OrderPlaced` dipancarkan.
   - **Langkah 2 (POS Kasir Terima)**: Garis partikel animasi mengalir dari HP Pelanggan ke Tablet POS. Tiket pesanan online muncul di POS Kasir. Narasi: *"Kasir menerima pesanan online tanpa perlu input manual"*. Event `OrderAccepted` dipancarkan.
   - **Langkah 3 (KDS Barista Buat Minuman)**: Partikel berpindah dari POS ke KDS Barista. Kartu tiket berpindah status *Mulai* $\rightarrow$ *Siap*. Narasi: *"Barista meracik minuman, status di HP pelanggan bergerak live"*. Event `OrderReady` dipancarkan.
   - **Langkah 4 (Pemotongan Stok Resep)**: Sistem memotong stok kopi, susu, dan cup secara otomatis. Narasi: *"Stok bahan terpotong presisi sesuai resep"*. Event `StockConsumed` dipancarkan.
   - **Langkah 5 (Alert Stok Menipis)**: Saldo susu melewati batas safety stock. Bingkai App Operasi bergetar membunyikan alert. Narasi: *"Sistem mendeteksi stok susu menipis dan memberi alert ke Store Manager"*. Event `LowStockAlert` dipancarkan.
   - **Langkah 6 (PO Tanpa Harga)**: Store Manager di App Operasi menerbitkan PO susu ke pusat tanpa harga. Narasi: *"Store Manager membuat PO tanpa harga ke pusat"*. Event `PORequested` dipancarkan.
   - **Langkah 7 (Terima Barang Menunggu Nota)**: Store Manager mengonfirmasi barang tiba. Narasi: *"Barang diterima fisik, stok bertambah status 'Menunggu Nota' dengan HPP sementara"*. Event `GoodsReceived` dipancarkan.
   - **Langkah 8 (Finance Input Nota & True-Up HPP)**: Layar beralih menampilkan Finance Backoffice menginput faktur resmi. Narasi: *"Finance menginput faktur asli, HPP terkoreksi otomatis (true-up) dan hutang tercatat"*. Event `InvoiceEntered` dan `HppRecalculated` dipancarkan.
   - **Langkah 9 (Owner & Mitra Terupdate)**: Layar beralih menampilkan Owner Dashboard dan Portal Mitra. Grafik omzet, HPP terkoreksi, dan laba bergerak live. Narasi: *"Laporan omzet dan laba Owner serta Mitra terupdate akurat secara real-time"*.
3. Skenario selesai sukses 100% tanpa campur tangan klik manual.

### 5. Postkondisi
- Klien terkesima dan memahami sepenuhnya nilai proposisi arsitektur terpadu sistem.

---

## UC-STG-03: Kontrol Presenter, Alih Peran (Role Switcher), & Event Log Live

```
Use Case ID      : UC-STG-03
Nama Use Case    : Kontrol Presenter, Alih Peran, & Event Log Live
Modul            : Demo Stage Orchestrator
Fase             : Demo Shell (Cross-Phase)
Prioritas        : P0
Aktor Utama      : Presenter / Developer
```

### 1. Deskripsi
Menyediakan bilah kontrol interaktif bagi presenter selama presentasi: tombol Pause/Resume, pengatur kecepatan (0.5x, 1x, 2x), tombol lompat langkah (*next/prev step*), pengalih peran cepat (*Role Switcher*), dan panel inspeksi Event Log live di sisi kanan layar.

### 2. Prekondisi
- Demo Stage aktif.

### 3. Pemicu (Trigger)
- Presenter ingin menjawab pertanyaan mendadak dari calon klien atau memperlambat animasi untuk penjelasan detail.

### 4. Alur Utama (Main Flow)
1. **Kontrol Pemutaran**:
   - Presenter dapat menekan tombol **Pause** sewaktu-waktu untuk menghentikan alur otomatis saat klien bertanya.
   - Presenter dapat menekan tombol **Kecepatan** (memilih *0.5x* untuk alur lambat dramatis, atau *2x* untuk demonstrasi cepat).
   - Presenter dapat menekan tombol **Langkah Berikutnya (Next)** atau **Langkah Sebelumnya (Prev)**.
2. **Alih Peran Cepat (Role Switcher)**:
   - Presenter dapat mengklik tombol role: *Pelanggan, Kasir, Barista, Store Manager, Finance, Owner, Mitra*.
   - Sistem secara instan memperbesar (*zoom focus*) bingkai aplikasi yang bersangkutan dan menampilkan sudut pandang peran tersebut.
3. **Inspeksi Event Log Live (Di Balik Layar)**:
   - Presenter membuka panel samping **Live Event Log**.
   - Sistem menampilkan kronologi event yang baru saja dipancarkan secara transparan: ID Event (ULID), Tipe Event (`OrderPlaced`, `StockConsumed`, `HppRecalculated`), Waktu (ts), dan Payload JSON ringkas.
   - Menunjukkan kepada tim teknis klien bahwa sistem dibangun di atas arsitektur *event-driven* yang solid.

### 5. Postkondisi
- Presenter memegang kendali penuh atas tempo presentasi.

---

## UC-STG-04: White-Label Theme Switcher Instan (Nusa ke Teras Kopi)

```
Use Case ID      : UC-STG-04
Nama Use Case    : White-Label Theme Switcher Instan
Modul            : Demo Stage Orchestrator
Fase             : Demo Shell (Cross-Phase)
Prioritas        : P1
Aktor Utama      : Presenter / Developer
Aktor Pendukung  : Klien
```

### 1. Deskripsi
Mendemonstrasikan keunggulan komersial bahwa sistem dapat dijual ulang (*white-label*) ke berbagai brand kopi lain: dengan 1-klik mengubah nama merek, logo, dan variabel warna CSS di seluruh aplikasi secara serentak tanpa perlu memuat ulang (*reload*) browser.

### 2. Prekondisi
- Demo Stage sedang berjalan.

### 3. Pemicu (Trigger)
- Presenter ingin menunjukkan kapabilitas multi-tenant / white-label platform.

### 4. Alur Utama (Main Flow)
1. Presenter membuka pemilih merek pada bilah atas Stage: **Brand Switcher**.
2. Sistem menyajikan 2 profil merek contoh:
   - **Brand A**: *Kopi Jodi* (Warna aksen cokelat kopi hangat `#7A4A2B`, gaya modern hangat).
   - **Brand B**: *Teras Kopi* (Warna aksen hijau toska elegan `#0B6666`, gaya minimalis sejuk).
3. Presenter memilih brand kedua: **"Teras Kopi"**.
4. Sistem memancarkan event `BrandThemeChanged`.
5. Tanpa reload aplikasi, variabel token CSS `:root` (`--brand-600`, `--brand-50`, logo header) berubah seketika di seluruh iframe:
   - Seluruh tombol utama, tab aktif, dan kartu promo berganti warna menjadi hijau toska.
   - Logo dan nama brand di POS, KDS, HP Pelanggan, dan Backoffice berganti menjadi "Teras Kopi".
6. Seluruh kontras warna tetap memenuhi standar aksesibilitas WCAG AA (kontras teks putih $\ge 4.5:1$).

### 5. Postkondisi
- Calon klien melihat bukti nyata bahwa platform ini sangat modular dan siap dikustomisasi untuk identitas brand mereka.

### 7. Aturan Bisnis Terkait
- **BR-17**: Satu instalasi per brand, siap white-label (light mode only).

---

## UC-STG-05: Reset State Demo & Seeding Ulang IndexedDB

```
Use Case ID      : UC-STG-05
Nama Use Case    : Reset State Demo & Seeding Ulang IndexedDB
Modul            : Demo Stage Orchestrator
Fase             : Demo Shell (Cross-Phase)
Prioritas        : P0
Aktor Utama      : Presenter / Developer
```

### 1. Deskripsi
Mengembalikan kondisi seluruh database demo lokal (IndexedDB) ke titik awal (*T0 - Clean Seed State*) hanya dengan 1-klik, menghapus seluruh event log transaksi yang telah dijalankan, dan memuat ulang data dummy realistis (3 outlet, 20 menu, 25 bahan baku, riwayat 14 hari).

### 2. Prekondisi
- Skenario demo telah dijalankan dan presenter ingin mengulangnya untuk audiens berikutnya.

### 3. Pemicu (Trigger)
- Presenter menekan tombol merah **"Reset Demo Data"** di bilah bawah kontrol panggung.

### 4. Alur Utama (Main Flow)
1. Presenter menekan tombol **Reset Demo Data**.
2. Sistem memunculkan modal dialog konfirmasi: *"Apakah Anda yakin ingin mengembalikan seluruh data demo ke kondisi awal?"*.
3. Presenter mengonfirmasi dengan menekan **Ya, Reset Data**.
4. Sistem mengeksekusi prosedur reset:
   - Mengosongkan tabel `events` dan `snapshots` pada IndexedDB browser.
   - Menginjeksi ulang (*seeding*) data awal:
     - 3 Outlet (Sudirman, Kemang, Senopati).
     - 20 Item Menu kopi dan makanan.
     - 25 Bahan Baku beserta saldo stok segar.
     - Riwayat transaksi dummy 14 hari terakhir agar grafik dashboard tetap terlihat hidup.
5. Sistem memancarkan event `DemoReset`.
6. Seluruh iframe aplikasi memuat ulang state lokalnya dari awal dalam waktu < 500 ms.
7. Panggung siap untuk sesi demonstrasi baru.

### 5. Postkondisi
- Demo selalu dapat dipulihkan ke kondisi prima tanpa residu galat data masa lalu.
