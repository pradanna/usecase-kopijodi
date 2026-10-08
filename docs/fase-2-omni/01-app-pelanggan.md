# Modul App Pelanggan (Customer Mobile App / PWA)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **App Pelanggan** (Fase 2 Omni) yang dijalankan oleh konsumen kopi pada smartphone (Android / iOS / PWA) untuk pemesanan online, kustomisasi produk, pembayaran QRIS, dan pelacakan live status pesanan.

---

## UC-CUS-01: Registrasi & Login Cepat Pelanggan (OTP Simulasi)

```
Use Case ID      : UC-CUS-01
Nama Use Case    : Registrasi & Login Cepat Pelanggan
Modul            : App Pelanggan
Fase             : Fase 2 (Omni)
Prioritas        : P1
Aktor Utama      : Pelanggan
```

### 1. Deskripsi
Memungkinkan pelanggan untuk masuk (*sign in*) atau mendaftar ke aplikasi menggunakan nomor ponsel aktif dan verifikasi kode OTP simulasi secara cepat tanpa kata sandi rumit.

### 2. Prekondisi
- Aplikasi pelanggan terbuka di web browser/PWA smartphone.

### 3. Pemicu (Trigger)
- Pelanggan membuka aplikasi pertama kali atau mengakses menu akun.

### 4. Alur Utama (Main Flow)
1. Sistem menampilkan layar pembuka (*onboarding*) yang menampilkan keunggulan brand *"Satu Gelas, Satu Cerita"*.
2. Pelanggan memasukkan nomor ponsel aktif (contoh: `081234567890`) dan menekan **Lanjut**.
3. Sistem menampilkan layar verifikasi kode OTP 4-digit.
4. Di lingkungan demo, sistem menampilkan hint kode OTP otomatis (contoh: `1234`) atau mengisi otomatis pada input field.
5. Pelanggan mengonfirmasi kode OTP.
6. Sistem memvalidasi kode dan mengaktifkan sesi login pelanggan.
7. Sistem mengarahkan pelanggan ke layar pemilihan outlet terdekat (UC-CUS-02).

### 5. Postkondisi
- Pelanggan terautentikasi dan data profil/keranjang terhubung ke akun pelanggan.

---

## UC-CUS-02: Pilih Outlet Kopi Terdekat & Info Operasional

```
Use Case ID      : UC-CUS-02
Nama Use Case    : Pilih Outlet Kopi Terdekat & Info Operasional
Modul            : App Pelanggan
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
```

### 1. Deskripsi
Mendeteksi lokasi pelanggan atau menampilkan daftar gerai kopi yang tersedia, mengurutkan berdasarkan jarak terdekat, serta menampilkan status buka/tutup dan estimasi waktu penyiapan pesanan.

### 2. Prekondisi
- Pelanggan telah berada di aplikasi.

### 3. Pemicu (Trigger)
- Pelanggan hendak memulai pemesanan kopi (*Pick-Up Order*).

### 4. Alur Utama (Main Flow)
1. Sistem meminta izin akses lokasi perangkat (atau menggunakan simulasi koordinat demo).
2. Sistem menyajikan daftar outlet terdekat:
   - Nama Outlet (contoh: *Kopi Jodi - Sudirman*).
   - Jarak Fisik (contoh: *800 meter*).
   - Status Jam Operasional (contoh: *Buka • Tutup pukul 22.00*).
   - Estimasi Waktu Penyiapan (contoh: *~10–15 menit*).
3. Pelanggan mengetuk outlet yang diinginkan (contoh: memilih *Kopi Jodi - Sudirman*).
4. Sistem mengunci konteks toko aktif ke outlet Sudirman.
5. Sistem memuat katalog menu yang relevan khusus untuk cabang tersebut (termasuk menu lokal yang disetujui untuk cabang tersebut) (UC-BO-11).

### 5. Postkondisi
- Seluruh harga, ketersediaan menu, dan promo yang tampil di layar berikutnya terikat pada outlet terpilih.

### 7. Aturan Bisnis Terkait
- **BR-09**: Menu lokal outlet hanya muncul di outlet bersangkutan.

