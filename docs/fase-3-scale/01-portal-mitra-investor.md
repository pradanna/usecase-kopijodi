# Modul Portal Mitra / Investor (Read-Only)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **Portal Mitra / Investor** (Fase 3 Scale) yang dirancang khusus sebagai antarmuka berbasis web baca-saja (*read-only*) untuk para pemilik modal / investor cabang dalam memantau kinerja operasional, HPP riil, dan kesehatan finansial gerai kemitraan mereka.

---

## UC-PRT-01: Login Mitra & Pemilihan Outlet Kemitraan

```
Use Case ID      : UC-PRT-01
Nama Use Case    : Login Mitra & Pemilihan Outlet Kemitraan
Modul            : Portal Mitra
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Mitra / Investor Cabang
```

### 1. Deskripsi
Memfasilitasi login bagi mitra/investor luar dan membatasi data yang dapat diakses hanya pada outlet-outlet yang terafiliasi dengan kepemilikan modal investor tersebut, mencegah kebocoran informasi finansial cabang milik pihak lain.

### 2. Prekondisi
- Akun mitra telah didaftarkan oleh Admin Pusat (UC-BO-03) dengan hak akses terbatas ke outlet tertentu.

### 3. Pemicu (Trigger)
- Investor membuka browser dan mengakses portal kemitraan.

### 4. Alur Utama (Main Flow)
1. Mitra mengakses portal investor melalui tautan resmi (rute: `/partner`).
2. Mitra menginput email dan kata sandi (atau autentikasi simulasi demo).
3. Sistem memverifikasi kredensial dan memuat profil mitra.
4. Pada bilah atas navigasi (*topbar*), sistem menampilkan pemilih gerai:
   - Jika mitra hanya memiliki 1 outlet (contoh: *Kopi Jodi - Sudirman*), sistem langsung menampilkan data outlet tersebut.
   - Jika mitra memiliki lebih dari 1 outlet kemitraan, sistem menyajikan dropdown untuk beralih antar outlet miliknya.
5. Sistem mengunci seluruh query data analitik secara ketat hanya pada ID outlet yang dipilih.

### 5. Postkondisi
- Sesi aktif terisolasi pada lingkup outlet kemitraan investor bersangkutan.

### 7. Aturan Bisnis Terkait
- **BR-14**: Akses portal mitra membedakan outlet milik sendiri vs outlet kemitraan secara aman.

---

## UC-PRT-02: Pantau Kinerja Penjualan Cabang (Omzet, Volume, AOV)

```
Use Case ID      : UC-PRT-02
Nama Use Case    : Pantau Kinerja Penjualan Cabang
Modul            : Portal Mitra
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Mitra / Investor Cabang
```

### 1. Deskripsi
Menyajikan dashboard analitik penjualan yang interaktif dan mudah dipahami oleh investor: kartu KPI omzet harian & bulanan, grafik tren transaksi per jam, volume cup terjual, serta nilai rata-rata per transaksi (*Average Order Value / AOV*).

### 2. Prekondisi
- Mitra telah login dan memilih outlet aktif.

### 3. Pemicu (Trigger)
- Mitra ingin meninjau hasil penjualan gerai miliknya.

### 4. Alur Utama (Main Flow)
1. Mitra membuka halaman **Kinerja Penjualan (Sales Performance)**.
2. Sistem menyajikan kartu metrik ringkasan eksekutif:
   - **Omzet Penjualan Kotor (Gross Revenue)**: Total penjualan hari ini dan bulan berjalan.
   - **Total Transaksi Selesai**: Jumlah struk/order lunas.
   - **Rata-rata Nilai Pesanan (AOV)**: Rata-rata rupiah per transaksi (contoh: Rp 42.500,- / transaksi).
   - **Pertumbuhan Tren (% MoM)**: Perbandingan terhadap performa bulan sebelumnya.
3. Sistem menyajikan **Grafik Tren Penjualan per Jam**:
   - Memetakan jam-jam tersibuk (*peak hours*, misal jam 08.00–10.00 pagi dan jam 12.00–14.00 siang).
4. Sistem menyajikan **Komposisi Kanal Penjualan**:
   - Diagram lingkaran (*pie chart*) perbandingan penjualan langsung di kasir walk-in vs pesanan online via App Pelanggan.
5. Antarmuka bersifat **baca-saja (read-only)** tanpa tombol input atau manipulasi data (BR-14).

### 5. Postkondisi
- Mitra memperoleh keyakinan dan transparansi penuh atas aktivitas penjualan gerai.

---

## UC-PRT-03: Transparansi HPP (Sementara vs Terkoreksi) & Beban Cabang

