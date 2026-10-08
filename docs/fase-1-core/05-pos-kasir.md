# Modul POS Kasir (Point of Sale)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **POS Kasir** (Fase 1 Core) yang dioperasikan pada tablet mode landscape di meja kasir outlet.

---

## UC-POS-01: Buka & Tutup Shift Kasir (Modal & Rekonsiliasi Kas Fisik)

```
Use Case ID      : UC-POS-01
Nama Use Case    : Buka & Tutup Shift Kasir
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Kasir Outlet
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Mengelola siklus pertanggungjawaban kas kasir harian: menginput uang kas modal awal di laci kas saat memulai jam kerja dan menghitung fisik uang tunai saat pergantian atau penutupan shift kasir.

### 2. Prekondisi
- Aplikasi POS Kasir terbuka pada tablet kasir outlet.

### 3. Pemicu (Trigger)
- Kasir memulai atau mengakhiri jadwal jam kerja shift (*opening/closing shift*).

### 4. Alur Utama (Main Flow - Buka Shift)
1. Kasir memasukkan PIN 4–6 digit akun kasir miliknya.
2. Sistem memvalidasi PIN dan mendeteksi belum ada shift kasir yang aktif pada terminal POS tersebut.
3. Sistem memunculkan modal dialog **Buka Shift Baru**.
4. Kasir menghitung fisik uang kembalian di laci kas dan menginput **Modal Kas Awal** (contoh: Rp 250.000,-).
5. Kasir menekan tombol **Buka Shift**.
6. Sistem mencatat nomor shift, nama kasir, timestamp buka, dan mengaktifkan katalog POS.

### 5. Alur Utama (Main Flow - Tutup Shift & Rekonsiliasi)
1. Di akhir jam kerja, Kasir memilih tombol menu **Kelola Shift > Tutup Shift**.
2. Sistem menyajikan ringkasan sementara transaksi shift berjalan:
   - Total Penjualan Tunai (Cash Sales).
   - Total Penjualan Non-Tunai (QRIS / E-Wallet).
   - Total Volume Transaksi.
   - **Ekspektasi Uang Tunai di Laci** = Modal Awal + Penjualan Tunai.
3. Kasir menghitung fisik seluruh uang kertas dan koin di laci, lalu menginput nilai **Kas Fisik Aktual**.
4. Sistem menghitung selisih kas (*variance*):
   - Jika Pas: Selisih Rp 0.
   - Jika Kurang/Lebih (*Short / Over*): Sistem menampilkan nominal selisih dengan warna peringatan.
5. Kasir mengisi catatan alasan selisih (jika ada) dan menekan tombol **Konfirmasi Tutup Shift**.
6. Sistem mengunci shift, mencetak slip ringkasan shift (*X-Report / Z-Report* simulasi), dan memancarkan event `ShiftClosed`.
7. Layar kembali ke tampilan login PIN untuk kasir shift berikutnya.

### 6. Postkondisi
- Riwayat transaksi shift tersimpan rapi dan risiko selisih uang tunai tercatat transparan.

---

## UC-POS-02: Cari & Pilih Menu Berdasarkan Outlet Aktif

```
Use Case ID      : UC-POS-02
Nama Use Case    : Cari & Pilih Menu Berdasarkan Outlet Aktif
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
```

### 1. Deskripsi
Menyajikan katalog produk yang secara dinamis disaring khusus untuk outlet yang sedang beroperasi, menggabungkan menu standar global dengan menu lokal unik yang telah disetujui untuk cabang tersebut.

### 2. Prekondisi
- Shift kasir aktif.

### 3. Pemicu (Trigger)
- Pelanggan walk-in mendatangi meja kasir untuk memesan.

### 4. Alur Utama (Main Flow)
1. Kasir melihat antarmuka POS berupa grid menu di sisi kiri layar (~65% lebar layar) dan keranjang pesanan di sisi kanan layar (~35%).
2. Di bagian atas grid terdapat tab kategori (*All, Coffee, Non-Coffee, Tea, Pastry*) dan bilah pencarian cepat.
3. Sistem hanya memuat menu yang aktif untuk outlet ini:
   - Menu standar brand (contoh: *Es Kopi Susu, Americano, Latte*).
   - Menu lokal unik outlet yang telah disetujui Admin Pusat (contoh: *Es Kopi Pandan Wangi* pada outlet Sudirman) (UC-BO-11).
4. Harga yang tertera adalah **Harga Jual Dasar Walk-In** (tanpa markup app online) (BR-10).
5. Kasir mengetuk kartu menu yang diinginkan pelanggan.

### 5. Postkondisi
- Item terpilih dibuka untuk konfigurasi kustomisasi modifier (UC-POS-03) atau langsung masuk keranjang jika tanpa modifier.

### 6. Aturan Bisnis Terkait
- **BR-09**: Menu lokal outlet otomatis muncul di POS outlet terkait setelah disetujui.
- **BR-10**: Harga dasar di POS walk-in tidak terkena markup channel app order.

---

## UC-POS-03: Kustomisasi Pesanan (Modifier, Add-ons, Catatan)

```
Use Case ID      : UC-POS-03
Nama Use Case    : Kustomisasi Pesanan (Modifier, Add-ons, Catatan)
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
```

### 1. Deskripsi
Memilih varian ukuran, level gula, takaran es, penggantian susu, dan tambahan espresso shot sesuai permintaan spesifik pelanggan, serta mencatat instruksi khusus untuk barista.

### 2. Prekondisi
- Kasir mengetuk menu yang memiliki konfigurasi modifier di grid POS.

### 3. Pemicu (Trigger)
- Pelanggan meminta penyesuaian resep standar minuman.

### 4. Alur Utama (Main Flow)
1. Sistem membuka bottom sheet/modal kustomisasi produk:
   - **Ukuran Cup**: *Regular (16oz)* [Default / +Rp 0] atau *Large (22oz)* [+Rp 4.000].
   - **Tingkat Kemanisan (Sugar Level)**: *Normal (100%)*, *Less Sugar (50%)*, *No Sugar (0%)*.
   - **Tingkat Es (Ice Level)**: *Normal Ice*, *Less Ice*, *No Ice*.
   - **Penggantian Susu**: *Fresh Milk* [+Rp 0] atau *Oatmilk* [+Rp 6.000].
   - **Add-ons**: Checkbox *Extra Shot* [+Rp 5.000].
   - **Catatan Barista**: Kolom teks singkat (contoh: *"pisahkan es di cup terpisah"*).
2. Kasir mengetuk pilihan yang diminta pelanggan.
3. Sistem secara otomatis mengkalkulasi harga item beserta penambahan biaya modifier secara real-time.
4. Kasir menekan tombol **Tambah ke Pesanan**.
5. Item masuk ke keranjang belanja di sisi kanan layar dengan rincian modifier tercantum jelas di bawah nama produk.
6. Subtotal keranjang belanja diperbarui.

### 5. Postkondisi
- Item dengan modifier spesifik tersimpan di memori keranjang transaksi.

---

## UC-POS-04: Checkout Pembayaran Walk-In (Tunai & QRIS Simulasi)

```
Use Case ID      : UC-POS-04
Nama Use Case    : Checkout Pembayaran Walk-In
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
Aktor Pendukung  : Pelanggan
```

### 1. Deskripsi
Memproses pembayaran atas item yang ada di keranjang kasir, mendukung metode uang tunai dengan perhitungan kembalian otomatis maupun QRIS dinamis simulasi Midtrans.

### 2. Prekondisi
- Keranjang belanja berisi minimal 1 item pesanan.

### 3. Pemicu (Trigger)
- Pelanggan selesai memilih menu dan kasir menekan tombol besar **Bayar (Total: Rp XX.XXX)** di bawah keranjang.

### 4. Alur Utama (Main Flow - Skenario QRIS Simulasi)
1. Kasir menekan tombol **Bayar**.
2. Sistem membuka modal pilihan metode pembayaran: *QRIS*, *Tunai*, *Kartu Debit*.
3. Kasir memilih tombol **QRIS**.
4. Sistem menampilkan layar pembayaran QRIS: kode QR dinamis bernilai tepat sesuai total tagihan pesanan (BR-15).
5. Pelanggan memindai QR (di demo: kasir menekan tombol interaktif *"Simulasikan Sukses Bayar"*).
6. Gateway pembayaran mengembalikan status sukses pelunasan (`PaymentCaptured`).
7. Sistem menandai transaksi berstatus `PAID`, menerbitkan Nomor Order unik (contoh: `#W-104`), dan mencatat rincian metode pembayaran.
8. Sistem otomatis memancarkan event `PaymentCaptured` dan `OrderPlaced` dengan atribut `channel: "pos"`.
9. Sistem meneruskan tiket pesanan ke KDS Barista secara instan (UC-POS-06).
10. Keranjang belanja dibersihkan dan layar menampilkan kartu konfirmasi transaksi sukses.