---

## UC-CUS-03: Eksplorasi Menu Outlet & Kustomisasi Modifier

```
Use Case ID      : UC-CUS-03
Nama Use Case    : Eksplorasi Menu Outlet & Kustomisasi Modifier
Modul            : App Pelanggan
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
```

### 1. Deskripsi
Menelusuri menu minuman/makanan per kategori dengan foto produk beresolusi tinggi, melihat harga jual channel online (yang telah disesuaikan dengan persentase markup transparan), dan menyesuaikan modifier rasa.

### 2. Prekondisi
- Outlet telah dipilih oleh pelanggan.

### 3. Pemicu (Trigger)
- Pelanggan menelusuri katalog produk di smartphone.

### 4. Alur Utama (Main Flow)
1. Pelanggan melihat katalog produk yang dikelompokkan dalam kategori horizontal (*Signature Coffee, Espresso, Non-Coffee, Pastry*).
2. **Kalkulasi Harga Channel Online (BR-10)**:
   - Sistem menampilkan harga produk yang sudah diperhitungkan dengan kenaikan persentase channel app order (contoh: jika harga dasar walk-in Rp 20.000 dan markup app 15%, maka harga yang tampil adalah Rp 23.000,-).
3. Pelanggan mengetuk kartu produk (contoh: *Es Kopi Susu Aren*).
4. Sistem membuka lembar detail produk (*bottom sheet*):
   - Foto produk, nama, dan deskripsi cita rasa.
   - Pilihan Ukuran: *Regular (16oz)* [Rp 23.000] atau *Large (22oz)* [+Rp 4.500].
   - Pilihan Level Gula: *Normal (100%)*, *Less Sugar (50%)*, *No Sugar (0%)*.
   - Pilihan Level Es: *Normal Ice*, *Less Ice*.
   - Tambahan Susu & Topping: *Oatmilk Substitute* [+Rp 7.000], *Extra Shot* [+Rp 5.500].
   - Catatan Khusus untuk Barista (input teks).
5. Pelanggan menentukan preferensi racikan dan mengetuk tombol **+ Tambah ke Keranjang**.
6. Sistem memperbarui lencana keranjang belanja mengambang (*floating cart*) di bagian bawah layar.

### 5. Alur Alternatif & Eksepsi
- **3a. Menu Berstatus Habis di Outlet Terpilih**: Jika salah satu bahan resep bernilai 0 di outlet tersebut, kartu menu menampilkan badge *"Habis (Sold Out)"* dengan foto meredup (opacity 50%) dan tidak dapat diketuk.

### 6. Postkondisi
- Item pesanan kustom tersimpan di memori keranjang belanja lokal smartphone.

### 7. Aturan Bisnis Terkait
- **BR-10**: Harga dasar sama di semua channel, dengan penyesuaian kenaikan persentase khusus channel app order.

---

## UC-CUS-04: Checkout Keranjang, Markup Channel, & Kupon Diskon

```
Use Case ID      : UC-CUS-04
Nama Use Case    : Checkout Keranjang, Markup Channel, & Kupon Diskon
Modul            : App Pelanggan
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
Aktor Pendukung  : Panel CRM
```

### 1. Deskripsi
Meninjau rincian item belanjaan, melihat transparansi komponen harga dan markup biaya aplikasi, menerapkan kupon voucher promosi yang valid, dan melanjutkan ke pembayaran.

### 2. Prekondisi
- Keranjang belanja berisi minimal 1 item produk.

### 3. Pemicu (Trigger)
- Pelanggan mengetuk bilah keranjang belanja melayang di bawah layar.

### 4. Alur Utama (Main Flow)
1. Sistem membuka layar **Rincian Pesanan (Checkout)**:
   - Nama Outlet Pengambilan: *Kopi Jodi - Sudirman (Pick-Up)*.
   - Daftar Item: Nama produk, kuantitas, rincian modifier terpilih, dan harga subtotal.
