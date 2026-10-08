# Modul ERP Backoffice: Inventory & Pengadaan (Procurement)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk modul **Inventory Multi-Outlet, Pengadaan Bahan, PO Tanpa Harga, dan Approval Pembelian Luar Pusat** pada ERP Backoffice (Fase 1 Core).

---

## UC-BO-12: Pantau Stok Multi-Outlet & Kartu Stok Terpusat

```
Use Case ID      : UC-BO-12
Nama Use Case    : Pantau Stok Multi-Outlet & Kartu Stok Terpusat
Modul            : ERP Backoffice (Inventory)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat / Finance Pusat
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Menyajikan visibilitas terpadu atas kuantitas fisik persediaan bahan baku di seluruh cabang kedai kopi secara real-time, mendeteksi bahan yang menipis, dan menyediakan histori pergerakan barang dalam Kartu Stok (*Stock Ledger*).

### 2. Prekondisi
- Outlet dan bahan baku telah terdaftar di sistem.

### 3. Pemicu (Trigger)
- Audit inventaris rutin atau investigasi selisih stok bahan baku.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Inventory > Stok Multi-Outlet**.
2. Pengguna dapat memilih filter outlet (*Semua Outlet* atau outlet spesifik, misal: *Kopi Jodi - Sudirman*).
3. Sistem menampilkan tabel inventaris dengan kolom:
   - Nama Bahan & Kategori.
   - Satuan Pakai (gram, ml, pcs).
   - **Stok On-Hand**: Kuantitas fisik yang tersedia saat ini di outlet.
   - **Stok Menunggu Nota**: Kuantitas barang yang sudah diterima fisik namun faktur belum diverifikasi Finance.
   - **Batas Minimum (Safety Stock)**: Ambang batas peringatan stok menipis.
   - **Indikator Status**: *Aman* (Hijau), *Menipis* (Kuning), *Habis / Kritis* (Merah).
4. Pengguna mengklik salah satu baris bahan (contoh: *Biji Kopi House Blend* pada outlet Sudirman).
5. Sistem membuka tampilan **Kartu Stok (Stock Ledger)** terperinci yang mencatat kronologi mutasi:
   - Timestamp (Tanggal & Jam).
   - Tipe Pergerakan (*Masuk dari PO / Terpakai Pesanan KDS / Penyesuaian Opname / Produksi Olahan*).
   - Referensi Dokumen (Nomor Order / Nomor PO / ID Opname).
   - Kuantitas Masuk / Keluar.
   - Saldo Akhir Kuantitas.
6. Pengguna dapat mengunduh rekaman kartu stok ke dalam format CSV/Excel.

### 5. Postkondisi
- Manajemen memiliki audit trail lengkap mutasi bahan per outlet tanpa mencampuradukkan gudang antar cabang.

### 7. Aturan Bisnis Terkait
- **BR-02**: Setiap outlet memiliki tempat stok (warehouse) sendiri; data inventaris terisolasi per cabang.

---

## UC-BO-13: Pantau Status Stok "Menunggu Nota" (Awaiting Invoice)

```
Use Case ID      : UC-BO-13
Nama Use Case    : Pantau Status Stok "Menunggu Nota"
Modul            : ERP Backoffice (Inventory & Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Memfilter dan mengawasi lot persediaan bahan baku yang telah diterima secara fisik di outlet namun belum memiliki faktur resmi dengan harga definitif. Lot ini menggunakan estimasi HPP sementara berdasarkan harga beli terakhir.

### 2. Prekondisi
- Store Manager outlet telah melakukan konfirmasi penerimaan barang fisik di App Operasi (UC-OPS-04).

### 3. Pemicu (Trigger)
- Event `GoodsReceived` diterima sistem dengan lot status `awaiting_invoice`.

### 4. Alur Utama (Main Flow)
1. Finance membuka menu **Inventory > Stok Menunggu Nota**.
2. Sistem menyaring dan hanya menampilkan lot bahan yang berstatus `awaiting_invoice`:
   - Nama Outlet & Nama Bahan.
   - Tanggal Barang Tiba di Outlet.
   - Kuantitas Diterima Fisik.
   - **Harga Satuan Sementara (Last Purchase Price)**.
   - **Estimasi Nilai Barang Sementara (Rp)**.
   - Nomor Referensi Surat Jalan / PO.
   - Tombol Aksi Cepat: **Input Nota Resmi** (shortcut ke UC-BO-17).
3. Finance memeriksa berapa lama lot tersebut menggantung tanpa nota (*aging pending invoice*).
4. Jika terdapat lot yang menggantung lebih dari 3 hari, sistem menampilkan badge peringatan kuning berkedip untuk segera ditagihkan ke supplier/gudang pusat.

### 5. Postkondisi
- Finance memiliki daftar prioritas nota yang wajib segera diinput agar laporan keuangan cabang tidak bias.

### 7. Aturan Bisnis Terkait
- **BR-05**: Penerimaan barang menaikkan stok dengan status "menunggu nota" dan HPP sementara memakai harga terakhir.

---

## UC-BO-14: Monitor Purchase Order (PO) Tanpa Harga dari Outlet

```
Use Case ID      : UC-BO-14
Nama Use Case    : Monitor Purchase Order (PO) Tanpa Harga dari Outlet
Modul            : ERP Backoffice (Pengadaan Pusat)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Gudang Pusat
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Menerima dan memproses pengajuan Purchase Order dari cabang kedai kopi ke gudang pusat logistik. Dokumen PO ini secara ketat hanya berisi daftar item barang dan kuantitas permintaan tanpa kolom harga rupiah.

### 2. Prekondisi
- Store Manager telah mengajukan PO dari App Operasi Outlet (UC-OPS-03).

### 3. Pemicu (Trigger)
- Event `PORequested` diterima oleh modul Backoffice.

### 4. Alur Utama (Main Flow)
1. Admin Gudang Pusat membuka menu **Pengadaan > Antrean Purchase Order**.
2. Sistem menampilkan daftar PO berstatus *Diajukan (Requested)*:
   - Nomor PO (format: `PO-YYMM-XXXX`).
   - Tanggal & Waktu Pengajuan.
   - Outlet Pemohon.
   - Jumlah Varian Barang & Total Kuantitas.
   - Status Dokumen.
3. Admin membuka detail PO.
4. Sistem menyajikan daftar barang dan kuantitas permintaan **tanpa ada kolom harga sama sekali** (sesuai BR-04):
   - Item 1: *Susu Fresh Milk* — 50 Liter.
   - Item 2: *Biji Kopi House Blend* — 10 Kg.
   - Item 3: *Cup Plastik 16oz* — 500 pcs.
5. Admin Gudang Pusat menyiapkan fisik barang di gudang sentral dan menekan tombol **Kirim Barang ke Outlet**.
6. Sistem mengubah status PO menjadi `POSentToCentral` (Dalam Pengiriman Logistik).
7. Sistem memancarkan event `POSentToCentral`.
8. Di App Operasi Outlet pemohon, status PO otomatis berubah menjadi *"Dalam Pengiriman"*, siap diterima fisiknya.

### 5. Postkondisi
- Alur rantai pasok bergerak tanpa membebani Store Manager dengan komitmen harga beli yang belum pasti.

### 7. Aturan Bisnis Terkait
- **BR-04**: PO ke supplier/pusat berisi barang dan kuantitas saja, **tanpa harga**.

---

## UC-BO-15: Review Pengajuan Pembelian Bahan Luar Pusat (External Vendor)

```
Use Case ID      : UC-BO-15
Nama Use Case    : Review Pengajuan Pembelian Bahan Luar Pusat
Modul            : ERP Backoffice (Persetujuan / Approval)
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Owner / Pimpinan
Aktor Pendukung  : Store Manager, Finance
```

### 1. Deskripsi
Meninjau permohonan darurat dari Store Manager untuk membeli bahan baku operasional ke toko/supermarket lokal di luar pasokan gudang pusat. Pembelian ini membutuhkan otorisasi wajib dari pimpinan sebelum barang dapat dibeli.

### 2. Prekondisi
- Store Manager telah mengajukan permohonan beli luar melalui App Operasi Outlet (UC-OPS-06).

### 3. Pemicu (Trigger)
- Event `ExternalPurchaseRequested` masuk ke antrean persetujuan.

### 4. Alur Utama (Main Flow)
1. Owner membuka menu **Persetujuan > Pembelian Luar Pusat**.
2. Sistem menyajikan daftar permohonan aktif:
   - Nama Outlet Pengaju.
   - Nama Toko / Supplier Lokal yang Dituju (contoh: *Supermarket Grand Lucky*).
   - Daftar Bahan & Kuantitas yang Diminta (contoh: *Susu Diamond Fresh Milk - 20 Liter*).
   - Estimasi Biaya (contoh: Rp 420.000,-).
   - Alasan Mendesak: Teks (contoh: *"Stok susu habis total di jam sibuk makan siang, truk pusat tertahan macet banjir"*).
3. Owner memverifikasi urgensi dan memastikan bahan tersebut diizinkan dibeli dari luar (BR-03).
4. Owner menekan tombol **Setujui Pembelian Luar**.
5. Sistem memperbarui status pengajuan menjadi `Approved` dengan mencatat identitas Owner dan waktu persetujuan.
6. Sistem memancarkan event `ExternalPurchaseApproved`.
7. App Operasi Outlet menerima notifikasi instan bahwa izin telah disetujui, sehingga Store Manager dapat membeli barang tersebut dengan kas kecil/bon darurat.

### 5. Alur Alternatif (Owner Menolak Izin)
- **4a. Menolak Permohonan**: Owner menekan tombol **Tolak (Reject)** dan mengisi alasan (contoh: *"Truk pusat dijadwalkan tiba dalam 30 menit, jangan beli di luar"*).
- **5a. Status Berubah**: Sistem mengubah status menjadi `Rejected` dan memancarkan event `ExternalPurchaseRejected`. Outlet dilarang melakukan pembelian.

### 6. Postkondisi
- Kontrol sentralisasi pengadaan tetap terjaga ketat meskipun menghadapi kondisi darurat lapangan.

### 7. Aturan Bisnis Terkait
- **BR-03**: Outlet berbelanja bahan lewat warehouse pusat; pembelian luar pusat **wajib persetujuan pimpinan**.

---

## UC-BO-16: Stock Opname Terpusat & Penyesuaian Nilai Stok

```
Use Case ID      : UC-BO-16
Nama Use Case    : Stock Opname Terpusat & Penyesuaian Nilai Stok
Modul            : ERP Backoffice (Inventory)
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Finance Pusat / Admin
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Menerima hasil penghitungan fisik persediaan harian/mingguan dari outlet, membandingkannya dengan saldo teoritis sistem, menghitung selisih rugi/lebih (*variance*), dan menyetujui jurnal penyesuaian stok.

### 2. Prekondisi
- Store Manager telah menginput hasil hitung fisik melalui App Operasi.

### 3. Pemicu (Trigger)
- Formulir Stock Opname cabang disubmit ke pusat.

### 4. Alur Utama (Main Flow)
1. Finance membuka menu **Inventory > Hasil Stock Opname**.
2. Sistem menyajikan hasil opname per outlet:
   - Bahan Baku.
   - Stok Sistem (Buku).
   - Stok Fisik Aktual (Hitungan Lapangan).
   - Selisih Fisik (+/-).
   - Estimasi Nilai Rupiah Selisih (Selisih Fisik $\times$ Harga Beli Terakhir).
   - Catatan Keterangan Outlet (contoh: *2 Liter susu pecah saat bongkar muatan*).
3. Finance memeriksa kewajaran selisih.
4. Finance menekan tombol **Setujui Penyesuaian Stok (Adjust Stock)**.
5. Sistem memperbarui saldo stok on-hand outlet menjadi persis sama dengan hasil hitung fisik aktual.
6. Sistem mencatat nilai selisih minus sebagai akun *Beban Kerusakan / Kehilangan Bahan (Waste / Spillage)* pada laporan laba/rugi cabang.
7. Sistem memancarkan event `StockAdjusted`.

### 5. Postkondisi
- Posisi stok sistem kembali sinkron 100% dengan kondisi fisik riil di lapangan.