### 5. Alur Alternatif (Skenario Pembayaran Tunai)
- **3a. Kasir Memilih Pembayaran Tunai**: Kasir memilih tombol **Tunai**.
- **4a. Menghitung Kembalian**: Sistem menyajikan tombol uang cepat (Uang Pas, Rp 50.000, Rp 100.000) atau input manual. Kasir menginput uang diterima Rp 50.000,- untuk tagihan Rp 22.000,-. Sistem otomatis menampilkan **Uang Kembalian: Rp 28.000,-** dan membuka laci kas fisik (*cash drawer*).
- **5a. Selesaikan**: Kasir menekan **Selesai / Buka Laci**. Sistem memancarkan event `OrderPlaced` dan mengirim tiket ke KDS.

### 6. Postkondisi
- Transaksi lunas tercatat, kas/saldo bertambah, dan pesanan diteruskan ke barista dapur.

### 7. Aturan Bisnis Terkait
- **BR-15**: Pembayaran pelanggan memakai simulasi QRIS via Midtrans.

---

## UC-POS-05: Terima / Tolak Pesanan Online dari App Pelanggan

```
Use Case ID      : UC-POS-05
Nama Use Case    : Terima / Tolak Pesanan Online dari App Pelanggan
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
Aktor Pendukung  : Pelanggan
```

