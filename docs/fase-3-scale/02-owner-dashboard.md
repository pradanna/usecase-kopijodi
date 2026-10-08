# Modul Owner Dashboard (Pusat Kendali Eksekutif)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **Owner Dashboard** (Fase 3 Scale) yang dirancang untuk pendiri, direksi, dan eksekutif bisnis kopi dalam memantau denyut operasional makro seluruh jaringan outlet, mengomparasikan cabang, memproses persetujuan tingkat tinggi, serta mengantisipasi anomali finansial secara terpusat.

---

## UC-OWN-01: Konsolidasi KPI Seluruh Jaringan Outlet

```
Use Case ID      : UC-OWN-01
Nama Use Case    : Konsolidasi KPI Seluruh Jaringan Outlet
Modul            : Owner Dashboard
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Owner / Superadmin / Direksi
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Menyajikan ringkasan helikopter (*helicopter view*) dari indikator kinerja utama (*Key Performance Indicators / KPI*) yang dikonsolidasikan dari seluruh cabang kedai kopi secara real-time pada desktop atau tablet eksekutif.

### 2. Prekondisi
- Owner login ke sistem portal eksekutif dengan kredensial superadmin.

### 3. Pemicu (Trigger)
- Owner membuka dashboard untuk memantau performa jaringan bisnis hari ini.

### 4. Alur Utama (Main Flow)
1. Owner membuka rute `/owner`.
2. Sistem menyajikan **Kartu Metrik Konsolidasi Utama**:
   - **Total Omzet Jaringan Hari Ini (Gross Sales)**: Akumulasi seluruh gerai (contoh: Rp 45.820.000,-).
   - **Total Volume Transaksi**: Total struk terjual di seluruh gerai (contoh: 1.840 transaksi).
   - **Rata-rata Margin Kotor Jaringan**: Persentase laba kotor konsolidasi (contoh: 68,2%).
   - **Komposisi Kanal Penjualan**: Kasir Walk-In (62%) vs App Online Pick-Up (38%).
3. Sistem menyajikan **Grafik Tren Penjualan Komparatif**:
   - Menampilkan kurva omzet 14 hari terakhir dengan garis rata-rata target omzet harian.
4. Data metrik terhubung langsung ke event bus sehingga setiap kali terjadi transaksi di POS Kasir cabang manapun, angka total omzet di dashboard bergerak bertambah secara real-time.

### 5. Postkondisi
- Eksekutif memiliki visibilitas langsung terhadap denyut nadi pendapatan bisnis kopi tanpa perlu menunggu rekap manual akhir hari.

---

## UC-OWN-02: Komparasi Performa Cabang (Own vs Mitra) & Peringkat Outlet

```
Use Case ID      : UC-OWN-02
Nama Use Case    : Komparasi Performa Cabang & Peringkat Outlet
Modul            : Owner Dashboard
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Owner / Direksi
```

### 1. Deskripsi
Menyajikan analisis perbandingan performa antar cabang: mengelompokkan cabang milik sendiri (*own store*) vs cabang kemitraan (*partner store*), menyusun peringkat cabang terlaris (*leaderboard*), dan mendeteksi cabang yang mengalami penurunan performa.

### 2. Prekondisi
- Seluruh outlet memiliki data transaksi aktif.

### 3. Pemicu (Trigger)
- Evaluasi performa cabang bulanan atau perencanaan strategi ekspansi.

### 4. Alur Utama (Main Flow)
1. Owner membuka tab **Analisis Cabang (Store Benchmark)**.
2. Sistem menyajikan **Papan Peringkat Gerai (Branch Leaderboard)**:
   - Urutan 1: *Kopi Jodi - Sudirman* (Omzet Rp 18.500.000 / hari, 780 cup).
   - Urutan 2: *Kopi Jodi - Senopati* (Omzet Rp 15.200.000 / hari, 610 cup).
   - Urutan 3: *Kopi Jodi - Kemang* (Omzet Rp 12.120.000 / hari, 450 cup).
3. Owner dapat mengaktifkan filter **Tipe Kepemilikan**:
   - Membandingkan rata-rata omzet *Outlet Milik Sendiri* vs *Outlet Kemitraan Mitra*.
4. Sistem menyajikan metrik efisiensi per cabang:
   - **Food Cost Ratio (%)**: Persentase biaya bahan baku terhadap omzet per cabang untuk mendeteksi potensi pemborosan (*waste*) atau kebocoran takaran racikan resep di gerai tertentu.
   - **Waktu Layanan Rata-rata**: Durasi rata-rata peracikan minuman dari KDS per gerai.

### 5. Postkondisi
- Manajemen dapat memberikan pendampingan terarah ke gerai yang memiliki performa di bawah target.

---

## UC-OWN-03: Pusat Persetujuan Eksekutif Terpadu (Executive Approvals)

```
Use Case ID      : UC-OWN-03
Nama Use Case    : Pusat Persetujuan Eksekutif Terpadu
Modul            : Owner Dashboard (Approval Center)
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Owner / Superadmin
Aktor Pendukung  : Store Manager, Finance
```

### 1. Deskripsi
Menyediakan satu gerbang (*single gateway*) persetujuan bagi Owner untuk meninjau dan mengesahkan seluruh transaksi beresiko tinggi dari cabang: pengajuan izin pembelian bahan baku ke luar gudang pusat dan pengeluaran kas kecil bernominal besar di atas wewenang Finance.

### 2. Prekondisi
- Terdapat pengajuan dari cabang yang berstatus *Menunggu Persetujuan Pimpinan*.

### 3. Pemicu (Trigger)
- Event `ExternalPurchaseRequested` atau `PettyCashSubmitted` dengan eskalasi level pimpinan.

### 4. Alur Utama (Main Flow)
1. Pada navigasi atas dashboard Owner muncul lencana merah **Pusat Persetujuan (Pending Approvals: X)**.
2. Owner membuka menu **Pusat Persetujuan Eksekutif**.
3. Sistem mengelompokkan antrean menjadi 2 tab:
   - **Tab A: Izin Pembelian Bahan Luar Pusat** (UC-OPS-06 / UC-BO-15):
     - Menampilkan nama gerai, nama toko/supplier lokal yang dituju, daftar bahan baku, estimasi biaya, dan alasan mendesak gerai.
   - **Tab B: Pengeluaran Kas Kecil Nominal Besar** (UC-OPS-05 / UC-BO-20):
     - Menampilkan permohonan belanja darurat > Rp 1.000.000,- lengkap dengan foto nota dan rincian perbaikan alat.
4. Owner meninjau dokumen pendukung.
5. Owner menekan tombol aksi:
   - **Setujui (Approve)** dengan 1-klik, atau
   - **Tolak (Reject)** dengan mengisi catatan alasan singkat.
6. Sistem memancarkan event persetujuan (`ExternalPurchaseApproved` atau `PettyCashApproved`).
7. Status permohonan langsung terupdate seketika di App Operasi Outlet pemohon dan modul Backoffice.

### 5. Postkondisi
- Keputusan bisnis darurat dapat dieksekusi cepat tanpa menghambat operasional cabang namun tetap terkontrol di level tertinggi.

### 7. Aturan Bisnis Terkait
- **BR-03**: Pembelian luar pusat wajib persetujuan pimpinan.
- **BR-12**: Kas kecil bernominal besar wajib persetujuan pimpinan.

---

## UC-OWN-04: Pusat Peringatan Dini Bisnis (Hutang, Margin, Bahan Kritis)

```
Use Case ID      : UC-OWN-04
Nama Use Case    : Pusat Peringatan Dini Bisnis (Executive Alerts)
Modul            : Owner Dashboard
Fase             : Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Owner / Direksi
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Mendeteksi anomali operasional dan finansial secara otomatis melalui algoritma deteksi dini (*early warning system*): memberikan peringatan atas saldo hutang gerai ke pusat yang jatuh tempo, lonjakan deviasi HPP, atau kekosongan bahan baku kritis.