2. Rincian Kalkulasi Finansial Transparan:
   - Subtotal Pesanan (Rp 46.000,-).
   - Biaya Layanan Channel App (termasuk markup % transparan).
   - Biaya Pajak PBJT / Restoran (Indikatif).
3. Pelanggan mengetuk tombol **Gunakan Voucher / Promo**.
4. Sistem membuka daftar voucher yang tersedia untuk outlet ini (UC-CRM-01 & UC-CRM-02):
   - Menampilkan voucher global yang aktif di semua outlet.
   - Menampilkan voucher khusus outlet Sudirman (misal: kode `SUDIRMANSERU` - Potongan Rp 10.000,-).
5. Pelanggan memilih voucher `SUDIRMANSERU`.
6. Sistem memvalidasi kelayakan voucher (memastikan subtotal belanja memenuhi syarat minimum Rp 40.000,-).
7. Sistem menerapkan potongan diskon (-Rp 10.000,-) dan memperbarui total tagihan akhir.
8. Pelanggan menekan tombol hijau besar **Lanjut ke Pembayaran**.

### 5. Alur Alternatif & Eksepsi
- **6a. Syarat Minimum Belanja Belum Terpenuhi**: Jika subtotal belum mencukupi batas minimum kupon, sistem menampilkan pesan error *"Minimal belanja Rp 40.000 untuk menggunakan voucher ini"* dan potongan diskon tidak diterapkan.

### 6. Postkondisi
- Pesanan siap diproses pembayarannya dengan kalkulasi diskon yang sah.

### 7. Aturan Bisnis Terkait
- **BR-11**: Promo/voucher fleksibel: global atau per outlet tertentu.

---

## UC-CUS-05: Pembayaran via QRIS Dinamis Simulasi (Midtrans)

```
Use Case ID      : UC-CUS-05
Nama Use Case    : Pembayaran via QRIS Dinamis Simulasi
Modul            : App Pelanggan (Payment Gateway)
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
Aktor Pendukung  : POS Kasir
```

### 1. Deskripsi
Menyajikan kode QRIS dinamis berstandar nasional bernilai tepat sesuai nominal total checkout, dan memfasilitasi pelunasan instan simulasi Midtrans.

### 2. Prekondisi
- Pelanggan menekan tombol lanjut ke pembayaran di layar keranjang.

### 3. Pemicu (Trigger)
- Eksekusi transaksi pembayaran di smartphone.

### 4. Alur Utama (Main Flow)
1. Sistem membuka modal layar pembayaran **QRIS Payment**:
   - Menampilkan logo resmi QRIS.
   - Kode QR Dinamis yang di-generate unik per transaksi.
   - Total Nominal Pas (contoh: Rp 39.500,-).
   - Hitung Mundur Waktu Berlaku QR (15 menit).
2. Di lingkungan demo, sistem menampilkan tombol interaktif: **"Simulasikan Bayar via M-Banking / E-Wallet"**.
3. Pelanggan mengetuk tombol simulasi bayar tersebut.
4. Gateway simulasi Midtrans mengembalikan webhook notifikasi sukses (`settlement`).
5. Status pesanan seketika berubah menjadi `PAID`.
6. Sistem menerbitkan Nomor Antrean Online unik (contoh: `#A-102`).
7. Sistem memancarkan event `PaymentCaptured` dan `OrderPlaced` dengan atribut `channel: "app"`.
8. Layar ponsel beralih secara halus ke halaman **Pelacak Pesanan Langsung (Live Tracking)** (UC-CUS-06).
9. Secara bersamaan di terminal POS Kasir outlet Sudirman berbunyi notifikasi pesanan online baru masuk (UC-POS-05).

### 5. Postkondisi
- Pembayaran lunas terverifikasi, voucher terpakai, dan tiket pesanan terkirim ke kasir cabang.

### 7. Aturan Bisnis Terkait
- **BR-15**: Pembayaran pelanggan memakai simulasi QRIS lewat Midtrans.

---

## UC-CUS-06: Live Tracking Status Pesanan Real-Time

