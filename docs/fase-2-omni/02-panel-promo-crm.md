# Modul Panel Promo CRM (Marketing & Promosi)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **Panel Promo CRM** (Fase 2 Omni) yang digunakan oleh Tim Marketing pada web browser desktop untuk merancang strategi voucher, mengelola kampanye diskon, menentukan cakupan gerai, dan memantau dampaknya terhadap penjualan.

---

## UC-CRM-01: Pembuatan Voucher Promo Diskon (% / Nominal, Kuota, Min. Belanja)

```
Use Case ID      : UC-CRM-01
Nama Use Case    : Pembuatan Voucher Promo Diskon
Modul            : Panel Promo CRM
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Tim Marketing
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Membuat voucher diskon promosi dengan berbagai aturan fleksibel: jenis potongan (persentase % atau nominal tetap Rp), batas maksimum diskon, syarat minimum nominal belanja keranjang, batas kuota pemakaian per pelanggan, dan periode masa berlaku.

### 2. Prekondisi
- Pengguna login ke Panel CRM dengan hak akses marketing.

### 3. Pemicu (Trigger)
- Peluncuran program promosi untuk mendongkrak penjualan di periode tertentu.

### 4. Alur Utama (Main Flow)
1. Marketing membuka menu **Promosi & CRM > Kelola Voucher**.
2. Sistem menampilkan daftar voucher aktif, kedaluwarsa, dan draf.
3. Marketing menekan tombol **+ Buat Kampanye Voucher Baru**.
4. Marketing mengisi formulir parameter voucher:
   - **Kode Kupon**: Teks kapital tanpa spasi (contoh: `NGOPIHEMAT20` atau `DISKON10RB`).
   - **Judul Promo**: Teks menarik (contoh: *Promo Gajian Ngopi Hemat 20%*).
   - **Tipe Diskon**: Radio button (*Persentase [%]* atau *Nominal Tetap [Rp]*).
   - **Nilai Diskon**: Angka numerik (contoh: `20%` dengan batas maksimal diskon Rp 15.000,-, atau nominal tetap `Rp 10.000,-`).
   - **Minimum Pembelian Keranjang**: Nominal rupiah (contoh: Rp 40.000,-).
   - **Batas Kuota Pemakaian**: Angka maksimum total klaim voucher (contoh: 500 kuota).
   - **Masa Berlaku**: Tanggal & jam mulai s/d tanggal & jam berakhir.
5. Marketing melanjutkan ke pengaturan cakupan outlet (UC-CRM-02).
6. Marketing menekan tombol **Terbitkan Voucher (Publish)**.
7. Sistem memvalidasi parameter dan menyimpan data voucher ke database promosi.
8. Sistem memancarkan event `VoucherCreated`.
9. Voucher langsung aktif di sistem kasir POS dan App Pelanggan sesuai jadwal berlakunya.

### 5. Alur Alternatif & Eksepsi
- **4a. Kode Kupon Duplikat**: Sistem menampilkan peringatan *"Kode voucher sudah digunakan untuk kampanye lain"* dan meminta kode unik baru.
- **4b. Masa Berlaku Mundur**: Sistem memvalidasi bahwa tanggal berakhir tidak boleh lebih lampau daripada tanggal mulai.

### 6. Postkondisi
- Voucher resmi terbit dan siap digunakan oleh pelanggan.

### 7. Aturan Bisnis Terkait
- **BR-11**: Promo dan voucher fleksibel: global atau per outlet; mencatat pihak yang menanggung biaya promo.

---

## UC-CRM-02: Pengaturan Cakupan Promo (Global Seluruh Cabang vs Cabang Tertentu)

```
Use Case ID      : UC-CRM-02
Nama Use Case    : Pengaturan Cakupan Promo (Global vs Spesifik Outlet)
Modul            : Panel Promo CRM
Fase             : Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Tim Marketing
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Menentukan wilayah berlakunya voucher promosi: apakah berlaku untuk seluruh jaringan gerai kopi secara nasional (*Global Scope*) atau hanya berlaku eksklusif di cabang tertentu (*Outlet-Specific Scope*) untuk menstimulasi gerai baru atau gerai dengan trafik rendah.

### 2. Prekondisi
- Formulir voucher sedang dibuka (UC-CRM-01).

### 3. Pemicu (Trigger)
- Penentuan target segmentasi wilayah kampanye marketing.

### 4. Alur Utama (Main Flow)
1. Pada seksi **Cakupan Gerai (Store Scope)**, Marketing memilih salah satu opsi:
   - **Opsi A: Global (Seluruh Cabang)** $\rightarrow$ Kupon dapat digunakan di semua gerai Kopi Jodi.
   - **Opsi B: Gerai Spesifik** $\rightarrow$ Kupon hanya berlaku di cabang-cabang yang dicentang.
2. Marketing memilih **Opsi B (Gerai Spesifik)** dan mencentang *Kopi Jodi - Sudirman*.
3. Pada seksi **Pembebanan Biaya Promosi (Cost Allocation)**, Marketing memilih akun penanggung:
   - *Ditanggung Kantor Pusat (Head Office)*, atau
   - *Ditanggung Outlet Cabang Terkait (Branch Expense)*.