```
Use Case ID      : UC-PRT-03
Nama Use Case    : Transparansi HPP & Beban Cabang
Modul            : Portal Mitra
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Mitra / Investor Cabang
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Menyajikan transparansi rincian biaya pokok penjualan (*COGS / HPP*) bahan baku secara jujur dan terbuka, memperlihatkan status apakah HPP masih berupa estimasi sementara (*awaiting invoice*) atau sudah terkoreksi definitif (*true-up HPP*) oleh faktur resmi, serta merinci pengeluaran kas kecil operasional cabang.

### 2. Prekondisi
- Outlet kemitraan telah mencatat mutasi stok dan penjualan.

### 3. Pemicu (Trigger)
- Mitra ingin memeriksa kewajaran biaya bahan baku dan laba kotor gerai.

### 4. Alur Utama (Main Flow)
1. Mitra membuka tab **Laporan Biaya & HPP (Cost of Goods)**.
2. Sistem menyajikan tabel rekapitulasi:
   - Total Omzet Penjualan Bersih Cabang.
   - **Total HPP Bahan Baku Riil**: Akumulasi biaya kopi, susu, sirup, dan kemasan yang terpakai.
   - **Persentase Food Cost**: Rata-rata HPP terhadap penjualan (contoh: 31,5%).
   - **Status Akuntansi HPP Terkini**:
     - Menampilkan badge hijau `--success`: *"92% HPP Terkoreksi Definitif"* (berdasarkan nota resmi yang sudah diverifikasi Finance).
     - Menampilkan badge kuning `--warning`: *"8% HPP Sementara"* (menunggu faktur supplier resmi).
3. Sistem menyajikan rincian **Beban Operasional Kas Kecil Gerai**:
   - Menampilkan daftar pengeluaran darurat yang telah disetujui kantor pusat (misal: es batu darurat, sabun pembersih) beserta foto struk terlampir.
4. Sistem menghitung **Laba Kotor Operasional Cabang** = Omzet Bersih - HPP - Beban Kas Kecil.

### 5. Postkondisi
- Menghilangkan kecurigaan manipulasi pembukuan antara kantor pusat pengelola dengan investor pemodal.

### 7. Aturan Bisnis Terkait
- **BR-06**: Transparansi status HPP sementara dan HPP terkoreksi disajikan terbuka di portal mitra.

---

## UC-PRT-04: Tampilan Kepemilikan ("Belum Diatur") & Unduh Laporan PDF

```
Use Case ID      : UC-PRT-04
Nama Use Case    : Tampilan Kepemilikan & Unduh Laporan PDF
Modul            : Portal Mitra
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Mitra / Investor Cabang
```

### 1. Deskripsi
Menampilkan profil outlet kemitraan di mana kolom persentase kepemilikan saham disajikan dengan label informatif "Belum Diatur" secara tegas tanpa menampilkan perhitungan kalkulasi bagi hasil/dividen (sesuai kesepakatan penundaan skema bagi hasil), serta menyediakan tombol untuk mengunduh salinan laporan bulanan dalam format dokumen PDF resmi.

### 2. Prekondisi
- Mitra berada di portal investor.

### 3. Pemicu (Trigger)
- Mitra memeriksa profil kontrak kepemilikan atau ingin mencetak arsip laporan bulanan.

### 4. Alur Utama (Main Flow)
1. Mitra membuka menu **Profil Kemitraan & Dokumen**.
2. Sistem menyajikan ringkasan legalitas cabang:
   - Nama Gerai: *Kopi Jodi - Sudirman*.
   - Alamat & Tanggal Mulai Operasional.
   - Status Kontrak: *Kemitraan Aktif*.
   - **Persentase Kepemilikan Modal**: Menampilkan teks **"Belum Diatur (Pending Agreement)"** (sesuai BR-14).
   - Catatan Kebijakan: *"Perhitungan bagi hasil/dividen ditunda dan akan diperbarui setelah perjanjian addendum disahkan"*.
3. Pada tab **Arsip Laporan**, Mitra memilih periode bulan yang ingin diunduh (contoh: *Oktober 2026*).
4. Mitra menekan tombol **Unduh Laporan Finansial (PDF)**.
5. Sistem men-generate dokumen PDF yang memuat rekap penjualan, HPP terkoreksi, dan pengeluaran beban cabang yang terformat rapi.

### 5. Postkondisi
- Investor memiliki arsip laporan resmi tanpa menimbulkan ekspektasi bagi hasil sebelum kontrak final disepakati.

### 7. Aturan Bisnis Terkait
- **BR-14**: Kepemilikan outlet memiliki field persentase kepemilikan yang disiapkan tetapi dikosongkan; skema bagi hasil ditunda.