```
Use Case ID      : UC-CUS-06
Nama Use Case    : Live Tracking Status Pesanan Real-Time
Modul            : App Pelanggan
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
Aktor Pendukung  : Kasir POS, Barista KDS
```

### 1. Deskripsi
Menyajikan pelacak animasi visual status pembuatan pesanan secara real-time di layar smartphone pelanggan yang merespons event dari POS dan KDS tanpa perlu memuat ulang (*refresh*) halaman.

### 2. Prekondisi
- Pesanan online telah dibayar sukses (`OrderPlaced`).

### 3. Pemicu (Trigger)
- Perubahan status pesanan di POS (`OrderAccepted`) atau KDS (`OrderPrepStarted`, `OrderReady`).

### 4. Alur Utama (Main Flow)
1. Pelanggan membuka layar **Pelacak Pesanan**.
2. Sistem menyajikan kartu pelacakan dengan komponen:
   - Nomor Antrean Besar: `#A-102`.
   - Nama Outlet Pengambilan: *Kopi Jodi - Sudirman*.
   - Rincian Pesanan Singkat: *1x Es Kopi Susu Aren*.
   - **Indikator Stepper 3 Tahap**:
     - *Tahap 1*: **Pesanan Diterima Kasir** (menunggu barista).
     - *Tahap 2*: **Sedang Diracik Barista**.
     - *Tahap 3*: **Siap Diambil di Bar**.
3. **Pembaruan Tahap 2 (KDS Mulai)**:
   - Saat barista menekan *Mulai* di KDS (event `OrderPrepStarted`), stepper Tahap 2 menyala aktif dengan animasi cangkir kopi mengepul.
4. **Pembaruan Tahap 3 (KDS Siap)**:
   - Saat barista menekan *Siap* di KDS (event `OrderReady`), smartphone bergetar lembut dan memutar nada lonceng sukses.
   - Stepper Tahap 3 menyala hijau terang dengan teks: *"Kopi Anda Siap Diambil! Silakan menuju Pick-up Counter dan sebutkan nomor #A-102"*.
5. Pelanggan mengambil kopi di counter gerai.
6. Saat barista/kasir menandai tiket diambil (event `OrderPickedUp`), layar berganti menampilkan ucapan *"Pesanan Selesai. Selamat Menikmati!"*.

### 5. Postkondisi
- Pelanggan mendapatkan kepastian waktu dan pengalaman pemesanan yang mulus tanpa rasa cemas menunggu.

---

## UC-CUS-07: Riwayat Transaksi & Fitur 1-Tap Reorder Menu

```
Use Case ID      : UC-CUS-07
Nama Use Case    : Riwayat Transaksi & Fitur 1-Tap Reorder Menu
Modul            : App Pelanggan
Fase             : Fase 2 (Omni)
Prioritas        : P1
Aktor Utama      : Pelanggan
```

### 1. Deskripsi
Menyimpan riwayat seluruh transaksi pemesanan masa lalu pelanggan dan menyediakan tombol praktis untuk memesan ulang varian menu beserta seluruh kustomisasi modifier favorit hanya dengan 1-ketukan.

### 2. Prekondisi
- Pelanggan pernah melakukan minimal 1 transaksi selesai di aplikasi.

### 3. Pemicu (Trigger)
- Pelanggan ingin memesan kembali menu kopi yang biasa dibelinya.

### 4. Alur Utama (Main Flow)
1. Pelanggan membuka tab **Pesanan Saya > Riwayat**.
2. Sistem menyajikan daftar kartu transaksi masa lalu yang mencantumkan tanggal pembelian, nama outlet, rincian produk, dan total pembayaran.
3. Pada kartu transaksi terakhir terdapat tombol **Pesan Ulang (Re-Order)**.
4. Pelanggan mengetuk tombol **Pesan Ulang**.
5. Sistem menyalin seluruh item, ukuran, modifier, dan catatan ke dalam keranjang belanja aktif untuk outlet terkait.
6. Sistem langsung mengarahkan pelanggan ke layar Checkout (UC-CUS-04).

### 5. Postkondisi
- Proses pemesanan pelanggan berulang menjadi sangat singkat (< 10 detik).