### 1. Deskripsi
Menerima notifikasi pesanan online yang dibuat oleh pelanggan melalui App Pelanggan dengan penanda badge "Online", meninjau beban antrean, dan memberikan konfirmasi terima atau tolak.

### 2. Prekondisi
- Pelanggan berhasil melakukan pembayaran pesanan di App Pelanggan (UC-CUS-05).

### 3. Pemicu (Trigger)
- Event `OrderPlaced` dengan atribut `channel: "app"` diterima via `BroadcastChannel`.

### 4. Alur Utama (Main Flow)
1. Sistem POS Kasir membunyikan nada dering lonceng notifikasi dan menampilkan lencana merah pada tab **Pesanan Masuk (Online Orders)**.
2. Kasir mengetuk tab pesanan online untuk memeriksa rincian:
   - Nama Pelanggan & Nomor Antrean Online.
   - Badge penanda warna biru: **"Online App"**.
   - Daftar item minuman, modifier, dan catatan khusus.
   - Status Pembayaran: *Sudah Lunas via QRIS*.
3. Kasir menekan tombol hijau **Terima Pesanan (Accept Order)**.
4. Sistem meminta konfirmasi estimasi waktu penyiapan (default: 10 menit).
5. Sistem memancarkan event `OrderAccepted`.
6. Tiket pesanan online langsung diteruskan ke KDS Barista dengan label khusus pesanan app online (UC-POS-06).
7. Di smartphone pelanggan, status pesanan secara real-time berubah menjadi *"Pesanan Diterima & Disiapkan"*.