### 2. Prekondisi
- Sistem memproses data mutasi finansial dan logistik secara kontinu.

### 3. Pemicu (Trigger)
- Terjadi deviasi metrik yang melampaui batas toleransi risiko bisnis.

### 4. Alur Utama (Main Flow)
1. Owner membuka panel **Pusat Peringatan Dini (Risk & Alerts)**.
2. Sistem menyajikan kartu peringatan terklasifikasi berdasarkan tingkat keparahan (*Severity Level*):
   - **Alert Finansial (Hutang Tertunggak)**:
     - *"Outlet Kemang memiliki saldo hutang pasokan bahan ke pusat sebesar Rp 14.500.000 yang telah menunggak > 45 hari"*.
   - **Alert Margin (Deviasi Harga Nota)**:
     - *"Faktur nota susu di Outlet Sudirman mengalami kenaikan harga 25%, menurunkan margin kotor menu latte menjadi 48% (di bawah target 60%)"*.
   - **Alert Operasional (Bahan Habis)**:
     - *"Outlet Senopati kehabisan biji kopi House Blend sejak pukul 15.30, potensi kehilangan omzet ~Rp 3.500.000"*.
3. Owner dapat mengetuk tombol tindakan pada kartu alert untuk langsung menghubungi manajer cabang atau menginstruksikan tim Finance.

### 5. Postkondisi
- Kebocoran biaya dan resiko kerugian finansial dapat dicegah sedini mungkin sebelum berdampak ke neraca tahunan.
