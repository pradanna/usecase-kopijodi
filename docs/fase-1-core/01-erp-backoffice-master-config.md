# Modul ERP Backoffice: Master Data & Konfigurasi Sistem

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk modul **Master Data & Konfigurasi Sistem** pada ERP Backoffice (Fase 1 Core).

---

## UC-BO-01: Kelola Master Bahan Baku & Satuan (Ingredients)

```
Use Case ID      : UC-BO-01
Nama Use Case    : Kelola Master Bahan Baku & Satuan
Modul            : ERP Backoffice (Master Data)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Memungkinkan Admin Pusat untuk mendefinisikan seluruh bahan baku (*raw materials*), satuan pembelian (*purchasing UOM*), satuan pakai resep (*usage UOM*), faktor konversi, batas stok pengaman (*safety stock*), dan kebijakan pembelian luar pusat.

### 2. Prekondisi
- Admin Pusat telah login ke web Backoffice.
- Memiliki hak akses kelola master data.

### 3. Pemicu (Trigger)
- Penambahan item bahan baru untuk kebutuhan menu baru.
- Penyesuaian batas safety stock atau rasio konversi satuan.

### 4. Alur Utama (Main Flow)
1. Admin Pusat membuka menu **Master Data > Bahan Baku**.
2. Sistem menampilkan daftar bahan baku: Kode Bahan, Nama, Kategori (*Coffee, Dairy, Syrup, Powder, Packaging*), Satuan Beli, Satuan Pakai, Rasio Konversi, Stok Minimum Global, Harga Beli Terakhir (*Last Price*), dan Penanda Beli Luar.
3. Admin menekan tombol **+ Tambah Bahan Baru**.
4. Sistem membuka modal formulir data bahan.
5. Admin menginput:
   - **Nama Bahan**: Teks (contoh: *Susu Fresh Milk Pasteurisasi*).
   - **Kategori**: Dropdown opsi kategori.
   - **Satuan Pembelian**: Dropdown (contoh: *Karton [12 Liter]*).
   - **Satuan Pemakaian Resep**: Dropdown (contoh: *ml*).
   - **Faktor Konversi**: Angka numerik (contoh: 1 Karton = 12.000 ml).
   - **Stok Minimum Outlet**: Angka batas kritis untuk memicu alert (contoh: 5.000 ml).
   - **Harga Beli Referensi / Terakhir**: Nominal rupiah per satuan beli (contoh: Rp 216.000 / karton $\rightarrow$ Rp 18 / ml).
   - **Izin Pembelian Luar Pusat**: Toggle aktif/nonaktif (default: nonaktif).
6. Admin menekan tombol **Simpan**.
7. Sistem memvalidasi kelengkapan form dan memastikan nama bahan belum pernah digunakan.
8. Sistem menyimpan record ke database dan menginisialisasi katalog bahan ke domain engine.
9. Sistem memancarkan event `IngredientCreated`.
10. Sistem menampilkan toast sukses dan memperbarui tabel daftar bahan.

### 5. Alur Alternatif & Eksepsi
- **5a. Nama Bahan Duplikat**: Sistem menandai input field nama berwarna merah dengan pesan *"Nama bahan sudah terdaftar"*. Tombol simpan tetap disabled.
- **5b. Faktor Konversi Kurang Dari atau Sama Dengan 0**: Sistem menampilkan pesan error validasi numerik.

### 6. Postkondisi
- Bahan baku aktif tercatat di ERP.
- Tersedia untuk digunakan dalam pembuatan resep (UC-BO-08) dan penerbitan PO (UC-OPS-03).

### 7. Aturan Bisnis Terkait
- **BR-02**: Master bahan baku dimiliki oleh ERP sendiri (berdiri sendiri dari warehouse pusat).
- **BR-03**: Penanda boleh dibeli dari luar disimpan di level bahan baku untuk validasi pengajuan luar pusat.

---

## UC-BO-02: Kelola Master Outlet & Status Kepemilikan

```
Use Case ID      : UC-BO-02
Nama Use Case    : Kelola Master Outlet & Status Kepemilikan
Modul            : ERP Backoffice (Master Data)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat / Owner
Aktor Pendukung  : Finance Pusat
```

### 1. Deskripsi
Mendaftarkan gerai/outlet baru, mengonfigurasi tempat penyimpanan stok mandiri (*outlet warehouse*), menentukan tipe kepemilikan (*Own Store* vs *Mitra Investor*), serta menetapkan threshold kas kecil outlet.

### 2. Prekondisi
- Pengguna login sebagai Admin Pusat atau Superadmin/Owner.

### 3. Pemicu (Trigger)
- Pembukaan cabang outlet baru atau perubahan data operasional cabang.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Master Data > Outlet & Cabang**.
2. Sistem menampilkan daftar outlet terdaftar, tipe kepemilikan, alamat, jam operasional, dan batas kas kecil.
3. Pengguna menekan tombol **+ Tambah Outlet Baru**.
4. Pengguna mengisi informasi:
   - **Kode & Nama Outlet**: (contoh: *Kopi Jodi - Sudirman*).
   - **Tipe Kepemilikan**: Radio button (*Milik Sendiri / Own Store* atau *Kemitraan / Mitra Investor*).
   - **Persentase Kepemilikan**: Field numerik (disiapkan tetapi **dibiarkan kosong / tidak wajib diisi** sesuai BR-14).
   - **Batas Bebas Kas Kecil (Petty Cash Limit)**: Nominal rupiah per hari/transaksi (default: Rp 150.000,-).
   - **Alamat & Koordinat Lokasi**: Untuk integrasi radius jarak di App Pelanggan.
   - **Jam Operasional**: Jam buka dan jam tutup harian.
5. Pengguna menekan tombol **Simpan Outlet**.
6. Sistem membuat entitas outlet dan secara otomatis membuatkan **buku stok mandiri (virtual warehouse)** khusus untuk outlet tersebut.
7. Sistem menginisialisasi saldo seluruh bahan baku menjadi 0 pada outlet baru.
8. Sistem memancarkan event `OutletCreated` / `OutletConfigured`.
9. Outlet baru langsung muncul di dropdown pilihan outlet pada seluruh aplikasi.

### 5. Alur Alternatif & Eksepsi
- **4a. Outlet Mitra Tanpa Persentase**: Sistem tidak menolak pengisian persentase kosong, melainkan mencatatnya sebagai `ownershipPct: null` dan menampilkannya sebagai label *"Belum Diatur"*.

### 6. Postkondisi
- Entitas outlet aktif dan memiliki warehouse stok terisolasi.
- POS Kasir dan App Pelanggan dapat memilih outlet ini untuk transaksi.

### 7. Aturan Bisnis Terkait
- **BR-02**: Setiap outlet memiliki tempat stok sendiri.
- **BR-14**: Status kepemilikan memiliki field persentase kepemilikan yang disiapkan tetapi dikosongkan (skema bagi hasil ditunda).

---

## UC-BO-03: Kelola Hak Akses Pengguna & Peran (RBAC)

```
Use Case ID      : UC-BO-03
Nama Use Case    : Kelola Hak Akses Pengguna & Peran (RBAC)
Modul            : ERP Backoffice (Master Data)
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Owner
```

### 1. Deskripsi
Mengelola akun pengguna karyawan dan memetakan hak akses berdasarkan matriks peran (*Role-Based Access Control*): Owner, Admin Pusat, Finance, Store Manager, Kasir, Barista, Marketing, dan Mitra.

### 2. Prekondisi
- Admin Pusat login dengan akses superadmin.

### 3. Pemicu (Trigger)
- Rekrutmen staf baru atau mutasi jabatan karyawan antar cabang.

### 4. Alur Utama (Main Flow)
1. Admin membuka menu **Master Data > Manajemen Pengguna**.
2. Sistem menampilkan daftar karyawan, email/username, peran (*role*), dan outlet penugasan.
3. Admin menekan tombol **+ Tambah Pengguna**.
4. Admin mengisi form:
   - Nama Lengkap & Nomor HP.
   - Peran: Dropdown (*Owner, Admin Pusat, Finance, Store Manager, Kasir, Barista, Marketing, Mitra*).
   - Akses Outlet: Pilihan spesifik cabang (untuk Store Manager, Kasir, Barista) atau *Akses Semua Cabang* (untuk Finance, Owner, Marketing).
   - PIN Kasir: 4–6 digit angka (wajib jika peran adalah Kasir).
5. Admin menekan tombol **Simpan**.
6. Sistem mengenkripsi kredensial dan mengaktifkan akun.
7. Pengguna baru dapat login ke aplikasi yang sesuai dengan wewenang perannya.

### 5. Postkondisi
- Hak akses sistem terisolasi sesuai kewenangan operasional.

---

## UC-BO-04: Kelola Feature Toggle Sistem Dinamis

```
Use Case ID      : UC-BO-04
Nama Use Case    : Kelola Feature Toggle Sistem Dinamis
Modul            : ERP Backoffice (Pengaturan Sistem)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat / Superadmin
```

### 1. Deskripsi
Menyediakan antarmuka konfigurasi terpusat untuk mengaktifkan atau menonaktifkan fitur/modul tertentu tanpa harus memodifikasi arsitektur kode dasar sistem.

### 2. Prekondisi
- Pengguna login sebagai Superadmin.

### 3. Pemicu (Trigger)
- Penyesuaian paket fitur sesuai negosiasi penawaran klien (Fase 1, 2, atau 3).

### 4. Alur Utama (Main Flow)
1. Admin membuka menu **Pengaturan > Feature Toggles**.
2. Sistem menampilkan daftar sakelar fitur:
   - `MODULE_CRM_PROMO` (Panel CRM & Voucher)
   - `MODULE_PARTNER_PORTAL` (Portal Mitra Investor)
   - `FEATURE_EXTERNAL_PURCHASE` (Pembelian Bahan di Luar Gudang Pusat)
   - `FEATURE_LOCAL_MENU` (Usulan Menu Lokal Outlet)
   - `FEATURE_APP_MARKUP` (Kenaikan Harga Khusus Channel App)
3. Admin mengubah status switch (misal: mematikan `FEATURE_EXTERNAL_PURCHASE`).
4. Admin menekan tombol **Terapkan Perubahan**.
5. Sistem memvalidasi dependensi dan menyimpan preferensi ke persistent storage.
6. Sistem memancarkan event `FeatureToggled` melalui `BroadcastChannel`.
7. Seluruh antarmuka aplikasi yang terhubung secara instan menyembunyikan menu terkait tanpa me-refresh halaman.

### 5. Postkondisi
- Fitur yang dimatikan tidak dapat diakses di aplikasi manapun namun integritas database tetap terjaga.

### 6. Aturan Bisnis Terkait
- **BR-01**: Ekosistem berjalan sebagai satu kesatuan utuh (tidak modular terpisah), fitur yang tidak terpakai dimatikan lewat feature toggle.

---

## UC-BO-05: Konfigurasi Parameter Pajak & Markup Channel App

```
Use Case ID      : UC-BO-05
Nama Use Case    : Konfigurasi Parameter Pajak & Markup Channel App
Modul            : ERP Backoffice (Pengaturan Keuangan)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Admin
```

### 1. Deskripsi
Mengonfigurasi persentase kenaikan harga menu khusus untuk pesanan online melalui App Pelanggan dan mengatur parameter tarif pajak indikatif (PPN / PBJT).

### 2. Prekondisi
- Pengguna login dengan peran Finance atau Admin Pusat.

### 3. Pemicu (Trigger)
- Kebijakan penyesuaian subsidi biaya pengemasan/channel online atau perubahan tarif pajak.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Pengaturan > Parameter Finansial**.
2. Sistem menampilkan form konfigurasi:
   - **Markup Channel App (%)**: Persentase kenaikan harga otomatis dari harga dasar menu (default: 15%).
   - **Tarif PPN / Pajak Restoran (%)**: Angka persentase pajak indikatif (default: 11%).
   - **Opsi Pajak Termasuk Harga (Tax Inclusive/Exclusive)**: Toggle pilihan.
3. Pengguna mengubah nilai *Markup Channel App* (contoh: diubah menjadi 10%).
4. Pengguna menekan tombol **Simpan Parameter**.
5. Sistem memvalidasi rentang nilai persentase (0% s/d 100%).
6. Sistem menyimpan parameter dan memancarkan event `ChannelMarkupChanged`.
7. App Pelanggan dan POS Kasir langsung memperbarui kalkulasi harga pesanan online secara real-time.

### 5. Postkondisi
- Selisih harga jual app online diperhitungkan secara otomatis dan transparan di keranjang belanja.

### 6. Aturan Bisnis Terkait
- **BR-10**: Harga jual sama di semua channel, dengan pengaturan kenaikan % khusus channel app order.
- **BR-16**: Pajak (PPN/PPh) berupa parameter konfigurasi fleksibel, bukan angka baku di kode program.

---

## UC-BO-06: Konfigurasi Ambang Batas Kas Kecil Bebas Approval

```
Use Case ID      : UC-BO-06
Nama Use Case    : Konfigurasi Ambang Batas Kas Kecil Bebas Approval
Modul            : ERP Backoffice (Pengaturan Keuangan)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Owner
```

### 1. Deskripsi
Menentukan besaran plafon nominal pengeluaran darurat harian/per transaksi outlet yang boleh dieksekusi langsung oleh Store Manager tanpa persetujuan kantor pusat.

### 2. Prekondisi
- Pengguna login sebagai Finance Pusat atau Owner.

### 3. Pemicu (Trigger)
- Penyesuaian batas toleransi risiko operasional kas kecil per outlet.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Pengaturan > Kebijakan Kas Kecil**.
2. Sistem menampilkan daftar outlet dan ambang batas kas kecil masing-masing:
   - *Batas Bebas Tanpa Approval*: Nominal pengeluaran yang langsung tercatat otomatis (contoh: $\le$ Rp 150.000,-).
   - *Batas Approval Finance*: Nominal yang membutuhkan persetujuan tim Finance (contoh: Rp 150.001,- s/d Rp 1.000.000,-).
   - *Batas Approval Owner/Pimpinan*: Nominal pengeluaran sangat besar yang wajib disetujui Owner (> Rp 1.000.000,-).
3. Pengguna memperbarui batas nominal untuk outlet terpilih.
4. Pengguna menekan tombol **Simpan Kebijakan**.
5. Sistem memvalidasi bahwa batas bebas < batas Finance < batas Owner.
6. Sistem menyimpan aturan mesin persetujuan (*approval rule engine*).
7. Sistem memancarkan event `ApprovalPolicyUpdated`.

### 5. Postkondisi
- Setiap pengajuan belanja kas kecil di App Operasi Outlet divalidasi terhadap matriks batas ini secara otomatis.

### 6. Aturan Bisnis Terkait
- **BR-12**: Belanja kebutuhan kecil outlet memiliki batas nominal (per hari/per transaksi). Di atas batas wajib persetujuan Finance/pimpinan.