4. Marketing menyimpan pengaturan.
5. Sistem mengikat entitas voucher ke `outletId` Sudirman.
6. Sistem memancarkan event `VoucherCreated` dengan atribut cakupan wilayah.
7. Efek di sisi aplikasi:
   - Pelanggan yang memesan di outlet Sudirman dapat melihat dan menggunakan voucher tersebut di keranjang belanjanya (UC-CUS-04).
   - Pelanggan yang memilih outlet Kemang tidak akan menemukan voucher tersebut di daftar promo (sistem menolak jika kode diketik manual).

### 5. Postkondisi
- Subsidi promosi terlokalisasi tepat sasaran tanpa membebani outlet cabang lain.

### 7. Aturan Bisnis Terkait
- **BR-11**: Promo/voucher fleksibel: global atau per outlet; mencatat alokasi "ditanggung oleh".

---

## UC-CRM-03: Pratinjau Tampilan Promo di HP secara Real-Time

```
Use Case ID      : UC-CRM-03
Nama Use Case    : Pratinjau Tampilan Promo di HP secara Real-Time
Modul            : Panel Promo CRM
Fase             : Fase 2 (Omni)
Prioritas        : P1
Aktor Utama      : Tim Marketing
```

### 1. Deskripsi
Menyajikan emulator visual layar smartphone di panel sisi kanan CRM saat tim marketing mengetik data voucher, sehingga teks, warna banner, dan tata letak kartu promo di aplikasi pelanggan dapat dipastikan rapi sebelum diterbitkan ke publik.

### 2. Prekondisi
- Layar pembuatan voucher terbuka di web desktop.

### 3. Pemicu (Trigger)
- Marketing mengisi judul promo, deskripsi, atau mengunggah gambar banner.

### 4. Alur Utama (Main Flow)
1. Sistem menampilkan antarmuka terbagi dua:
   - Sisi Kiri (60%): Formulir input data teknis voucher.
   - Sisi Kanan (40%): **Live Smartphone Emulator** yang merender antarmuka App Pelanggan.
2. Setiap kali Marketing mengetik karakter di form (misal: judul *"Diskon 50% Ngopi Santai"*), teks pada kartu voucher di emulator smartphone langsung terupdate secara real-time (*what-you-see-is-what-you-get*).
3. Marketing mengunggah gambar banner promosi.
4. Emulator smartphone menampilkan banner tersebut di bagian *Carousel Promo Beranda*.
5. Marketing dapat beralih tampilan: melihat pratinjau kartu promo di halaman Beranda atau kartu kupon di lembar Checkout.

### 5. Postkondisi
- Kesalahan ketik atau format gambar terpotong dapat dideteksi dan diperbaiki sebelum kampanye dipublikasikan.

---

## UC-CRM-04: Pemantauan Efektivitas & Dampak Omzet Kampanye

```
Use Case ID      : UC-CRM-04
Nama Use Case    : Pemantauan Efektivitas & Dampak Omzet Kampanye
Modul            : Panel Promo CRM (Laporan Analitik)
Fase             : Fase 2 (Omni)
Prioritas        : P1
Aktor Utama      : Tim Marketing / Owner
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Menyajikan metrik performa kampanye promosi: jumlah voucher yang diklaim, persentase konversi penggunaan, total nilai subsidi diskon yang dikeluarkan, dan tambahan omzet kotor (*incremental sales*) yang dihasilkan.

### 2. Prekondisi
- Telah ada voucher yang digunakan oleh pelanggan dalam transaksi selesai.

### 3. Pemicu (Trigger)
- Evaluasi ROI (*Return on Investment*) kampanye promosi.

### 4. Alur Utama (Main Flow)
1. Marketing membuka menu **Promosi & CRM > Analitik Kampanye**.
2. Sistem menyajikan dasbor analitik voucher:
   - **Tingkat Utilisasi Kuota**: Menampilkan progress bar (contoh: *342 dari 500 kuota terpakai [68,4%]*).
   - **Total Nilai Diskon Diberikan (Rp)**: Akumulasi potongan harga yang dinikmati pelanggan (contoh: Rp 3.420.000,-).
   - **Total Omzet yang Dihasilkan (Rp)**: Total nilai transaksi dari pesanan yang menggunakan voucher tersebut (contoh: Rp 18.500.000,-).
   - **Rata-rata Nilai Belanja (Basket Size)**: Membandingkan rata-rata nilai order pesanan bervoucher vs tanpa voucher.
3. Marketing dapat menyaring data berdasarkan outlet tertentu untuk melihat efektivitas promo per cabang.
4. Marketing dapat menekan tombol **Hentikan Kampanye (Deactivate)** jika kuota anggaran promosi telah mencapai batas toleransi.

### 5. Postkondisi
- Manajemen memiliki data akurat untuk mengevaluasi efektivitas strategi diskon cabang.