### 5. Alur Alternatif (Kasir Menolak Pesanan Online)
- **3a. Menolak Pesanan**: Jika kapasitas mesin espresso sedang bermasalah atau bahan tumpah darurat, kasir menekan tombol merah **Tolak Pesanan**.
- **4a. Mengisi Alasan**: Kasir memilih alasan penolakan (misal: *"Antrean operasional penuh / kendala teknis"*).
- **5a. Pembatalan**: Sistem memancarkan event `OrderCancelled`. Sistem di smartphone pelanggan menampilkan notifikasi bahwa pesanan dibatalkan beserta informasi refund simulasi.

### 6. Postkondisi
- Pesanan online terverifikasi oleh kasir cabang dan dialirkan ke proses peracikan barista.

---

## UC-POS-06: Dispatch Tiket Pesanan Otomatis ke KDS Barista

```
Use Case ID      : UC-POS-06
Nama Use Case    : Dispatch Tiket Pesanan Otomatis ke KDS Barista
Modul            : POS Kasir (Sistem Integrasi)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Sistem POS Kasir
Aktor Pendukung  : Barista Outlet
```

### 1. Deskripsi
Mengirimkan data tiket pesanan yang telah berstatus lunas (baik pesanan kasir walk-in maupun pesanan online yang diterima) langsung ke layar KDS Barista secara nirkabel dan instan tanpa menggunakan kertas bon manual.

### 2. Prekondisi
- Transaksi walk-in berstatus lunas atau transaksi online berstatus diterima kasir.

### 3. Pemicu (Trigger)
- Eksekusi transaksi lunas di terminal POS.

### 4. Alur Utama (Main Flow)
1. Sistem POS menyusun payload tiket pesanan:
   - `orderId`: ID unik pesanan.
   - `ticketNumber`: Nomor tiket urut harian (contoh: `#A-101`).
   - `channel`: Penanda asal (`pos` atau `app`).
   - `customerName`: Nama pelanggan pemesan.
   - `items`: Array item produk beserta modifier dan catatan khususnya.
   - `timestamp`: Waktu transaksi diselesaikan.
2. Sistem memancarkan event `OrderPlaced` / `OrderAccepted` melalui `BroadcastChannel` lokal.
3. KDS Barista yang berada di dapur/bar menerima payload event dan merender kartu tiket baru di kolom antrean dalam waktu < 100 ms.

### 5. Postkondisi
- Tiket pesanan tampil di layar barista tanpa ada penundaan komunikasi (*paperless kitchen*).

---

## UC-POS-07: Cetak & Tampilkan Struk Digital Transaksi

```
Use Case ID      : UC-POS-07
Nama Use Case    : Cetak & Tampilkan Struk Digital Transaksi
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Kasir Outlet
```

### 1. Deskripsi
Menampilkan pratinjau struk resmi transaksi digital di layar tablet kasir dan menyediakan opsi cetak simulasi ke printer thermal kasir atau pengiriman via WhatsApp.

### 2. Prekondisi
- Transaksi telah berhasil dibayar.

### 3. Pemicu (Trigger)
- Kasir mengetuk opsi cetak struk atau pelanggan meminta tanda terima fisik.

### 4. Alur Utama (Main Flow)
1. Sistem memunculkan jendela pratinjau **Struk Pembayaran**:
   - Logo & Nama Brand (*Kopi Jodi*).
   - Nama Cabang, Alamat, dan Nomor Telepon Outlet.
   - Nomor Struk, Tanggal, Jam, dan Nama Kasir.
   - Rincian Item: Nama produk, kuantitas, harga, dan modifier.
   - Subtotal, Diskon (jika ada), Pajak Restoran, dan Total Akhir.
   - Metode Pembayaran (Tunai / QRIS) dan Uang Kembalian.
   - Pesan Penutup ramah: *"Terima kasih atas kunjungan Anda!"*.
