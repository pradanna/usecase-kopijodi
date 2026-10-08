# Dokumen Spesifikasi Use Case — Ekosistem Kopi "Satu Gelas, Satu Cerita"

| Informasi Dokumen | Detail |
|---|---|
| **Judul** | Dokumen Spesifikasi Use Case Lengkap (Fase 1, 2, & 3) |
| **Sistem** | Ekosistem Terpadu ERP, POS, KDS, Mobile App Operasi, App Pelanggan, CRM, & Portal Investor |
| **Referensi PRD** | [PRD.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/PRD.md) (Versi 1.1) |
| **Penulis** | Tim Arsitektur Sistem / Analis Sistem (genossys) |
| **Status** | Aktif / Siap Diimplementasikan |
| **Target Brand** | White-label Multi-Outlet (Brand Utama Demo: *Kopi Jodi*) |

---

## DAFTAR ISI

1. [Pendahuluan & Konvensi Dokumen](#1-pendahuluan--konvensi-dokumen)
2. [Matriks Garis Besar Seluruh Use Case (Fase 1, 2, & 3)](#2-matriks-garis-besar-seluruh-use-case)
3. [Spesifikasi Use Case Fase 1: Core Operasional & Backoffice](#3-spesifikasi-use-case-fase-1-core-operasional--backoffice)
   - 3.1 [ERP Backoffice: Master Data & Konfigurasi](#31-erp-backoffice-master-data--konfigurasi)
   - 3.2 [ERP Backoffice: Katalog & Menu](#32-erp-backoffice-katalog--menu)
   - 3.3 [ERP Backoffice: Inventory & Pengadaan](#33-erp-backoffice-inventory--pengadaan)
   - 3.4 [ERP Backoffice: Keuangan (Finance Modul)](#34-erp-backoffice-keuangan-finance-modul)
   - 3.5 [POS Kasir (Point of Sale)](#35-pos-kasir-point-of-sale)
   - 3.6 [KDS Barista (Kitchen Display System)](#36-kds-barista-kitchen-display-system)
   - 3.7 [App Operasi Outlet (Store Manager Mobile)](#37-app-operasi-outlet-store-manager-mobile)
4. [Spesifikasi Use Case Fase 2: Omni-Channel & CRM](#4-spesifikasi-use-case-fase-2-omni-channel--crm)
   - 4.1 [App Pelanggan (Customer Mobile App / PWA)](#41-app-pelanggan-customer-mobile-app--pwa)
   - 4.2 [Panel Promo CRM](#42-panel-promo-crm)
5. [Spesifikasi Use Case Fase 3: Scale, Investor & Eksekutif](#5-spesifikasi-use-case-fase-3-scale-investor--eksekutif)
   - 5.1 [Portal Mitra / Investor (Read-Only)](#51-portal-mitra--investor-read-only)
   - 5.2 [Owner Dashboard & Eksekutif](#52-owner-dashboard--eksekutif)
   - 5.3 [Demo Stage Orchestrator & Shell Presentasi](#53-demo-stage-orchestrator--shell-presentasi)
6. [Matriks Keterlacakan Aturan Bisnis (Business Rules Traceability)](#6-matriks-keterlacakan-aturan-bisnis)

---

## 1. Pendahuluan & Konvensi Dokumen

### 1.1 Tujuan
Dokumen ini mendefinisikan seluruh use case fungsional secara komprehensif untuk ekosistem aplikasi kopi multi-outlet. Dokumen ini menjadi acuan utama pengembangan sistem domain engine, antarmuka pengguna (UI), integrasi event-driven, serta pengujian (unit & e2e testing).

### 1.2 Konvensi Penomoran
- `UC-BO-[xx]` : Use Case ERP Backoffice & Modul Finance
- `UC-POS-[xx]` : Use Case POS Kasir
- `UC-KDS-[xx]` : Use Case KDS Barista
- `UC-OPS-[xx]` : Use Case App Operasi Outlet (Store Manager)
- `UC-CUS-[xx]` : Use Case App Pelanggan
- `UC-CRM-[xx]` : Use Case Panel Promo CRM
- `UC-PRT-[xx]` : Use Case Portal Mitra / Investor
- `UC-OWN-[xx]` : Use Case Owner Dashboard
- `UC-STG-[xx]` : Use Case Shell Presentasi Demo Stage

### 1.3 Struktur Spesifikasi Use Case
Setiap use case yang diperdalam mencakup:
- **ID & Nama Use Case**
- **Fase & Modul**
- **Aktor Utama & Pendukung**
- **Prekondisi & Trigger**
- **Alur Utama (Main Flow)**: Urutan aksi aktor dan respons sistem.
- **Alur Alternatif & Eksepsi (Alternative & Exception Flows)**: Penanganan kondisi khusus / pembatalan / galat.
- **Postkondisi**: Status akhir data dan event yang dipancarkan (`DomainEvent`).
- **Aturan Bisnis Terkait (Business Rules)**: Mengacu pada tabel aturan PRD (`BR-01` s/d `BR-17`).

---

## 2. Matriks Garis Besar Seluruh Use Case

Berikut adalah pemetaan menyeluruh dari total **53 Use Case** di seluruh ekosistem:

### 2.1 Fase 1: Core Operasional & Backoffice (2,5 – 3 Bulan)

| ID | Nama Use Case | Modul | Aktor Utama | Prioritas | Trigger / Deskripsi Ringkas |
|---|---|---|---|:---:|---|
| **UC-BO-01** | Kelola Master Bahan & Satuan | Backoffice Master | Admin Pusat | P0 | Menambah/mengubah data bahan baku, satuan konversi, stok min, harga acuan. |
| **UC-BO-02** | Kelola Master Outlet & Kepemilikan | Backoffice Master | Admin Pusat | P0 | Mendaftarkan outlet, tipe (own/mitra), field kepemilikan %, limit belanja kecil. |
| **UC-BO-03** | Kelola Hak Akses Pengguna (RBAC) | Backoffice Master | Admin Pusat | P1 | Mengatur peran (Owner, Finance, Store Manager, Kasir, Barista) dan hak menu. |
| **UC-BO-04** | Kelola Feature Toggle Sistem | Backoffice Config | Admin Pusat / Owner | P0 | Mengaktifkan/menonaktifkan modul sistem secara dinamis (BR-01). |
| **UC-BO-05** | Konfigurasi Parameter Pajak & Markup App | Backoffice Config | Finance / Admin | P0 | Mengatur besaran % kenaikan harga channel app dan parameter pajak (PPN/PPh). |
| **UC-BO-06** | Konfigurasi Batas Belanja Kas Kecil | Backoffice Config | Finance / Owner | P0 | Menentukan limit threshold belanja darurat tanpa approval per outlet. |
| **UC-BO-07** | Kelola Master Menu & Kategori | Backoffice Katalog | Admin Pusat | P0 | Menambah/mengubah item menu, kategori, harga dasar, foto, dan status jual. |
| **UC-BO-08** | Kelola Resep Menu & Bahan Olahan | Backoffice Katalog | Admin Pusat | P0 | Memetakan kebutuhan bahan baku per porsi serta formula bahan setengah jadi. |
| **UC-BO-09** | Kelola Modifier Menu | Backoffice Katalog | Admin Pusat | P1 | Mengatur opsi ukuran, gula, es, sirup, ekstra shot serta dampak harga & bahan. |
| **UC-BO-10** | Hitung & Pantau HPP Teoretis Menu | Backoffice Katalog | Finance / Admin | P0 | Menghitung estimasi HPP per porsi berdasarkan harga bahan terkini & margin. |
| **UC-BO-11** | Review & Persetujuan Menu Lokal Outlet | Backoffice Katalog | Admin Pusat | P0 | Menyetujui/menolak pengajuan menu unik outlet dari Store Manager (BR-09). |
| **UC-BO-12** | Pantau Stok Multi-Outlet & Kartu Stok | Backoffice Inventory| Admin / Finance | P0 | Melihat posisi stok riil seluruh outlet dan riwayat mutasi bahan baku. |
| **UC-BO-13** | Pantau Stok "Menunggu Nota" | Backoffice Inventory| Finance | P0 | Menyaring stok masuk yang belum memiliki harga definitif (status awaiting invoice). |
| **UC-BO-14** | Monitor PO Tanpa Harga dari Outlet | Backoffice Pengadaan | Admin Pusat | P0 | Memantau daftar permintaan barang outlet (hanya kuantitas, tanpa nominal rupiah). |
| **UC-BO-15** | Review Pengajuan Pembelian Luar Pusat | Backoffice Pengadaan | Owner / Pimpinan | P1 | Memverifikasi dan menyetujui izin belanja outlet ke supplier eksternal (BR-03). |
| **UC-BO-16** | Stock Opname Terpusat & Penyesuaian | Backoffice Inventory| Finance / Admin | P1 | Memeriksa selisih fisik vs sistem dan menyetujui penyesuaian nilai stok. |
| **UC-BO-17** | Input Nota Pembelian & Koreksi HPP | Backoffice Finance | Finance Pusat | P0 | Mengisi harga riil faktur, memicu rekalkulasi HPP otomatis (true-up) & hutang. |
| **UC-BO-18** | Kelola Saldo Hutang Outlet ke Pusat | Backoffice Finance | Finance Pusat | P0 | Memantau tagihan barang outlet ke gudang pusat dan kartu piutang/hutang. |
| **UC-BO-19** | Catat Pembayaran Outlet ke Pusat | Backoffice Finance | Finance Pusat | P0 | Mencatat pembayaran manual cicilan hutang outlet dan alokasi ke faktur (BR-07). |
| **UC-BO-20** | Approval Kas Kecil di Atas Limit | Backoffice Finance | Finance / Pimpinan | P0 | Memeriksa bukti nota dan menyetujui pengeluaran darurat outlet di atas batas. |
| **UC-BO-21** | Rekap Laporan Penjualan, HPP, & Margin | Backoffice Finance | Finance / Owner | P0 | Melihat ringkasan omzet, HPP riil terkoreksi, laba kotor, dan biaya outlet. |
| **UC-POS-01** | Buka & Tutup Shift Kasir | POS Kasir | Kasir | P1 | Membuka shift dengan modal kas awal, menghitung kas fisik saat tutup shift. |
| **UC-POS-02** | Cari & Pilih Menu Berdasarkan Outlet | POS Kasir | Kasir | P0 | Menampilkan grid menu yang aktif di outlet bersangkutan (termasuk menu lokal). |
| **UC-POS-03** | Kustomisasi Pesanan (Modifier & Catatan)| POS Kasir | Kasir | P0 | Memilih modifier (less sugar, extra shot) dan input catatan pelanggan. |
| **UC-POS-04** | Pembayaran Transaksi Walk-In | POS Kasir | Kasir | P0 | Memproses checkout pembayaran tunai (kembalian) atau QRIS simulasi. |
| **UC-POS-05** | Terima / Tolak Pesanan Online App | POS Kasir | Kasir | P0 | Meninjau pesanan masuk dari App Pelanggan dengan tag "Online", lalu konfirmasi. |
| **UC-POS-06** | Dispatch Tiket Pesanan ke KDS | POS Kasir | Sistem / Kasir | P0 | Mengirim tiket pesanan lunas ke layar barista secara instan via event bus. |
| **UC-POS-07** | Cetak & Tampilkan Struk Digital | POS Kasir | Kasir | P1 | Menampilkan salinan struk transaksi untuk pelanggan (simulasi cetak). |
| **UC-POS-08** | Pembatalan / Void Transaksi | POS Kasir | Kasir / SPV | P1 | Membatalkan pesanan yang salah sebelum diproses dengan otorisasi PIN. |
| **UC-POS-09** | Peringatan Stok Kritis di POS | POS Kasir | Kasir | P1 | Menampilkan badge sold-out otomatis jika bahan utama pada resep habis. |
| **UC-KDS-01** | Pantau Antrean Tiket Pesanan | KDS Barista | Barista | P0 | Melihat daftar pesanan di kolom Baru, Dibuat, dan Siap di layar dapur. |
| **UC-KDS-02** | Mulai Proses Pembuatan Pesanan | KDS Barista | Barista | P0 | Menekan tombol "Mulai", memindahkan tiket ke kolom "Dibuat" (In Progress). |
| **UC-KDS-03** | Tandai Pesanan Selesai (Siap Ambil) | KDS Barista | Barista | P0 | Menekan "Siap", memotong stok bahan sesuai resep dan kirim alert ke pelanggan. |
| **UC-KDS-04** | Tandai Pesanan Telah Diambil | KDS Barista | Barista / Kasir | P0 | Menyelesaikan tiket dari papan KDS saat pesanan diserahkan ke pelanggan. |
| **UC-KDS-05** | Intip Formula Resep Cepat | KDS Barista | Barista | P1 | Membuka popup takaran gramatur/ml per item untuk panduan barista baru. |
| **UC-KDS-06** | Indikator SLA Keterlambatan Pesanan | KDS Barista | Barista | P1 | Warna tiket berubah jika waktu pembuatan melebihi target SLA per menu. |
| **UC-OPS-01** | Pantau Ringkasan Operasional Hari Ini | App Operasi | Store Manager | P0 | Melihat dashboard mobile: omzet hari ini, stok kritis, tugas approval pending. |
| **UC-OPS-02** | Cek Stok Bahan Outlet & Alert Minimum | App Operasi | Store Manager | P0 | Meninjau sisa bahan baku di outlet dan menerima notifikasi stok menipis. |
| **UC-OPS-03** | Buat PO Bahan ke Pusat (Tanpa Harga) | App Operasi | Store Manager | P0 | Mengajukan permintaan pasokan barang ke gudang pusat hanya kuantitas (BR-04). |
| **UC-OPS-04** | Terima Barang Fisik (Goods Receipt) | App Operasi | Store Manager | P0 | Konfirmasi barang tiba, catat selisih, stok naik status "menunggu nota" (BR-05). |
| **UC-OPS-05** | Ajukan Belanja Kebutuhan Kas Kecil | App Operasi | Store Manager | P0 | Input pengeluaran darurat + foto nota; otomatis lewat atau butuh approval (BR-12).|
| **UC-OPS-06** | Ajukan Pembelian Bahan Luar Pusat | App Operasi | Store Manager | P1 | Mengajukan izin beli bahan baku ke toko luar jika gudang pusat kosong (BR-03). |
| **UC-OPS-07** | Usulkan Menu / Resep Lokal Outlet | App Operasi | Store Manager | P0 | Mengajukan usulan menu signature outlet ke Admin Pusat untuk disetujui (BR-09).|
| **UC-OPS-08** | Catat Batching Bahan Olahan Outlet | App Operasi | Store Manager | P1 | Mencatat konversi bahan baku jadi bahan setengah jadi (misal syrup aren / cold brew).|

---

### 2.2 Fase 2: Omni-Channel & CRM (2 Bulan)

| ID | Nama Use Case | Modul | Aktor Utama | Prioritas | Trigger / Deskripsi Ringkas |
|---|---|---|---|:---:|---|
| **UC-CUS-01** | Registrasi & Login Cepat Pelanggan | App Pelanggan | Pelanggan | P1 | Masuk ke aplikasi via nomor HP dan verifikasi kode OTP simulasi. |
| **UC-CUS-02** | Pilih Outlet Kopi Terdekat | App Pelanggan | Pelanggan | P0 | Menentukan lokasi pengambilan pesanan berdasarkan radius dan jam buka. |
| **UC-CUS-03** | Eksplorasi Menu & Kustomisasi | App Pelanggan | Pelanggan | P0 | Memilih varian menu, modifier, dan catatan khusus pada outlet terpilih. |
| **UC-CUS-04** | Checkout Keranjang & Pakai Voucher | App Pelanggan | Pelanggan | P0 | Melihat rincian harga (termasuk markup channel app) dan menerapkan kupon. |
| **UC-CUS-05** | Pembayaran via QRIS Simulasi | App Pelanggan | Pelanggan | P0 | Menampilkan kode QRIS dinamis dan simulasi pembayaran instan Midtrans. |
| **UC-CUS-06** | Live Tracking Status Pesanan | App Pelanggan | Pelanggan | P0 | Memantau pergerakan pesanan: Diterima -> Sedang Dibuat -> Siap Diambil. |
| **UC-CUS-07** | Riwayat Pesanan & Pesan Ulang | App Pelanggan | Pelanggan | P1 | Melihat transaksi masa lalu dan melakukan 1-tap reorder menu favorit. |
| **UC-CRM-01** | Buat Voucher Promo Diskon | Panel CRM | Tim Marketing | P0 | Mengatur kode kupon, nilai diskon (%/Rp), min. belanja, dan kuota pemakaian. |
| **UC-CRM-02** | Tentukan Cakupan Promo (Global / Outlet) | Panel CRM | Tim Marketing | P0 | Membatasi berlakunya voucher untuk seluruh cabang atau hanya cabang tertentu (BR-11).|
| **UC-CRM-03** | Pratinjau Tampilan Banner & Voucher | Panel CRM | Tim Marketing | P1 | Menguji tampilan visual promo di emulator layar smartphone secara real-time. |
| **UC-CRM-04** | Analisis Pemakaian & Efektivitas Promo | Panel CRM | Marketing / Owner | P1 | Melihat metrik berapa kali voucher dipakai dan tambahan omzet yang dihasilkan. |

---

### 2.3 Fase 3: Scale, Investor, Eksekutif & Demo Stage (1 – 1,5 Bulan)

| ID | Nama Use Case | Modul | Aktor Utama | Prioritas | Trigger / Deskripsi Ringkas |
|---|---|---|---|:---:|---|
| **UC-PRT-01** | Login Mitra & Pilih Outlet Kemitraan | Portal Mitra | Mitra / Investor | P1 | Akses portal read-only khusus outlet yang dimiliki investor terkait. |
| **UC-PRT-02** | Pantau Kinerja Penjualan Outlet | Portal Mitra | Mitra / Investor | P1 | Memantau grafik omzet, jumlah cup terjual, dan tren rata-rata nilai order. |
| **UC-PRT-03** | Pantau Rincian HPP Riil & Biaya Cabang | Portal Mitra | Mitra / Investor | P1 | Transparansi biaya operasional dan status HPP (sementara vs terkoreksi). |
| **UC-PRT-04** | Status Kepemilikan & Unduh Laporan | Portal Mitra | Mitra / Investor | P1 | Menampilkan kepemilikan ("Belum diatur", tanpa bagi hasil) & ekspor PDF laporan. |
| **UC-OWN-01** | Pantau Konsolidasi KPI Seluruh Outlet | Owner Dashboard | Owner / Direksi | P1 | Kartu metrik total omzet jaringan, laba kotor konsolidasi, dan jumlah transaksi. |
| **UC-OWN-02** | Analisis Komparasi Outlet & Ranking | Owner Dashboard | Owner / Direksi | P1 | Membandingkan performa outlet milik sendiri vs mitra serta ranking omzet. |
| **UC-OWN-03** | Pusat Persetujuan Eksekutif Terpadu | Owner Dashboard | Owner / Direksi | P1 | Satu pintu persetujuan pengeluaran besar dan pembelian bahan luar pusat. |
| **UC-OWN-04** | Alert Pelanggaran & Peringatan Finansial | Owner Dashboard | Owner / Direksi | P1 | Notifikasi hutang menumpuk, margin di bawah target, atau selisih nota membengkak. |
| **UC-STG-01** | Orkestrasi Multi-Perangkat (Device Frames)| Shell Stage | Presenter | P0 | Menampilkan kombinasi iframe Desktop, Tablet POS/KDS, dan Mobile dalam 1 layar. |
| **UC-STG-02** | Eksekusi Mode Presentasi Otomatis | Shell Stage | Presenter | P0 | Memutar skenario "Satu Gelas, Satu Cerita" otomatis dengan narasi dan highlight. |
| **UC-STG-03** | Alih Peran (Role Switcher) & Event Log | Shell Stage | Presenter | P0 | Berpindah fokus aplikasi peran secara instan dan memantau live event bus. |
| **UC-STG-04** | Switcher Tema Merek (White-Label) | Shell Stage | Presenter | P1 | Mengubah identitas tema, logo, dan warna brand secara serentak ke seluruh aplikasi. |
| **UC-STG-05** | Reset Demo & Seed Data Ulang | Shell Stage | Presenter | P0 | Mengosongkan IndexedDB dan mengembalikan state data awal siap presentasi. |

---

## 3. Spesifikasi Use Case Fase 1: Core Operasional & Backoffice

---

### 3.1 ERP Backoffice: Master Data & Konfigurasi

```
Use Case ID      : UC-BO-01
Nama Use Case    : Kelola Master Bahan Baku & Satuan (Ingredients)
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Finance Pusat
```
- **Prekondisi**: Admin Pusat telah login ke web ERP Backoffice dan memiliki hak akses manajemen master data.
- **Trigger**: Penambahan bahan baru untuk menu baru atau penyesuaian batas safety stock bahan.
- **Alur Utama (Main Flow)**:
  1. Admin Pusat membuka menu **Master Data > Bahan Baku**.
  2. Sistem menampilkan daftar bahan baku terdaftar beserta satuan dasar (ml, gram, pcs), stok minimum, dan harga pembelian terakhir (*last price*).
  3. Admin memilih tombol **Tambah Bahan**.
  4. Admin mengisi form:
     - Nama bahan (contoh: *Biji Kopi House Blend*, *Susu Fresh Milk*, *Gula Aren Cair*).
     - Kategori (*Biji Kopi, Dairy, Sirup, Packaging, Bubuk*).
     - Satuan Beli (contoh: *Kartun, Liter, Kilogram*).
     - Satuan Pakai / Resep (contoh: *ml, gram, pcs*).
     - Rasio Konversi (contoh: 1 Liter = 1.000 ml).
     - Batas Stok Minimum (Safety Stock Threshold per outlet).
     - Harga Acuan / Pembelian Terakhir per satuan beli.
     - Penanda *Boleh Beli dari Luar Pusat* (Checkbox: Ya/Tidak).
  5. Admin menekan tombol **Simpan**.
  6. Sistem memvalidasi data dan menyimpan entitas bahan ke database/state.
  7. Sistem memancarkan event `IngredientCreated` ke seluruh subsistem.
  8. Sistem menampilkan pesan sukses dan memperbarui tabel master bahan.
- **Alur Alternatif & Eksepsi**:
  - *4a. Nama Bahan Duplikat*: Sistem menampilkan pesan validasi error bahwa nama bahan sudah ada; simpan dibatalkan.
  - *4b. Rasio Konversi Tidak Valid (<= 0)*: Sistem menolak input dan meminta angka rasio lebih besar dari nol.
- **Postkondisi**: Master bahan baru tersimpan dan tersedia untuk digunakan pada konfigurasi Resep (UC-BO-08) dan Purchase Order (UC-OPS-03).
- **Aturan Bisnis Terkait**: `BR-02` (Master bahan dimiliki ERP mandiri), `BR-03` (Penanda izin beli luar pusat).

---

```
Use Case ID      : UC-BO-02
Nama Use Case    : Kelola Master Outlet & Kepemilikan
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Finance Pusat, Owner
```
- **Prekondisi**: Pengguna memiliki peran Admin Pusat atau Owner.
- **Trigger**: Pembukaan outlet baru atau pembaruan konfigurasi outlet yang sudah ada.
- **Alur Utama (Main Flow)**:
  1. Admin membuka menu **Master Data > Outlet**.
  2. Sistem menampilkan daftar outlet, status kepemilikan (*Own Store* atau *Mitra*), alamat, jam operasional, dan ambang batas kas kecil.
  3. Admin menekan **Tambah Outlet** (atau klik edit pada outlet yang ada).
  4. Admin menginput/memperbarui data:
     - Kode & Nama Outlet (contoh: *Kopi Jodi - Sudirman*).
     - Tipe Kepemilikan: Dropdown (*Milik Sendiri* / *Mitra Investor*).
     - Persentase Kepemilikan: Field input persentase (dapat dibiarkan kosong sesuai kesepakatan).
     - Batas Maksimum Kas Kecil Bebas Approval (contoh: Rp 150.000,- per hari).
     - Alamat lengkap dan jam operasional.
  5. Admin menekan tombol **Simpan Outlet**.
  6. Sistem memvalidasi bahwa setiap outlet memiliki ruang penyimpanan/warehouse tersendiri secara virtual.
  7. Sistem menyimpan data outlet dan menginisialisasi saldo stok awal outlet (0 untuk setiap bahan).
  8. Sistem memancarkan event `OutletConfigured`.
- **Alur Alternatif & Eksepsi**:
  - *4a. Outlet Mitra tanpa persentase kepemilikan*: Sistem tetap memperbolehkan simpan dengan status field kepemilikan "Belum diatur" (BR-14).
- **Postkondisi**: Outlet terdaftar di ekosistem dan dapat dipilih di POS Kasir, App Operasi Outlet, dan App Pelanggan.
- **Aturan Bisnis Terkait**: `BR-02` (Tiap outlet punya warehouse sendiri), `BR-14` (Field kepemilikan mitra disiapkan tapi boleh kosong).

---

```
Use Case ID      : UC-BO-04
Nama Use Case    : Kelola Feature Toggle Sistem
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat / Superadmin
```
- **Prekondisi**: Admin Pusat membuka menu konfigurasi sistem.
- **Trigger**: Client meminta modul tertentu dinonaktifkan tanpa mengubah arsitektur kode.
- **Alur Utama (Main Flow)**:
  1. Admin membuka menu **Pengaturan > Fitur & Modul (Feature Toggle)**.
  2. Sistem menampilkan daftar switch toggle:
     - Modul CRM & Voucher Promo
     - Modul Portal Investor
     - Modul Pembelian Luar Pusat
     - Modul Menu Lokal Outlet
     - Fitur Markup Harga Channel App
  3. Admin menggeser toggle (misal: menonaktifkan *Pembelian Luar Pusat*).
  4. Admin menekan **Terapkan Perubahan**.
  5. Sistem memvalidasi dependensi modul dan menyimpan konfigurasi.
  6. Sistem memancarkan event `FeatureToggled` melalui `BroadcastChannel`.
  7. Seluruh aplikasi yang terhubung secara instan menyembunyikan/menampilkan menu terkait tanpa perlu build ulang kode.
- **Alur Alternatif & Eksepsi**:
  - *3a. Mematikan fitur dasar (Core)*: Sistem mengunci toggle fitur wajib (POS, Inventory, Finance) dengan status disabled (*cannot be toggled off*).
- **Postkondisi**: Konfigurasi fitur aktif tersimpan dan UI beradaptasi dinamis.
- **Aturan Bisnis Terkait**: `BR-01` (Satu produk utuh, fitur dapat dimatikan lewat feature toggle).

---

```
Use Case ID      : UC-BO-05
Nama Use Case    : Konfigurasi Parameter Pajak & Markup Channel App
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Admin
```
- **Prekondisi**: Pengguna memiliki hak akses pengaturan keuangan.
- **Trigger**: Kebijakan penetapan selisih harga aplikasi pelanggan atau perubahan tarif pajak indikatif.
- **Alur Utama (Main Flow)**:
  1. Pengguna membuka menu **Pengaturan > Parameter Finansial & Channel**.
  2. Sistem menampilkan form:
     - Tarif Pajak PPN (% indikatif, default 11%).
     - Tarif Pajak PPh (% indikatif, default 0.5% / 2%).
     - Persentase Kenaikan Harga Channel App Order (% markup, default misal 15%).
  3. Pengguna mengubah nilai markup channel app (misal menjadi 10%).
  4. Pengguna menekan tombol **Simpan Konfigurasi**.
  5. Sistem memvalidasi format angka persentase.
  6. Sistem memancarkan event `ChannelMarkupChanged` dan `TaxConfigUpdated`.
  7. App Pelanggan dan POS memperbarui kalkulasi harga checkout untuk pesanan online.
- **Postkondisi**: Nilai markup diterapkan secara transparan pada keranjang belanja aplikasi pelanggan.
- **Aturan Bisnis Terkait**: `BR-10` (Harga jual sama di semua channel kecuali % markup channel app), `BR-16` (Pajak berupa parameter konfigurasi).

---

### 3.2 ERP Backoffice: Katalog & Menu

```
Use Case ID      : UC-BO-07
Nama Use Case    : Kelola Master Menu & Kategori
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
```
- **Prekondisi**: Kategori menu sudah terdefinisi.
- **Trigger**: Peluncuran varian minuman/makanan baru.
- **Alur Utama (Main Flow)**:
  1. Admin membuka menu **Katalog > Master Menu**.
  2. Sistem menampilkan daftar menu yang terbagi dalam kategori (*Coffee, Non-Coffee, Pastry, Tea*), harga jual dasar, dan status ketersediaan.
  3. Admin menekan tombol **Tambah Menu Baru**.
  4. Admin melengkapi data:
     - Nama Menu (contoh: *Es Kopi Susu Aren*).
     - Kategori (*Coffee*).
     - Harga Dasar Jual (contoh: Rp 20.000,-).
     - Deskripsi singkat & Upload foto produk.
     - Cakupan Menu: Radio button (*Global Semua Outlet* / *Outlet Spesifik*).
     - Status: *Aktif*.
  5. Admin menekan **Simpan Menu**.
  6. Sistem menyimpan menu dan menghubungkannya dengan konfigurasi resep.
  7. Sistem memancarkan event `MenuItemCreated`.
- **Alur Alternatif & Eksepsi**:
  - *4a. Harga jual bernilai <= 0*: Sistem menampilkan pesan validasi error harga harus bernilai positif.
- **Postkondisi**: Menu terdaftar di master data dan siap dipetakan resep bahan bakunya.
- **Aturan Bisnis Terkait**: `BR-10` (Harga dasar berlaku seragam secara global).

---

```
Use Case ID      : UC-BO-08
Nama Use Case    : Kelola Resep Menu & Bahan Olahan Bertingkat
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Store Manager
```
- **Prekondisi**: Master bahan baku (UC-BO-01) dan master menu (UC-BO-07) sudah tersedia.
- **Trigger**: Penentuan komposisi gramatur bahan untuk pemotongan stok otomatis saat pesanan dibuat.
- **Alur Utama (Main Flow)**:
  1. Admin membuka menu **Katalog > Resep & Formula**.
  2. Admin memilih menu target (contoh: *Es Kopi Susu Aren Ukuran Reguler*).
  3. Sistem menampilkan formulir komposisi resep saat ini (atau formulir kosong).
  4. Admin menambahkan baris komposisi bahan baku:
     - Bahan 1: *Biji Kopi House Blend* — Takaran: 18 gram.
     - Bahan 2: *Susu Fresh Milk* — Takaran: 120 ml.
     - Bahan 3: *Sirup Gula Aren (Bahan Olahan)* — Takaran: 25 ml.
     - Bahan 4: *Cup Plastik 16oz* — Takaran: 1 pcs.
     - Bahan 5: *Tutup Cup & Sedotan* — Takaran: 1 set.
  5. Sistem otomatis menghitung estimasi HPP teoretis per porsi berdasarkan harga pembelian bahan terakhir.
  6. Admin menekan **Simpan Resep**.
  7. Sistem memvalidasi kelengkapan takaran dan menyimpan relasi resep.
  8. Sistem memancarkan event `RecipeConfigured`.
- **Alur Alternatif & Eksepsi**:
  - *4a. Resep Bahan Olahan (Semi-Finished Goods)*: Jika Admin mengonfigurasi resep untuk bahan olahan (contoh: *Sirup Gula Aren Batch 1 Liter* = 800 gr Gula Aren Padat + 400 ml Air), sistem mencatatnya sebagai formula produksi internal outlet (BR-08).
- **Postkondisi**: Resep tersimpan di domain engine. KDS Barista dan POS akan menggunakan resep ini untuk memicu pemotongan stok otomatis.
- **Aturan Bisnis Terkait**: `BR-08` (Stok berkurang otomatis berdasarkan resep saat pesanan selesai; mendukung bahan olahan).

---

```
Use Case ID      : UC-BO-11
Nama Use Case    : Review & Persetujuan Menu Lokal Outlet
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Store Manager Pengusul
```
- **Prekondisi**: Store Manager salah satu outlet telah mengajukan usulan menu lokal melalui App Operasi Outlet (UC-OPS-07).
- **Trigger**: Notifikasi usulan menu lokal baru masuk ke antrean persetujuan Backoffice.
- **Alur Utama (Main Flow)**:
  1. Admin Pusat membuka menu **Persetujuan > Menu Lokal Outlet**.
  2. Sistem menampilkan daftar pengajuan dengan status *Menunggu Persetujuan*, mencakup nama outlet pengusul, nama menu (contoh: *Es Kopi Pandan Wangi*), usulan harga, resep bahan yang digunakan, dan alasan pengajuan.
  3. Admin memilih salah satu pengajuan untuk melihat detail komposisi resep dan kelayakan margin.
  4. Admin menentukan tindakan: memilih **Setujui (Approve)**.
  5. Admin menginput catatan persetujuan (opsional).
  6. Sistem memperbarui status pengajuan menjadi `Approved` dan menambahkan menu tersebut ke katalog khusus outlet pengusul (`scope: outletId`).
  7. Sistem memancarkan event `LocalMenuApproved`.
  8. POS Kasir dan App Pelanggan pada outlet bersangkutan secara otomatis menampilkan menu baru tersebut di grid katalog.
- **Alur Alternatif & Eksepsi**:
  - *4a. Admin Menolak Pengajuan*: Admin menekan **Tolak (Reject)** dan wajib mengisi alasan penolakan (misal: "Bahan sirup pandan belum standar"). Status pengajuan berubah menjadi `Rejected` dan event `LocalMenuRejected` dipancarkan. Menu tidak ditampilkan di POS.
- **Postkondisi**: Menu lokal aktif hanya di outlet yang disetujui tanpa mempengaruhi outlet lainnya.
- **Aturan Bisnis Terkait**: `BR-09` (Menu lokal/resep khusus outlet diusulkan Store Manager dan disetujui Admin Pusat).

---

### 3.3 ERP Backoffice: Inventory & Pengadaan (Procurement)

```
Use Case ID      : UC-BO-12
Nama Use Case    : Pantau Stok Multi-Outlet & Kartu Stok Terpusat
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat / Finance
```
- **Prekondisi**: Outlet telah memiliki pergerakan transaksi dan penerimaan barang.
- **Trigger**: Pengguna ingin mengaudit ketersediaan fisik bahan baku lintas cabang.
- **Alur Utama (Main Flow)**:
  1. Pengguna membuka menu **Inventory > Stok Multi-Outlet**.
  2. Pengguna dapat memilih filter outlet (*Semua Outlet* atau pilih outlet tertentu).
  3. Sistem menampilkan tabel inventaris:
     - Nama Bahan & Kategori.
     - Satuan Pakai.
     - Stok Saat Ini (On-Hand Stock).
     - Stok Berstatus "Menunggu Nota" (Awaiting Invoice).
     - Batas Stok Minimum (Safety Stock).
     - Indikator Status (*Aman* [Hijau], *Menipis* [Kuning], *Habis* [Merah]).
  4. Pengguna mengklik salah satu baris bahan untuk melihat **Kartu Stok (Stock Ledger)**.
  5. Sistem menampilkan histori mutasi: tanggal/jam, nomor referensi (Order ID / PO ID), tipe pergerakan (Masuk / Terpakai Penjualan / Penyesuaian), jumlah kuantitas, dan saldo akhir.
- **Postkondisi**: Pengguna memperoleh visibilitas penuh pergerakan bahan tanpa mengubah data stok.
- **Aturan Bisnis Terkait**: `BR-02` (Setiap outlet memiliki tempat stok sendiri).

---

```
Use Case ID      : UC-BO-14
Nama Use Case    : Monitor Purchase Order (PO) Tanpa Harga dari Outlet
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat / Gudang Pusat
Aktor Pendukung  : Store Manager
```
- **Prekondisi**: Store Manager telah menerbitkan PO melalui App Operasi Outlet (UC-OPS-03).
- **Trigger**: Barang dipesan oleh outlet ke gudang pusat.
- **Alur Utama (Main Flow)**:
  1. Admin membuka menu **Pembelian > Daftar Purchase Order**.
  2. Sistem menampilkan daftar PO dari seluruh outlet dengan rincian: Nomor PO, Tanggal, Outlet Pemohon, Jumlah Item, dan Status (*Diajukan / Diproses Pusat / Diterima Outlet / Menunggu Nota / Selesai*).
  3. Admin membuka detail PO.
  4. Sistem menampilkan daftar barang dan jumlah permintaan **tanpa ada kolom harga sama sekali** (BR-04).
  5. Admin menekan tombol **Kirim Barang ke Outlet**.
  6. Sistem mengubah status PO menjadi `POSentToCentral`.
  7. Sistem memancarkan event `POSentToCentral` yang diterima oleh App Operasi Outlet untuk persiapan penerimaan fisik barang.
- **Postkondisi**: PO tercatat siap dikirim secara logistik dari warehouse pusat ke outlet.
- **Aturan Bisnis Terkait**: `BR-04` (PO ke supplier/pusat berisi barang dan kuantitas saja, tanpa harga).

---

```
Use Case ID      : UC-BO-15
Nama Use Case    : Review Pengajuan Pembelian Bahan Luar Pusat (External Purchase)
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Owner / Pimpinan
Aktor Pendukung  : Store Manager, Finance
```
- **Prekondisi**: Store Manager mengajukan pembelian bahan baku darurat ke toko/supplier lokal non-pusat (UC-OPS-06).
- **Trigger**: Notifikasi permintaan pembelian luar masuk ke antrean pimpinan.
- **Alur Utama (Main Flow)**:
  1. Owner membuka menu **Persetujuan > Pembelian Luar Pusat**.
  2. Sistem menampilkan pengajuan aktif: Outlet pemohon, nama toko/supplier lokal, daftar bahan & jumlah yang hendak dibeli, estimasi biaya, dan alasan mendesak (contoh: *Stok susu habis di jam ramai, pengiriman gudang pusat terlambat*).
  3. Owner memeriksa apakah bahan tersebut memiliki izin beli luar (BR-03).
  4. Owner menekan tombol **Setujui Pembelian**.
  5. Sistem mencatat persetujuan dengan identitas akun Owner dan waktu approval.
  6. Sistem memancarkan event `ExternalPurchaseApproved`.
  7. Notifikasi persetujuan dikirim ke App Operasi Outlet sehingga Store Manager dapat mengeksekusi pembelian barang.
- **Alur Alternatif & Eksepsi**:
  - *4a. Owner Menolak Pengajuan*: Owner menekan tombol **Tolak** dan mengisi alasan penolakan. Sistem memancarkan event `ExternalPurchaseRejected`. Status PO luar dibatalkan, outlet dilarang belanja ke toko tersebut.
- **Postkondisi**: Pengadaan luar pusat sah secara tata kelola dan dapat dilanjutkan ke tahap penerimaan barang.
- **Aturan Bisnis Terkait**: `BR-03` (Outlet berbelanja bahan lewat pusat; belanja ke toko lain wajib persetujuan pimpinan).

---

### 3.4 ERP Backoffice: Keuangan (Finance Modul)

```
Use Case ID      : UC-BO-17
Nama Use Case    : Input Nota Pembelian & Koreksi HPP Otomatis (True-Up HPP)
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Store Manager, Owner
```
- **Prekondisi**: Barang fisik telah diterima oleh outlet (UC-OPS-04) dan tercatat dalam sistem dengan status `awaiting_invoice` (HPP sementara menggunakan harga pembelian terakhir). Foto fisik nota/surat jalan telah diunggah.
- **Trigger**: Faktur tagihan fisik / kuitansi resmi dari pemasok/pusat tiba di meja Finance Pusat.
- **Alur Utama (Main Flow)**:
  1. Finance Pusat membuka menu **Keuangan > Verifikasi Nota Pembelian**.
  2. Sistem menampilkan daftar penerimaan barang yang berstatus **"Menunggu Nota"** (kuning).
  3. Finance memilih transaksi penerimaan terkait untuk membuka form input nota.
  4. Sistem menampilkan data barang yang telah diterima fisik (kuantitas terkonfirmasi) dan pratinjau lampiran foto nota yang diunggah outlet.
  5. Finance menginput data faktur riil:
     - Nomor Faktur / Invoice Resmi.
     - Tanggal Faktur.
     - Harga Beli Riil per satuan masing-masing bahan (contoh: harga susu naik dari Rp 18.000 menjadi Rp 19.500 per liter).
     - Biaya Pengiriman / Diskon Nota (jika ada).
  6. Sistem menghitung total nilai faktur dan menampilkan perbandingan selisih (*variance*) antara total estimasi sementara vs total riil faktur.
  7. Finance menekan tombol **Konfirmasi & Koreksi HPP (True-Up)**.
  8. Sistem mengeksekusi kalkulasi ulang domain engine:
     - Mengganti status lot stok dari `awaiting_invoice` menjadi `confirmed`.
     - Mengoreksi nilai HPP stok yang tersisa di outlet sesuai harga faktur riil.
     - Mengoreksi retrospektif nilai HPP pesanan yang sudah terjual selama jeda waktu tunggu nota untuk pelaporan margin yang akurat.
     - Menambahkan nilai total faktur ke dalam buku hutang outlet ke pusat/pemasok.
  9. Sistem memancarkan event `InvoiceEntered` dan `HppRecalculated`.
  10. Dashboard Owner dan Portal Mitra secara real-time memperbarui grafik omzet, HPP terkoreksi, dan laba kotor.
- **Alur Alternatif & Eksepsi**:
  - *5a. Deviasi Harga Terlalu Signifikan (> 20%)*: Sistem memunculkan dialog peringatan konfirmasi ekstra kepada Finance untuk memastikan tidak ada kesalahan ketik angka desimal.
- **Postkondisi**: Status lot barang berubah menjadi definitif, HPP terkoreksi sempurna, dan hutang terakru secara otomatis.
- **Aturan Bisnis Terkait**: `BR-05` (Penerimaan menaikkan stok "menunggu nota" dengan HPP harga terakhir), `BR-06` (Input nota mengoreksi HPP dan menambah hutang).

---

```
Use Case ID      : UC-BO-18
Nama Use Case    : Kelola Saldo Hutang Outlet ke Warehouse Pusat & Umur Hutang
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
```
- **Prekondisi**: Telah ada nota pembelian yang diverifikasi dan masuk buku hutang.
- **Trigger**: Finance Pusat melakukan rekonsiliasi berkala atas kewajiban pasokan cabang ke pusat.
- **Alur Utama (Main Flow)**:
  1. Finance membuka menu **Keuangan > Hutang ke Pusat (Payables)**.
  2. Sistem menampilkan tabel saldo hutang per outlet:
     - Nama Outlet.
     - Total Saldo Hutang Berjalan.
     - Rincian Umur Hutang (*Aging: 0–30 hari, 31–60 hari, >60 hari*).
     - Jumlah Nota Belum Lunas.
  3. Finance memilih salah satu outlet untuk memeriksa rincian daftar invoice yang belum dialokasikan pembayaran.
  4. Sistem menampilkan kartu rincian faktur lengkap beserta riwayat cicilan yang pernah dilakukan.
- **Postkondisi**: Posisi kewajiban antar-entitas terpantau transparan tanpa campur aduk antar cabang.
- **Aturan Bisnis Terkait**: `BR-07` (Hutang ke pusat dicatat manual di Backoffice, mendukung pembayaran fleksibel/periodik).

---

```
Use Case ID      : UC-BO-19
Nama Use Case    : Catat Pembayaran Outlet ke Pusat & Alokasi Pelunasan
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
```
- **Prekondisi**: Outlet telah melakukan transfer dana pelunasan pasokan bahan ke rekening pusat perusahaan.
- **Trigger**: Bukti setor/transfer bank diterima oleh Finance Pusat.
- **Alur Utama (Main Flow)**:
  1. Finance membuka menu **Keuangan > Catat Pembayaran ke Pusat**.
  2. Finance memilih outlet pembayar (contoh: *Kopi Jodi - Sudirman*).
  3. Sistem menampilkan total sisa hutang dan daftar faktur terbuka yang belum lunas.
  4. Finance menginput:
     - Nominal Pembayaran (contoh: Rp 5.000.000,-).
     - Tanggal Pembayaran.
     - Rekening Bank Tujuan & Referensi Bukti Transfer.
     - Metode Alokasi: *Otomatis (FIFO - faktur tertua)* atau *Manual per Faktur*.
  5. Finance menekan tombol **Simpan Pembayaran & Alokasikan**.
  6. Sistem mengurangi saldo hutang outlet terkait dan menandai faktur terkait sebagai *Lunas Sebagian* atau *Lunas Penuh*.
  7. Sistem memancarkan event `PaymentToCentralRecorded`.
  8. Sistem memperbarui kartu saldo hutang outlet.
- **Alur Alternatif & Eksepsi**:
  - *4a. Nominal Pembayaran Melebihi Total Hutang*: Sistem menolak input dengan peringatan bahwa pembayaran melebihi saldo tagihan aktif.
- **Postkondisi**: Saldo hutang outlet berkurang dan histori pembayaran tercatat permanen.
- **Aturan Bisnis Terkait**: `BR-07` (Pembayaran dapat dicatat fleksibel/periodik tanpa integrasi API ke aplikasi luar).

---

```
Use Case ID      : UC-BO-20
Nama Use Case    : Approval Pengeluaran Kas Kecil di Atas Limit Threshold
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Pimpinan
Aktor Pendukung  : Store Manager
```
- **Prekondisi**: Store Manager mengajukan belanja kebutuhan outlet melalui App Operasi dengan nominal melampaui batas bebas approval (UC-OPS-05).
- **Trigger**: Notifikasi pengeluaran kas kecil berstatus *Menunggu Persetujuan* masuk ke modul Finance Backoffice.
- **Alur Utama (Main Flow)**:
  1. Pengguna membuka menu **Persetujuan > Pengeluaran Kas Kecil**.
  2. Sistem menampilkan daftar permohonan kas kecil yang membutuhkan persetujuan:
     - Tanggal & Waktu.
     - Outlet Pengaju & Nama Store Manager.
     - Nominal Pengeluaran (contoh: Rp 350.000,- di mana limit bebas adalah Rp 150.000,-).
     - Keperluan Belanja (contoh: *Pembelian galon air mineral darurat & sabun cuci alat barista*).
     - Pratinjau Foto Struk Pembelian Fisik.
  3. Pengguna memeriksa kesesuaian struk fisik dengan nominal yang diajukan.
  4. Pengguna menekan tombol **Setujui (Approve)**.
  5. Sistem mengubah status pengajuan menjadi `Approved` dan membukukan pengeluaran tersebut ke pos beban operasional outlet terkait.
  6. Sistem memancarkan event `PettyCashApproved`.
  7. Status di App Operasi Outlet pemohon berubah menjadi "Disetujui".
- **Alur Alternatif & Eksepsi**:
  - *4a. Nominal Sangat Besar (Exceeding High Limit)*: Jika nominal melebihi batas approval Finance (misal > Rp 1.000.000,-), sistem memvalidasi bahwa hanya peran *Pimpinan / Owner* yang berhak menekan tombol Setujui (BR-12).
  - *4b. Struk Tidak Valid / Pengajuan Ditolak*: Pengguna menekan tombol **Tolak (Reject)** dan mengisi catatan alasan penolakan. Sistem memancarkan event `PettyCashRejected`. Dana tidak dibukukan sebagai beban outlet.
- **Postkondisi**: Pengeluaran kas kecil divalidasi dan tercatat dalam buku beban outlet untuk perhitungan laba bersih.
- **Aturan Bisnis Terkait**: `BR-12` (Kas kecil bertingkat: di bawah batas bebas langsung tercatat, di atas batas wajib persetujuan Finance/pimpinan).

---

```
Use Case ID      : UC-BO-21
Nama Use Case    : Rekap Laporan Penjualan, HPP, & Margin per Outlet
Modul / Fase     : ERP Backoffice / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Owner
```
- **Prekondisi**: Terjadi transaksi penjualan dan koreksi HPP pada periode yang dipilih.
- **Trigger**: Kebutuhan evaluasi kesehatan finansial harian/bulanan cabang.
- **Alur Utama (Main Flow)**:
  1. Pengguna membuka menu **Laporan > Laba Kotor & Margin Outlet**.
  2. Pengguna menentukan filter: Outlet terpilih dan rentang tanggal transaksi.
  3. Sistem mengkalkulasi dan menyajikan ringkasan laporan:
     - Total Omzet Kotor (Gross Sales).
     - Diskon & Promo yang Ditanggung.
     - Total Penjualan Bersih (Net Sales).
     - Total HPP Riil Terkoreksi (COGS).
     - Laba Kotor (Gross Profit) & Persentase Margin Kotor.
     - Total Beban Operasional Kas Kecil yang Disetujui.
     - Laba Operasional Outlet (Operating Profit).
  4. Pengguna dapat memilih tombol **Ekspor CSV** untuk pengolahan audit eksternal.
- **Postkondisi**: Laporan disajikan secara akurat dan mencerminkan angka HPP yang telah ditrue-up.
- **Aturan Bisnis Terkait**: `BR-06` (Laporan menyajikan HPP terkoreksi), `BR-13` (Pusat mengonsolidasikan beban dan HPP per outlet).

---

### 3.5 POS Kasir (Point of Sale)

```
Use Case ID      : UC-POS-01
Nama Use Case    : Buka & Tutup Shift Kasir
Modul / Fase     : POS Kasir / Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Kasir Outlet
Aktor Pendukung  : Store Manager
```
- **Prekondisi**: Aplikasi POS Kasir terbuka di tablet landscape outlet.
- **Trigger**: Pergantian jam kerja kasir pagi/sore.
- **Alur Utama (Main Flow - Buka Shift)**:
  1. Kasir memasukkan PIN login kasir (4–6 digit).
  2. Sistem memvalidasi PIN dan mendeteksi bahwa belum ada shift aktif di mesin kasir tersebut.
  3. Sistem memunculkan modal **Buka Shift Baru**.
  4. Kasir menghitung uang kas laci awal dan menginput nominal kas pembuka (contoh: Rp 200.000,-).
  5. Kasir menekan tombol **Buka Shift**.
  6. Sistem mencatat shift aktif, timestamp mulai, dan membuka layar katalog POS.
- **Alur Utama (Main Flow - Tutup Shift)**:
  1. Di akhir jam kerja, Kasir memilih menu **Kelola Shift > Tutup Shift**.
  2. Sistem menampilkan ringkasan transaksi selama shift: Total Penjualan Tunai, Total Penjualan QRIS, Total Transaksi, dan Ekspektasi Kas di Laci.
  3. Kasir menghitung fisik uang tunai di laci kas dan menginput **Kas Fisik Aktual**.
  4. Sistem menghitung selisih kas (*over/short*).
  5. Kasir memasukkan catatan keterangan (jika ada selisih) dan menekan **Konfirmasi Tutup Shift**.
  6. Sistem mengunci shift, memancarkan event `ShiftClosed`, dan mencetak slip rekap shift.
- **Postkondisi**: Catatan pertanggungjawaban kasir tersimpan dan kasir berikutnya dapat membuka shift baru.

---

```
Use Case ID      : UC-POS-02 & UC-POS-03
Nama Use Case    : Pemilihan Menu & Kustomisasi Modifier Pesanan Walk-In
Modul / Fase     : POS Kasir / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
```
- **Prekondisi**: Shift kasir dalam status aktif. Pelanggan memesan langsung di kasir (walk-in).
- **Trigger**: Pelanggan menyebutkan pesanan kopi di meja kasir.
- **Alur Utama (Main Flow)**:
  1. Kasir menelusuri grid menu berdasarkan tab kategori (*Coffee, Non-Coffee, Makanan*) atau menggunakan bilah pencarian cepat.
  2. Menu yang tampil adalah menu global aktif ditambah menu lokal yang disetujui untuk outlet ini (UC-BO-11).
  3. Kasir mengetuk item menu (contoh: *Es Kopi Susu*).
  4. Jika menu memiliki pilihan modifier, sistem menampilkan bottom sheet/dialog modifier:
     - Ukuran Cup: *Reguler* (+Rp 0) / *Large* (+Rp 4.000).
     - Level Gula: *Normal (100%)* / *Less Sugar (50%)* / *No Sugar (0%)*.
     - Level Es: *Normal Ice* / *Less Ice*.
     - Tambahan Add-ons: Checkbox *Extra Espresso Shot* (+Rp 5.000), *Oatmilk Substitute* (+Rp 6.000).
     - Catatan Khusus: Input teks bebas (misal: "jangan terlalu manis").
  5. Kasir memilih opsi yang diinginkan pelanggan dan menekan tombol **Tambah ke Keranjang**.
  6. Sistem menambahkan item beserta rincian modifier ke panel keranjang belanja di sisi kanan layar.
  7. Sistem menghitung subtotal keranjang secara real-time.
- **Alur Alternatif & Eksepsi**:
  - *2a. Menu Sold Out*: Jika stok salah satu bahan kritis habis (misal: biji kopi habis), kartu menu memiliki overlay "Habis" dan tidak dapat diketuk (UC-POS-09).
- **Postkondisi**: Item pesanan terakumulasi dalam keranjang belanja siap diproses ke pembayaran.
- **Aturan Bisnis Terkait**: `BR-09` (Menu lokal outlet tersedia di POS), `BR-10` (Harga walk-in adalah harga dasar tanpa markup app).

---

```
Use Case ID      : UC-POS-04
Nama Use Case    : Proses Pembayaran Transaksi Walk-In (Tunai & QRIS)
Modul / Fase     : POS Kasir / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
Aktor Pendukung  : Pelanggan
```
- **Prekondisi**: Item pesanan telah berada di keranjang belanja POS.
- **Trigger**: Kasir menekan tombol besar **Bayar (Checkout)**.
- **Alur Utama (Main Flow - Skenario QRIS Simulasi)**:
  1. Kasir menekan tombol **Bayar (Total: Rp 25.000,-)**.
  2. Sistem menampilkan modal metode pembayaran: *Tunai*, *QRIS*, *Debit/Kartu*.
  3. Kasir memilih opsi **QRIS**.
  4. Sistem menampilkan layar simulasi QRIS lengkap dengan kode QR dinamis bernilai pas Rp 25.000,- (BR-15).
  5. Pelanggan memindai QR (di demo: presenter/kasir menekan tombol interaktif *"Simulasikan Sukses Bayar"*).
  6. Sistem mendeteksi notifikasi pelunasan sukses dari gateway pembayaran.
  7. Sistem mencatat transaksi sebagai `PAID`, menerbitkan Nomor Struk/Order ID unik, dan memancarkan event `PaymentCaptured` serta `OrderPlaced`.
  8. Sistem otomatis mengirimkan tiket pesanan ke antrean KDS Barista (UC-POS-06).
  9. Sistem menampilkan konfirmasi transaksi sukses dan opsi cetak struk.
- **Alur Alternatif (Pembayaran Tunai)**:
  - *3a. Kasir memilih Tunai*: Sistem menampilkan tombol nominal cepat (uang pas, Rp 50.000, Rp 100.000). Kasir memasukkan nominal uang yang diterima (misal Rp 50.000). Sistem otomatis menghitung uang kembalian (Rp 25.000) dan membuka laci kas (*cash drawer*). Kasir menekan **Selesai**, sistem memancarkan event `OrderPlaced`.
- **Postkondisi**: Transaksi lunas tercatat di database lokal, uang kas/saldo bertambah, dan pesanan diteruskan ke barista.
- **Aturan Bisnis Terkait**: `BR-15` (Pembayaran pelanggan disimulasikan QRIS via Midtrans).

---

```
Use Case ID      : UC-POS-05
Nama Use Case    : Terima / Tolak Pesanan Online dari App Pelanggan
Modul / Fase     : POS Kasir / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Kasir Outlet
```
- **Prekondisi**: Pelanggan telah melakukan checkout dan pembayaran sukses di App Pelanggan (UC-CUS-05).
- **Trigger**: Event `OrderPlaced` dengan channel `APP` diterima melalui event bus `BroadcastChannel`.
- **Alur Utama (Main Flow)**:
  1. Sistem POS Kasir membunyikan nada dering notifikasi dan menampilkan lencana pesanan online baru pada panel samping **Pesanan Online**.
  2. Kasir mengetuk panel pesanan online untuk melihat detail: Nama Pelanggan, Nomor Antrean Online, Daftar Item, Modifier, Catatan, dan Penanda badge **"Online"** (warna info biru).
  3. Kasir meninjau kapasitas antrean dapur dan menekan tombol **Terima Pesanan (Accept)**.
  4. Sistem mengirimkan estimasi waktu selesai (default: 10–15 menit).
  5. Sistem memancarkan event `OrderAccepted`.
  6. Tiket pesanan otomatis diteruskan ke layar KDS Barista dengan penanda channel "App Online".
  7. Status pesanan di App Pelanggan secara live berubah menjadi *"Pesanan Diterima & Disiapkan"*.
- **Alur Alternatif & Eksepsi**:
  - *3a. Kasir Menolak Pesanan*: Jika outlet sedang *overload* atau bahan mendadak tumpah/rusak, kasir menekan tombol **Tolak Pesanan** dan memilih alasan (misal: "Antrean penuh"). Sistem memancarkan event `OrderCancelled`, membatalkan pesanan, dan menampilkan notifikasi refund simulasi di HP pelanggan.
- **Postkondisi**: Pesanan online divalidasi oleh kasir dan dialirkan ke proses produksi barista.

---

### 3.6 KDS Barista (Kitchen Display System)

```
Use Case ID      : UC-KDS-01 s/d UC-KDS-03
Nama Use Case    : Alur Produksi Pesanan Barista & Pemotongan Stok Bahan
Modul / Fase     : KDS Barista / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Barista Outlet
Aktor Pendukung  : POS Kasir, App Pelanggan, ERP Inventory
```
- **Prekondisi**: Pesanan walk-in telah dibayar di POS atau pesanan online telah diterima kasir.
- **Trigger**: Event pesanan baru diterima oleh modul KDS.
- **Alur Utama (Main Flow)**:
  1. Tiket baru muncul di kolom **"Baru (New)"** pada layar KDS Barista disertai suara ping notifikasi.
  2. Tiket menampilkan: Nomor Tiket besar (JetBrains Mono), Nama Pemesan, Channel asal (*Kasir* atau *App Online*), waktu tunggu berjalan, serta rincian item & modifier (contoh: *1x Es Kopi Susu Aren - Less Sugar, Extra Shot*).
  3. Barista mendekati layar dan mengetuk tombol **Mulai (Start)** pada tiket.
  4. Tiket berpindah secara animasi ke kolom **"Dibuat (In Progress)"**.
  5. Sistem memancarkan event `OrderPrepStarted`. Status pesanan di App Pelanggan berubah menjadi *"Sedang Dibuat oleh Barista"*.
  6. Barista meracik minuman sesuai instruksi tiket.
  7. Setelah minuman selesai dibuat dan diletakkan di meja pengambilan (*pick-up counter*), Barista mengetuk tombol **Siap (Ready)**.
  8. Tiket berpindah ke kolom **"Siap Diambil (Ready for Pick-up)"**.
  9. Sistem mengeksekusi logika domain engine:
     - Membaca formula resep menu bersangkutan beserta modifier-nya (UC-BO-08).
     - Mengurangi saldo stok bahan baku outlet secara otomatis (contoh: stok biji kopi berkurang 18 gr, susu berkurang 120 ml, cup berkurang 1 pcs).
     - Memeriksa apakah sisa stok berada di bawah batas minimum (safety stock). Jika ya, sistem otomatis memicu event `LowStockAlert` (BR-08).
  10. Sistem memancarkan event `OrderReady` dan `StockConsumed`.
  11. Pelanggan menerima notifikasi instan di smartphone-nya bahwa kopi telah siap diambil.
  12. Saat pelanggan mengambil minumannya, Barista/Kasir mengetuk **Selesai / Diambil (Picked Up)** untuk mengarsipkan tiket dari layar KDS.
- **Alur Alternatif & Eksepsi**:
  - *2a. Barista Lupa Takaran Resep*: Barista mengetuk ikon *Resep* pada kartu tiket; sistem menampilkan modal ringkas takaran gramatur bahan untuk menu tersebut (UC-KDS-05).
  - *2b. Waktu Tunggu Melebihi SLA (> 7 menit)*: Kartu tiket berubah warna bingkai menjadi merah menyala sebagai tanda peringatan keterlambatan (UC-KDS-06).
- **Postkondisi**: Pesanan selesai, pelanggan terlayani, stok bahan outlet berkurang presisi tanpa pencatatan manual.
- **Aturan Bisnis Terkait**: `BR-08` (Stok berkurang otomatis berdasarkan resep saat pesanan selesai dibuat).

---

### 3.7 App Operasi Outlet (Store Manager Mobile)

```
Use Case ID      : UC-OPS-03
Nama Use Case    : Buat Purchase Order (PO) Bahan ke Pusat (Tanpa Harga)
Modul / Fase     : App Operasi Outlet / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Admin Gudang Pusat
```
- **Prekondisi**: Store Manager login di aplikasi mobile operasi outlet. Muncul notifikasi `LowStockAlert` (stok susu/biji kopi menipis).
- **Trigger**: Store Manager memeriksa inventaris outlet dan perlu melakukan pengisian ulang stok (*replenishment*).
- **Alur Utama (Main Flow)**:
  1. Store Manager membuka tab **Pengadaan > Buat PO Baru**.
  2. Sistem menampilkan daftar bahan baku yang terdaftar di warehouse pusat. Bahan yang stoknya di bawah batas minimum otomatis diberi tanda rekomendasi order.
  3. Store Manager memilih bahan dan menginput kuantitas barang yang diminta:
     - *Susu Fresh Milk*: 50 Liter.
     - *Biji Kopi House Blend*: 10 Kilogram.
     - *Cup Plastik 16oz*: 500 pcs.
  4. Antarmuka form **secara tegas tidak menampilkan input harga maupun total rupiah** (BR-04).
  5. Store Manager memasukkan catatan kebutuhan tanggal kirim dan menekan tombol **Ajukan PO ke Pusat**.
  6. Sistem memvalidasi bahwa minimal 1 barang dipilih dengan kuantitas > 0.
  7. Sistem menerbitkan Nomor PO unik dengan status `PORequested`.
  8. Sistem memancarkan event `PORequested`.
  9. PO muncul di antrean Backoffice Gudang Pusat (UC-BO-14).
- **Postkondisi**: Permintaan pengadaan terdaftar secara resmi tanpa menimbulkan komitmen harga awal yang bias.
- **Aturan Bisnis Terkait**: `BR-04` (PO ke supplier/pusat berisi barang dan kuantitas saja, tanpa harga).

---

```
Use Case ID      : UC-OPS-04
Nama Use Case    : Terima Barang Fisik (Goods Receipt) & Update Stok Menunggu Nota
Modul / Fase     : App Operasi Outlet / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Gudang Pusat, Finance
```
- **Prekondisi**: Barang fisik yang dipesan melalui PO telah dikirim oleh gudang pusat dan tiba di outlet.
- **Trigger**: Mobil logistik tiba di outlet membawa pasokan fisik dan surat jalan sementara.
- **Alur Utama (Main Flow)**:
  1. Store Manager membuka menu **Penerimaan Barang (Goods Receipt)** di App Operasi.
  2. Sistem menampilkan daftar PO berstatus dalam pengiriman.
  3. Store Manager memilih PO yang sedang tiba.
  4. Store Manager menghitung fisik barang yang diturunkan dan memasukkan kuantitas aktual yang diterima:
     - Susu Fresh Milk: Dipesan 50 L, Diterima 50 L (Lengkap).
     - Biji Kopi: Dipesan 10 Kg, Diterima 10 Kg (Lengkap).
  5. Store Manager mengambil foto fisik surat jalan / barang menggunakan kamera ponsel untuk bukti lampiran.
  6. Store Manager menekan tombol **Konfirmasi Terima Barang**.
  7. Sistem mengeksekusi pembaruan stok:
     - Saldo fisik stok outlet langsung dinaikkan sesuai kuantitas aktual yang diterima.
     - Lot stok tersebut diberi label khusus **"Menunggu Nota (Awaiting Invoice)"**.
     - Sistem mencatat nilai HPP sementara untuk lot tersebut menggunakan **harga pembelian terakhir (last purchase price)** dari master bahan (BR-05).
  8. Sistem memancarkan event `GoodsReceived`.
  9. Notifikasi penerimaan barang muncul di modul Finance Backoffice untuk menunggu input nota definitif (UC-BO-17).
- **Alur Alternatif & Eksepsi**:
  - *4a. Terjadi Selisih / Penerimaan Sebagian (Partial Receive)*: Jika susu yang tiba hanya 40 L (rusak 10 L di jalan), Store Manager menginput kuantitas terima 40 L dan mengisi catatan selisih 10 L. Sistem hanya menaikkan stok sebesar 40 L dan status PO ditandai "Diterima Sebagian".
- **Postkondisi**: Stok outlet bertambah dan siap dipakai berjualan, nilai HPP sementara aktif, dan tugas verifikasi nota tereskalasi ke Finance.
- **Aturan Bisnis Terkait**: `BR-05` (Penerimaan barang menaikkan stok dengan status "menunggu nota" dan HPP sementara memakai harga terakhir).

---

```
Use Case ID      : UC-OPS-05
Nama Use Case    : Ajukan Belanja Kebutuhan Kas Kecil Bertingkat (Petty Cash)
Modul / Fase     : App Operasi Outlet / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Finance Pusat, Owner
```
- **Prekondisi**: Outlet memerlukan kebutuhan darurat operasional (misal: spons cuci, air galon, es batu darurat).
- **Trigger**: Store Manager mengeluarkan uang tunai dari kas kecil outlet.
- **Alur Utama (Main Flow - Di Bawah Batas Bebas)**:
  1. Store Manager membuka menu **Kas Kecil > Catat Pengeluaran**.
  2. Store Manager menginput:
     - Nominal: Rp 75.000,- (batas bebas outlet: Rp 150.000,-).
     - Keperluan: *Beli es batu kristal 3 karung karena mesin ice maker overheat*.
     - Unggah foto struk pembelian dari warung/toko lokal.
  3. Sistem mendeteksi bahwa nominal Rp 75.000,- **berada di bawah batas maksimum bebas approval** (BR-12).
  4. Store Manager menekan tombol **Simpan Transaksi**.
  5. Sistem langsung menyetujui pengeluaran secara otomatis (`Status: Approved`), mengurangi saldo kas kecil outlet, dan mencatatnya ke buku biaya outlet.
  6. Sistem memancarkan event `PettyCashSubmitted`.
- **Alur Alternatif (Di Atas Batas Bebas - Memerlukan Approval)**:
  - *2a. Nominal Melebihi Batas Bebas*: Store Manager menginput nominal Rp 350.000,- untuk pembelian genset servis darurat.
  - *3a. Sistem mendeteksi nominal > Rp 150.000,-*: Sistem menampilkan label status **"Memerlukan Persetujuan Finance Pusat"**.
  - *4a. Store Manager menekan Kirim Pengajuan*: Pengeluaran masuk ke status `Awaiting Approval`. Saldo kas kecil belum terpotong final hingga disetujui.
  - *5a. Sistem memancarkan event `PettyCashSubmitted`*: Pengajuan muncul di layar persetujuan Finance Backoffice (UC-BO-20).
- **Postkondisi**: Pengeluaran kas kecil tercatat tertib dengan bukti fisik, memitigasi risiko fraud kasir/manager cabang.
- **Aturan Bisnis Terkait**: `BR-12` (Belanja kebutuhan kecil outlet memiliki batas nominal berjenjang).

---

```
Use Case ID      : UC-OPS-07
Nama Use Case    : Usulkan Menu / Resep Lokal Khusus Outlet
Modul / Fase     : App Operasi Outlet / Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Admin Pusat
```
- **Prekondisi**: Store Manager mengidentifikasi selera khas pelanggan lokal atau ketersediaan bahan khas daerah sekitar outlet.
- **Trigger**: Store Manager ingin membuat menu signature lokal outlet.
- **Alur Utama (Main Flow)**:
  1. Store Manager membuka menu **Katalog Outlet > Usulkan Menu Lokal**.
  2. Store Manager mengisi formulir:
     - Nama Menu Usulan: *Es Kopi Kelapa Muda*.
     - Usulan Harga Jual: Rp 24.000,-.
     - Komposisi Resep: 18 gr Espresso + 150 ml Air Kelapa Asli + 10 ml Simple Syrup.
     - Alasan Pengajuan: *Permintaan tinggi dari pelanggan sekitar pantai/perkantoran*.
  3. Store Manager menekan **Kirim Usulan ke Pusat**.
  4. Sistem menyimpan draf menu dengan status `Proposed` (Menunggu Review Pusat).
  5. Sistem memancarkan event `LocalMenuProposed`.
  6. Menu usulan masuk ke antrean persetujuan Admin Pusat di Backoffice (UC-BO-11). Menu **belum muncul** di POS Kasir maupun App Pelanggan.
- **Postkondisi**: Usulan tercatat secara tertib dan menunggu keputusan pimpinan pusat.
- **Aturan Bisnis Terkait**: `BR-09` (Menu lokal diusulkan Store Manager dan disetujui Admin Pusat sebelum aktif).

---

## 4. Spesifikasi Use Case Fase 2: Omni-Channel & CRM

---

### 4.1 App Pelanggan (Customer Mobile App / PWA)

```
Use Case ID      : UC-CUS-02 & UC-CUS-03
Nama Use Case    : Pilih Outlet Terdekat & Eksplorasi Menu dengan Kustomisasi
Modul / Fase     : App Pelanggan / Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
```
- **Prekondisi**: Pelanggan telah membuka aplikasi mobile Kopi Jodi (PWA) di smartphone miliknya.
- **Trigger**: Pelanggan ingin memesan kopi untuk diambil di jalan (*Pick-Up*).
- **Alur Utama (Main Flow)**:
  1. Sistem meminta izin lokasi GPS atau menampilkan daftar outlet terdekat beserta status buka/tutup dan jarak (contoh: *Kopi Jodi - Sudirman, 800 meter, Buka*).
  2. Pelanggan memilih outlet tersebut.
  3. Sistem memuat katalog menu khusus untuk outlet terpilih: menampilkan menu standar global ditambah menu lokal yang disetujui untuk outlet tersebut (UC-BO-11).
  4. Harga yang ditampilkan pada katalog app adalah harga dasar yang telah disesuaikan dengan **kenaikan % khusus channel app** secara otomatis (BR-10).
  5. Pelanggan mengetuk produk *Es Kopi Susu Aren*.
  6. Sistem membuka lembar detail menu:
     - Pilihan Ukuran: Regular / Large (+Rp 4.500 app rate).
     - Pilihan Gula & Es.
     - Topping Ekstra: Grass jelly, Extra Shot.
  7. Pelanggan menentukan preferensi rasa dan mengetuk tombol **+ Keranjang**.
  8. Sistem memperbarui ikon keranjang belanja mengambang di bawah layar.
- **Postkondisi**: Item pesanan tersimpan di keranjang lokal pelanggan sesuai katalog outlet yang dipilih.
- **Aturan Bisnis Terkait**: `BR-09` (Menu lokal tampil sesuai outlet), `BR-10` (Kenaikan % harga khusus channel app order).

---

```
Use Case ID      : UC-CUS-04 & UC-CUS-05
Nama Use Case    : Checkout Keranjang, Pemakaian Voucher, & Pembayaran QRIS Simulasi
Modul / Fase     : App Pelanggan / Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
```
- **Prekondisi**: Item menu telah berada di keranjang belanja pelanggan.
- **Trigger**: Pelanggan menekan tombol keranjang belanja untuk menyelesaikan pesanan.
- **Alur Utama (Main Flow)**:
  1. Pelanggan meninjau ringkasan pesanan di layar Keranjang.
  2. Sistem merinci kalkulasi harga:
     - Subtotal Menu (Harga Dasar + Markup Channel App).
     - Pajak Restoran (Indikatif).
  3. Pelanggan mengetuk tombol **Gunakan Voucher Promo**.
  4. Sistem menampilkan daftar voucher yang berlaku untuk outlet ini (voucher global atau voucher spesifik outlet) (UC-CRM-01).
  5. Pelanggan memilih voucher (contoh: `HEMAT10` - Diskon Rp 10.000,-).
  6. Sistem memvalidasi kelayakan voucher (minimum belanja & kuota), memotong total tagihan, dan menampilkan nilai diskon.
  7. Pelanggan menekan tombol **Lanjut ke Pembayaran**.
  8. Sistem menampilkan opsi pembayaran QRIS (Midtrans Simulasi).
  9. Sistem menampilkan kode QR dinamis.
  10. Pelanggan menekan tombol **"Bayar Sekarang (Simulasi)"**.
  11. Sistem gateway memvalidasi transaksi berhasil, status order menjadi `PAID`.
  12. Sistem memancarkan event `PaymentCaptured` dan `OrderPlaced` dengan atribut `channel: "app"`.
  13. Layar aplikasi langsung berpindah ke layar **Pelacak Pesanan (Live Tracking)**.
  14. Pesanan secara instan muncul di layar POS Kasir outlet (UC-POS-05).
- **Postkondisi**: Pembayaran berhasil, voucher terpakai, dan antrean pesanan online terkirim ke kasir cabang.
- **Aturan Bisnis Terkait**: `BR-11` (Voucher promo global atau per outlet), `BR-15` (Pembayaran QRIS Midtrans simulasi).

---

```
Use Case ID      : UC-CUS-06
Nama Use Case    : Live Tracking Status Pesanan Pelanggan
Modul / Fase     : App Pelanggan / Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Pelanggan
Aktor Pendukung  : Kasir POS, Barista KDS
```
- **Prekondisi**: Pesanan online telah dibayar dan dalam proses operasional outlet.
- **Trigger**: Perubahan status pesanan dari sistem internal outlet yang dipancarkan melalui event bus.
- **Alur Utama (Main Flow)**:
  1. Pelanggan membuka layar **Status Pesanan Saya**.
  2. Sistem menampilkan stepper alur real-time:
     - Tahap 1: *Pesanan Diterima Kasir* (saat Kasir menekan Accept di POS).
     - Tahap 2: *Sedang Dibuat Barista* (saat Barista menekan Mulai di KDS).
     - Tahap 3: *Siap Diambil di Pick-Up Counter* (saat Barista menekan Siap di KDS).
  3. Saat event `OrderReady` dipancarkan oleh KDS Barista:
     - Aplikasi smartphone bergetar dan membunyikan notifikasi push simulasi.
     - Tampilan stepper berubah menjadi hijau cerah dengan teks: *"Pesanan Anda Siap Diambil! Tunjukkan Nomor Tiket #A-102 ke Barista"*.
  4. Pelanggan mendatangi meja counter dan mengambil pesanannya.
  5. Setelah kasir/barista menyelesaikan tiket, status layar berubah menjadi *"Pesanan Selesai. Selamat Menikmati!"*.
- **Postkondisi**: Pelanggan mendapat kepastian waktu tunggu tanpa perlu berdiri mengantre di depan kasir.

---

### 4.2 Panel Promo CRM

```
Use Case ID      : UC-CRM-01 & UC-CRM-02
Nama Use Case    : Buat Voucher Promo & Tentukan Cakupan Wilayah (Global / Outlet)
Modul / Fase     : Panel Promo CRM / Fase 2 (Omni)
Prioritas        : P0
Aktor Utama      : Tim Marketing
Aktor Pendukung  : Finance
```
- **Prekondisi**: Pengguna memiliki peran Marketing pada ekosistem backoffice.
- **Trigger**: Perencanaan kampanye promosi penjualan untuk meningkatkan transaksi.
- **Alur Utama (Main Flow)**:
  1. Marketing membuka menu **Marketing CRM > Kelola Voucher & Promo**.
  2. Marketing menekan tombol **Buat Kampanye Voucher Baru**.
  3. Marketing mengisi parameter voucher:
     - Kode Kupon (contoh: *SUDIRMANSERU*).
     - Judul Promo & Deskripsi Menarik.
     - Tipe Diskon: Radio button (*Persentase %* atau *Nominal Rupiah Tetap*).
     - Nilai Diskon: (contoh: Rp 10.000,- atau 20%).
     - Minimum Belanja Transaksi (contoh: Rp 40.000,-).
     - Batas Maksimum Kuota Pemakaian (contoh: 500 klaim).
     - Periode Berlaku: Tanggal mulai s/d tanggal berakhir.
  4. Marketing menentukan **Cakupan Wilayah (Scope)**:
     - Opsi A: *Global (Berlaku di Seluruh Outlet Kopi Jodi)*.
     - Opsi B: *Outlet Tertentu (Hanya Berlaku di Kopi Jodi - Sudirman)* (BR-11).
  5. Marketing memilih opsi B (spesifik outlet Sudirman).
  6. Marketing menekan tombol **Terbitkan Voucher**.
  7. Sistem menyimpan konfigurasi voucher dan memancarkan event `VoucherCreated`.
  8. Sistem menampilkan pratinjau kartu voucher pada emulator layar App Pelanggan di sisi kanan layar CRM.
- **Postkondisi**: Voucher aktif secara otomatis hanya di keranjang belanja pelanggan yang memilih outlet bersangkutan.
- **Aturan Bisnis Terkait**: `BR-11` (Promo/voucher fleksibel: global atau per outlet).

---

## 5. Spesifikasi Use Case Fase 3: Scale, Investor & Eksekutif

---

### 5.1 Portal Mitra / Investor (Read-Only)

```
Use Case ID      : UC-PRT-02 & UC-PRT-03
Nama Use Case    : Pantau Kinerja Keuangan & Transparansi HPP Cabang Kemitraan
Modul / Fase     : Portal Mitra / Fase 3 (Scale)
Prioritas        : P1 (Read-Only P0)
Aktor Utama      : Mitra / Investor Cabang
Aktor Pendukung  : Finance Pusat
```
- **Prekondisi**: Mitra telah login ke portal investor dan memiliki hak akses terhadap outlet miliknya (contoh: Outlet Sudirman & Outlet Kemang).
- **Trigger**: Mitra ingin memantau performa penjualan dan penggunaan biaya cabang investasinya.
- **Alur Utama (Main Flow)**:
  1. Mitra memilih outlet miliknya dari bilah navigasi atas.
  2. Sistem menampilkan dashboard analitik **khusus baca (read-only)** tanpa tombol modifikasi data:
     - Kartu KPI: Total Omzet Hari Ini, Jumlah Transaksi, Rata-rata Nilai Transaksi (*Average Order Value*).
     - Grafik Tren Penjualan per Jam dan per Hari.
  3. Mitra membuka tab **Laporan Biaya & HPP (Cost & COGS)**.
  4. Sistem menyajikan transparansi pemakaian bahan dan status akuntansi:
     - Total Nilai Penjualan Kotor.
     - Total HPP Bahan Baku.
     - Label Status HPP: Menampilkan badge hijau *"HPP Terkoreksi Definitif"* untuk nota yang telah diverifikasi Finance, atau badge kuning *"HPP Sementara (Menunggu Faktur)"* untuk pasokan yang baru tiba (BR-06).
     - Beban Kas Kecil Operasional Outlet yang Disetujui.
     - Estimasi Laba Kotor Cabang.
  5. Mitra membuka tab **Profil Kepemilikan Cabang**.
  6. Sistem menampilkan informasi outlet dan status persentase kepemilikan bertuliskan **"Belum Diatur"** (BR-14). Sistem **secara tegas tidak menampilkan perhitungan kalkulasi bagi hasil/dividen** sesuai kesepakatan penundaan skema bagi hasil.
  7. Mitra dapat menekan tombol **Unduh Ringkasan Laporan (PDF)** untuk arsip pribadi.
- **Postkondisi**: Mitra mendapatkan transparansi penuh atas operasional outletnya tanpa risiko kebocoran data cabang lain atau modifikasi data.
- **Aturan Bisnis Terkait**: `BR-06` (Transparansi status HPP sementara/terkoreksi), `BR-14` (Field kepemilikan disiapkan tapi kosong, bagi hasil ditunda).

---

### 5.2 Owner Dashboard & Eksekutif

```
Use Case ID      : UC-OWN-01 & UC-OWN-02
Nama Use Case    : Pantau Konsolidasi KPI & Komparasi Antar-Outlet
Modul / Fase     : Owner Dashboard / Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Owner / Superadmin
```
- **Prekondisi**: Owner login ke portal eksekutif melalui browser desktop atau tablet.
- **Trigger**: Evaluasi rutin jajaran direksi terhadap kinerja seluruh jaringan outlet kopi.
- **Alur Utama (Main Flow)**:
  1. Owner membuka halaman beranda **Executive Overview**.
  2. Sistem menyajikan metrik makro konsolidasi real-time:
     - Total Omzet Jaringan Hari Ini (gabungan seluruh cabang).
     - Margin Rata-rata Jaringan (%).
     - Total Volume Transaksi & Pertumbuhan Mingguan.
     - Jumlah Pesanan Online App vs Pesanan Kasir POS.
  3. Owner memeriksa tabel **Peringkat & Perbandingan Outlet (Branch Ranking)**:
     - Membandingkan performa outlet milik sendiri (*own store*) vs outlet mitra (*franchise/partner store*).
     - Ranking omzet tertinggi s/d terendah.
     - Persentase food cost / HPP per cabang untuk mendeteksi pemborosan resep.
  4. Owner memeriksa panel **Pusat Peringatan Dini (Executive Alerts)**:
     - Alert cabang dengan saldo hutang bahan ke pusat yang menumpuk.
     - Alert cabang dengan bahan kritis yang hampir habis.
     - Alert deviasi biaya operasional kas kecil yang melonjak tinggi.
- **Postkondisi**: Owner memiliki visibilitas helikopter (*helicopter view*) atas seluruh denyut bisnis jaringan kopi.
- **Aturan Bisnis Terkait**: `BR-13` (Finance dan pengawasan terpusat), `BR-17` (Satu instalasi per brand).

---

```
Use Case ID      : UC-OWN-03
Nama Use Case    : Pusat Persetujuan Eksekutif Terpadu (Executive Approvals)
Modul / Fase     : Owner Dashboard / Fase 3 (Scale)
Prioritas        : P1
Aktor Utama      : Owner / Superadmin
Aktor Pendukung  : Store Manager, Finance
```
- **Prekondisi**: Terdapat permohonan tingkat tinggi dari cabang yang memerlukan otorisasi pemilik bisnis.
- **Trigger**: Pembelian luar pusat (UC-OPS-06) atau pengeluaran kas kecil bernominal besar di atas wewenang Finance (UC-OPS-05).
- **Alur Utama (Main Flow)**:
  1. Owner membuka tab **Pusat Persetujuan (Approval Center)**.
  2. Sistem mengelompokkan antrean persetujuan menjadi 2 tab:
     - Tab 1: *Izin Pembelian Luar Pusat (External Vendor)*.
     - Tab 2: *Pengeluaran Kas Kecil Nominal Besar*.
  3. Owner memilih salah satu permohonan untuk meninjau rincian biaya dan dokumen pendukung.
  4. Owner memberikan keputusan dengan 1-klik: **Setujui** atau **Tolak**.
  5. Sistem memancarkan event persetujuan (`ExternalPurchaseApproved` atau `PettyCashApproved`) yang langsung memperbarui status di aplikasi cabang pemohon.
- **Postkondisi**: Tata kelola keuangan terkontrol ketat dari level tertinggi manajemen.
- **Aturan Bisnis Terkait**: `BR-03` (Belanja luar pusat wajib persetujuan pimpinan), `BR-12` (Kas kecil nominal besar butuh persetujuan pimpinan).

---

### 5.3 Demo Stage Orchestrator & Shell Presentasi

```
Use Case ID      : UC-STG-01 s/d UC-STG-03
Nama Use Case    : Orkestrasi Multi-Perangkat & Presentasi Otomatis "Satu Gelas, Satu Cerita"
Modul / Fase     : Demo Stage / Cross-Phase
Prioritas        : P0
Aktor Utama      : Presenter / Developer
Aktor Pendukung  : Klien Coffee Shop (Audiens Presentasi)
```
- **Prekondisi**: Aplikasi dibuka di browser laptop presenter pada rute `/stage`. Seluruh aplikasi mini tertanam sebagai iframe tanpa chrome internal (`?embed=1`).
- **Trigger**: Presentasi penawaran proyek ekosistem aplikasi di hadapan calon klien.
- **Alur Utama (Main Flow - Mode Presentasi Otomatis)**:
  1. Presenter menampilkan layar Demo Stage yang menyajikan 4 bingkai perangkat realistis sekaligus:
     - Bingkai HP Kiri: App Pelanggan.
     - Bingkai Tablet Tengah: POS Kasir.
     - Bingkai Monitor Atas: KDS Barista.
     - Bingkai HP Kanan: App Operasi Outlet (atau tab desktop Backoffice/Owner).
  2. Presenter menekan tombol **"Play Demo (Satu Gelas, Satu Cerita)"**.
  3. Sistem memulai alur otomatis berdurasi 5–7 menit dengan narasi penjelasan bertahap di bilah bawah layar:
     - **Langkah 1**: Pelanggan memesan *Es Kopi Susu* via App Pelanggan + Bayar QRIS simulasi -> Event `OrderPlaced`.
     - **Langkah 2**: Bingkai POS Kasir menerima tiket dengan badge "Online" dan meneruskannya ke KDS.
     - **Langkah 3**: KDS Barista menerima tiket, status berubah "Mulai" -> "Siap". Status di HP Pelanggan bergerak live.
     - **Langkah 4**: Saat status Siap, sistem memotong stok susu dan kopi sesuai resep.
     - **Langkah 5**: Stok susu melewati batas safety stock -> App Operasi Outlet membunyikan alert stok menipis.
     - **Langkah 6**: Store Manager di App Operasi menerbitkan PO tanpa harga ke gudang pusat.
     - **Langkah 7**: Store Manager menerima barang fisik -> Stok naik status "Menunggu Nota", HPP sementara aktif.
     - **Langkah 8**: Finance di Backoffice menginput nota faktur asli -> HPP terkoreksi otomatis (true-up), hutang tercatat.
     - **Langkah 9**: Dashboard Owner dan Portal Mitra bergerak live memperbarui grafik laba dan HPP riil.
  4. Selama alur berlangsung, garis aliran animasi (flow particles) bergerak antar bingkai perangkat untuk memvisualisasikan bagaimana data mengalir.
  5. Presenter dapat menjeda (*Pause*), mempercepat (1x, 2x), atau melompati langkah sesuai dinamika tanya-jawab klien.
- **Postkondisi**: Klien memahami secara visual dan menyeluruh bagaimana 9 aplikasi bekerja harmonis sebagai satu ekosistem terpadu.

---

```
Use Case ID      : UC-STG-04 & UC-STG-05
Nama Use Case    : White-Label Theme Switcher & Reset Demo State
Modul / Fase     : Demo Stage / Cross-Phase
Prioritas        : P0 / P1
Aktor Utama      : Presenter / Developer
```
- **Prekondisi**: Demo Stage sedang berjalan.
- **Trigger**: Presenter ingin mendemonstrasikan bahwa sistem dapat dijual ke brand kopi lain (white-label) atau mengulang demo dari awal.
- **Alur Utama (Main Flow - White Label Switch)**:
  1. Presenter membuka pemilih merek di bilah atas Stage: Dropdown Brand (*Kopi Jodi* vs *Teras Kopi*).
  2. Presenter memilih brand kedua: **"Teras Kopi"**.
  3. Sistem memancarkan event `BrandThemeChanged`.
  4. Variabel CSS design tokens (`--brand-600`, `--brand-50`, logo) berubah secara serentak di seluruh iframe:
     - Warna utama cokelat hangat Kopi Jodi (`#7A4A2B`) berubah menjadi hijau toska elegan Teras Kopi (`#0B6666`).
     - Logo dan nama brand di POS, KDS, HP Pelanggan, dan Backoffice berganti tanpa me-reload aplikasi.
- **Alur Utama (Main Flow - Reset Demo)**:
  1. Presenter menekan tombol merah **"Reset Demo Data"**.
  2. Sistem menampilkan dialog konfirmasi pengosongan data.
  3. Presenter mengonfirmasi.
  4. Sistem mengosongkan IndexedDB event log dan menginjeksi ulang data seed awal (3 outlet, 20 menu, 25 bahan baku, riwayat 14 hari).
  5. Seluruh aplikasi kembali ke kondisi bersih awal (T0) siap didemokan kembali.
- **Postkondisi**: Fleksibilitas komersial terbukti dan keandalan demo terjamin bebas error residu.
- **Aturan Bisnis Terkait**: `BR-17` (Satu instalasi per brand, siap white-label).

---

## 6. Matriks Keterlacakan Aturan Bisnis

Tabel berikut membuktikan bahwa setiap **Aturan Bisnis (BR-01 s/d BR-17)** dari Dokumen PRD telah diakomodasi secara tuntas di dalam use case spesifik:

| ID Aturan | Ringkasan Aturan Bisnis PRD | Use Case yang Mengimplementasikan |
|:---:|---|---|
| **BR-01** | Ekosistem satu kesatuan, fitur dapat dimatikan lewat toggle | `UC-BO-04` (Kelola Feature Toggle Sistem) |
| **BR-02** | Warehouse mandiri per outlet, master bahan di ERP | `UC-BO-01` (Master Bahan), `UC-BO-02` (Master Outlet), `UC-BO-12` (Stok Multi-Outlet) |
| **BR-03** | Pembelian luar pusat wajib izin pimpinan | `UC-BO-15` (Review Pembelian Luar), `UC-OPS-06` (Ajukan Beli Luar), `UC-OWN-03` |
| **BR-04** | PO ke pusat/supplier tanpa kolom harga | `UC-BO-14` (Monitor PO), `UC-OPS-03` (Buat PO Tanpa Harga di Mobile) |
| **BR-05** | Terima barang naikkan stok "menunggu nota" + HPP harga terakhir | `UC-OPS-04` (Terima Barang Fisik), `UC-BO-13` (Pantau Stok Menunggu Nota) |
| **BR-06** | Input nota koreksi HPP definitif (true-up) & catat hutang | `UC-BO-17` (Input Nota & True-up HPP), `UC-PRT-03` (Transparansi HPP Mitra) |
| **BR-07** | Pembayaran ke pusat manual di Backoffice, periodik/fleksibel | `UC-BO-18` (Saldo Hutang), `UC-BO-19` (Catat Pembayaran ke Pusat) |
| **BR-08** | Stok terpotong otomatis dari resep saat pesanan selesai dibuat | `UC-BO-08` (Resep & Olahan), `UC-KDS-03` (Selesai Pesanan & Potong Stok) |
| **BR-09** | Usulan menu lokal butuh approval pusat & hanya aktif di outlet pengusul | `UC-OPS-07` (Usulan Menu Lokal), `UC-BO-11` (Approval Menu), `UC-POS-02`, `UC-CUS-02` |
| **BR-10** | Harga jual sama di semua channel, markup % khusus channel app | `UC-BO-05` (Parameter Markup), `UC-POS-02` (Harga Walk-in), `UC-CUS-04` (Harga App) |
| **BR-11** | Promo/voucher fleksibel: global atau per outlet tertentu | `UC-CRM-01` (Buat Voucher), `UC-CRM-02` (Cakupan Wilayah), `UC-CUS-04` (Terapkan Kupon) |
| **BR-12** | Kas kecil bertingkat: di bawah batas bebas, di atas batas butuh approval | `UC-OPS-05` (Pengajuan Kas Kecil), `UC-BO-20` (Approval Kas Kecil), `UC-OWN-03` |
| **BR-13** | Biaya operasional pusat diatur Finance pusat | `UC-BO-21` (Laporan Margin & Beban Terpusat), `UC-OWN-01` (KPI Konsolidasi) |
| **BR-14** | Kepemilikan outlet (own/mitra) % kosong, bagi hasil ditunda | `UC-BO-02` (Master Outlet), `UC-PRT-04` (Status Kepemilikan Tanpa Bagi Hasil) |
| **BR-15** | Pembayaran QRIS Midtrans (simulasi di demo) | `UC-POS-04` (Bayar QRIS POS), `UC-CUS-05` (Bayar QRIS Pelanggan) |
| **BR-16** | Parameter pajak (PPN/PPh) konfiguratif, bukan hardcode | `UC-BO-05` (Konfigurasi Parameter Pajak) |
| **BR-17** | Satu instalasi per brand, siap white-label (light-only) | `UC-STG-04` (White-Label Theme Switcher), `UC-STG-05` (Reset Demo) |

---
*Dokumen Use Case ini dikompilasi secara otomatis berdasarkan kebutuhan fungsional dan teknis PRD v1.1 Kopi Jodi.*