2. Kasir menekan tombol **Cetak Struk**.
3. Sistem mengirimkan perintah cetak ke modul thermal printer (di demo: menampilkan animasi struk keluar dari mesin printer).

### 5. Postkondisi
- Bukti transaksi sah diserahkan kepada pelanggan.

---

## UC-POS-08: Pembatalan / Void Transaksi dengan PIN Supervisor

```
Use Case ID      : UC-POS-08
Nama Use Case    : Pembatalan / Void Transaksi
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Kasir Outlet
Aktor Pendukung  : Store Manager / Supervisor
```

### 1. Deskripsi
Membatalkan transaksi penjualan yang keliru sebelum minuman dibuat oleh barista, memerlukan otorisasi berupa PIN supervisor untuk mencegah penyalahgunaan pembatalan sepihak.

### 2. Prekondisi
- Transaksi telah terinput di POS namun status di KDS masih "Baru" (belum dibuat oleh barista).

### 3. Pemicu (Trigger)
- Pelanggan salah menyebutkan menu atau membatalkan pesanan di kasir.

### 4. Alur Utama (Main Flow)
1. Kasir membuka menu **Riwayat Transaksi Shift**.
2. Kasir memilih transaksi yang hendak dibatalkan dan menekan tombol **Void Transaksi**.
3. Sistem memunculkan dialog otorisasi: meminta **PIN Supervisor / Store Manager**.
4. Store Manager memasukkan PIN supervisor yang sah.
5. Kasir memilih alasan pembatalan (contoh: *Salah input item / Pelanggan ganti pesanan*).
6. Sistem memverifikasi PIN dan mengubah status transaksi menjadi `Voided / Cancelled`.
7. Sistem memancarkan event `OrderCancelled`.
8. Tiket terkait di layar KDS Barista otomatis ditarik dari antrean.
9. Laporan kasir mencatat riwayat void tersebut secara transparan.

### 5. Postkondisi
- Transaksi dibatalkan secara sah dengan jejak audit supervisor yang terdokumentasi.

---

## UC-POS-09: Peringatan Stok Kritis & Auto-Sold Out Menu di POS

```
Use Case ID      : UC-POS-09
Nama Use Case    : Peringatan Stok Kritis & Auto-Sold Out Menu di POS
Modul            : POS Kasir
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Kasir Outlet / Sistem
```

### 1. Deskripsi
Secara otomatis menandai menu tertentu dengan label "Habis (Sold Out)" dan menonaktifkan tombol pemesanannya apabila salah satu bahan baku utama pada formula resep menu tersebut memiliki saldo stok 0 di outlet.

### 2. Prekondisi
- Terjadi konsumsi stok di outlet sehingga salah satu bahan mencapai kuantitas 0 (misal: stok biji kopi habis).

### 3. Pemicu (Trigger)
- Event `StockConsumed` atau `LowStockAlert` diterima oleh terminal POS.

### 4. Alur Utama (Main Flow)
1. Domain engine mengevaluasi sisa stok seluruh bahan baku terhadap formula resep seluruh menu aktif.
2. Jika suatu bahan penting habis total (misal: *Biji Kopi House Blend* = 0 gram):
   - Sistem menandai seluruh menu berbasis espresso (*Americano, Latte, Cappuccino, Es Kopi Susu*) dengan overlay abu-abu.
   - Pada kartu menu muncul badge merah: **"Habis"**.
3. Kasir tidak dapat menambahkan menu yang berstatus habis ke dalam keranjang belanja.
4. Kasir dapat menginformasikan ketiadaan menu tersebut kepada pelanggan secara akurat tanpa harus bertanya ke barista dapur.

### 5. Postkondisi
- Terhindar dari insiden transaksi gantung di mana kasir menerima uang untuk menu yang bahannya sudah tidak tersedia di dapur.
