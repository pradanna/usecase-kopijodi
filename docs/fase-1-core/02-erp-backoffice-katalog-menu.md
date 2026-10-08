# Modul ERP Backoffice: Katalog, Resep & Menu Lokal

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk modul **Katalog Menu, Formula Resep, Modifier, dan Persetujuan Menu Lokal** pada ERP Backoffice (Fase 1 Core).

---

## UC-BO-07: Kelola Master Menu & Kategori

```
Use Case ID      : UC-BO-07
Nama Use Case    : Kelola Master Menu & Kategori
Modul            : ERP Backoffice (Katalog)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Marketing
```

### 1. Deskripsi
Memungkinkan Admin Pusat untuk mengelola item produk minuman dan makanan yang dijual di jaringan kedai kopi, mengelompokkannya ke dalam kategori, menentukan harga dasar, serta mengunggah foto produk.

### 2. Prekondisi
- Admin Pusat telah login ke web Backoffice.

### 3. Pemicu (Trigger)
- Peluncuran menu baru atau pembaruan deskripsi/foto produk yang sudah ada.

### 4. Alur Utama (Main Flow)
1. Admin membuka menu **Katalog > Master Menu**.
2. Sistem menampilkan daftar produk dalam tab kategori (*Signature Coffee, Espresso Based, Non-Coffee, Tea, Bakery & Snacks*), menampilkan harga dasar, status aktif/nonaktif, dan cakupan penjualan (*Global* atau *Outlet Tertentu*).
3. Admin menekan tombol **+ Tambah Menu Baru**.
4. Admin mengisi form:
   - **Nama Menu**: (contoh: *Es Kopi Susu Aren Gula Jawa*).
   - **Kategori**: Pilihan dropdown (*Signature Coffee*).
   - **Harga Jual Dasar (Rp)**: Nominal rupiah dasar berlaku di kasir walk-in (contoh: Rp 22.000,-).
   - **Deskripsi Produk**: Teks singkat untuk tampilan aplikasi pelanggan.
   - **Unggah Foto Produk**: File gambar produk beresolusi optimal.
   - **Cakupan Menu**: Radio button (*Global Semua Outlet* / *Khusus Outlet Tertentu*).
   - **Status Ketersediaan**: Toggle *Aktif / Nonaktif*.
5. Admin menekan tombol **Simpan Menu**.
6. Sistem memvalidasi kelengkapan data.
7. Sistem menyimpan record menu dan memancarkan event `MenuItemCreated`.
8. Menu baru terdaftar dan siap dihubungkan dengan resep komposisi bahan baku (UC-BO-08).

### 5. Alur Alternatif & Eksepsi
- **4a. Harga Jual Dasar Nol atau Negatif**: Sistem menampilkan peringatan *"Harga dasar harus lebih besar dari Rp 0"* dan menolak penyimpanan.

### 6. Postkondisi
- Item menu terdaftar di master katalog pusat.

### 7. Aturan Bisnis Terkait
- **BR-10**: Harga dasar jual sama di semua channel; channel app order otomatis menaikkan harga berdasarkan konfigurasi persentase markup.

---

## UC-BO-08: Kelola Resep Menu & Bahan Olahan Bertingkat

```
Use Case ID      : UC-BO-08
Nama Use Case    : Kelola Resep Menu & Bahan Olahan Bertingkat
Modul            : ERP Backoffice (Katalog & Resep)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Store Manager, Barista
```

### 1. Deskripsi
Mengonfigurasi daftar takaran bahan baku (*bill of materials / recipe*) untuk setiap porsi menu kopi dan mendefinisikan formula produksi untuk bahan setengah jadi (*semi-finished goods / bahan olahan*, seperti sirup gula aren racikan atau cold brew concentrate).

### 2. Prekondisi
- Master bahan baku (UC-BO-01) dan master menu (UC-BO-07) sudah tersedia.

### 3. Pemicu (Trigger)
- Penentuan SOP takaran racikan minuman untuk otomatisasi pemotongan stok saat pesanan selesai.

### 4. Alur Utama (Main Flow)
1. Admin membuka menu **Katalog > Formula Resep**.
2. Admin memilih menu target (contoh: *Es Kopi Susu Aren Ukuran Reguler*).
3. Sistem menampilkan formulir komposisi resep saat ini.
4. Admin menambahkan baris bahan baku yang dikonsumsi per porsi:
   - Bahan 1: *Biji Kopi House Blend* $\rightarrow$ 18 gram.
   - Bahan 2: *Susu Fresh Milk* $\rightarrow$ 120 ml.
   - Bahan 3: *Sirup Gula Aren (Bahan Olahan)* $\rightarrow$ 25 ml.
   - Bahan 4: *Cup Plastik 16oz* $\rightarrow$ 1 pcs.
   - Bahan 5: *Tutup Cup Dome & Sedotan* $\rightarrow$ 1 set.
5. Sistem secara otomatis mengkalkulasi estimasi HPP teoretis per porsi berdasarkan harga pembelian bahan terakhir (*last price*).
6. Admin menekan tombol **Simpan Resep**.
7. Sistem memvalidasi bahwa setiap baris bahan memiliki kuantitas > 0 dan satuan pakai cocok dengan master bahan.
8. Sistem menyimpan resep dan memancarkan event `RecipeConfigured`.

### 5. Alur Alternatif (Formula Bahan Olahan Semi-Finished)
- **2a. Konfigurasi Resep Bahan Olahan**: Admin memilih bahan olahan (contoh: *Sirup Gula Aren Batch 1 Liter*).
- **4a. Menentukan Bahan Input**: Admin menginput komposisi: *Gula Aren Padat Asli* (800 gram) + *Air Mineral Galon* (400 ml).
- **7a. Simpan Formula Olahan**: Sistem menandai bahwa bahan ini dapat diproduksi di outlet melalui fitur batching (UC-OPS-08).

### 6. Postkondisi
- Komposisi resep tersimpan di domain engine.
- KDS Barista otomatis menggunakan formula ini untuk memotong stok saat pesanan selesai (UC-KDS-03).

### 7. Aturan Bisnis Terkait
- **BR-08**: Stok berkurang otomatis berdasarkan resep saat pesanan selesai dibuat; bahan olahan (sirup, cold brew) didukung sebagai bahan setengah jadi berformula mandiri.

---

## UC-BO-09: Kelola Modifier Menu (Ukuran, Gula, Add-ons)

```
Use Case ID      : UC-BO-09
Nama Use Case    : Kelola Modifier Menu
Modul            : ERP Backoffice (Katalog)
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Admin Pusat
```

### 1. Deskripsi
Mengonfigurasi kelompok opsi kustomisasi (*modifiers*) yang dapat dipilih pelanggan saat memesan, menentukan selisih penambahan harga (*price delta*), serta dampak penambahan/pengurangan bahan baku resep.

### 2. Prekondisi
- Item menu telah terdaftar.

### 3. Pemicu (Trigger)
- Penambahan opsi selera pelanggan (misal: susu oat, less sugar, extra espresso shot).

### 4. Alur Utama (Main Flow)
1. Admin membuka menu **Katalog > Kelola Modifier**.
2. Sistem menampilkan grup modifier yang ada (*Size, Sugar Level, Ice Level, Milk Alternative, Extra Add-ons*).
3. Admin menekan **+ Tambah Grup Modifier Baru** atau memilih grup yang sudah ada.
4. Admin mengonfigurasi opsi-opsi:
   - **Grup Ukuran Cup**:
     - *Regular (16oz)*: Tambah Harga Rp 0, Bahan Cup: Cup 16oz (1 pcs).
     - *Large (22oz)*: Tambah Harga +Rp 4.000, Bahan Cup: Cup 22oz (1 pcs), Susu +40 ml.
   - **Grup Milk Alternative**:
     - *Fresh Milk Standard*: Tambah Harga Rp 0.
     - *Oatmilk Substitute*: Tambah Harga +Rp 6.000, Penggantian Bahan: Potong Susu Oat 120 ml (bukan Fresh Milk).
   - **Grup Extra Shot**:
     - *Extra Espresso Shot*: Tambah Harga +Rp 5.000, Penambahan Bahan: Biji Kopi +9 gram.
5. Admin menautkan grup modifier tersebut ke kategori menu yang relevan (misal: grup *Milk Alternative* hanya berlaku untuk menu kopi susu).
6. Admin menekan tombol **Simpan Modifier**.
7. Sistem menyimpan relasi dan memancarkan event `ModifiersUpdated`.

### 5. Postkondisi
- Opsi modifier langsung muncul di formulir pemesanan POS Kasir dan App Pelanggan.

---

## UC-BO-10: Perhitungan & Analisis HPP Teoretis Menu

```
Use Case ID      : UC-BO-10
Nama Use Case    : Perhitungan & Analisis HPP Teoretis Menu
Modul            : ERP Backoffice (Katalog & Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Admin
```

### 1. Deskripsi
Menghitung estimasi modal bahan pokok (*teoretical Cost of Goods Sold / COGS*) per menu secara otomatis berdasarkan kombinasi resep dan harga pembelian terakhir dari setiap bahan penyusunnya, serta menyajikan kalkulasi margin laba kotor.

### 2. Prekondisi
- Resep menu telah terkonfigurasi lengkap.

### 3. Pemicu (Trigger)
- Perubahan harga bahan baku dari faktur baru atau evaluasi penentuan harga jual.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Katalog > Analisis HPP & Margin**.
2. Sistem menampilkan tabel seluruh menu:
   - Nama Menu & Kategori.
   - Harga Jual Dasar Walk-In.
   - Harga Jual Channel App (setelah markup %).
   - **Estimasi HPP Bahan Baku** (kalkulasi: $\sum (\text{takaran bahan}_i \times \text{harga beli terakhir}_i)$).
   - **Margin Nominal (Rp)** = Harga Jual - Estimasi HPP.
   - **Persentase Margin (%)** = $(\text{Margin Nominal} / \text{Harga Jual}) \times 100\%$.
   - Indikator Kesehatan Margin: Hijau ($\ge 65\%$), Kuning ($50\% - 64\%$), Merah ($< 50\%$).
3. Pengguna mengklik salah satu menu untuk melihat rincian biaya per komponen (misal: porsi kopi Rp 1.800, susu Rp 2.400, cup+tutup Rp 1.200, sirup Rp 600 $\rightarrow$ Total HPP Rp 6.000,-).
4. Pengguna dapat melakukan simulasi perubahan harga bahan (*what-if analysis*).

### 5. Postkondisi
- Manajemen memiliki angka acuan margin teoretis sebelum dibandingkan dengan HPP riil yang diverifikasi nota (UC-BO-17).

---

## UC-BO-11: Review & Persetujuan Menu Lokal Usulan Outlet

```
Use Case ID      : UC-BO-11
Nama Use Case    : Review & Persetujuan Menu Lokal Usulan Outlet
Modul            : ERP Backoffice (Katalog & Approval)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Admin Pusat
Aktor Pendukung  : Store Manager Pengusul
```

### 1. Deskripsi
Meninjau dan memutuskan usulan menu signature khusus outlet yang diajukan oleh Store Manager melalui aplikasi mobile cabang. Jika disetujui, menu tersebut otomatis aktif hanya pada outlet pengusul tanpa mempengaruhi cabang lain.

### 2. Prekondisi
- Store Manager telah mengajukan usulan menu lokal melalui App Operasi Outlet (UC-OPS-07).

### 3. Pemicu (Trigger)
- Event `LocalMenuProposed` diterima oleh sistem Backoffice.

### 4. Alur Utama (Main Flow)
1. Admin Pusat membuka menu **Persetujuan > Menu Lokal Outlet**.
2. Sistem menampilkan daftar pengajuan berstatus *Menunggu Persetujuan*:
   - Tanggal Pengajuan & Nama Outlet Pengusul (contoh: *Kopi Jodi - Sudirman*).
   - Nama Menu Lokal: (contoh: *Es Kopi Pandan Wangi*).
   - Usulan Harga Jual: Rp 25.000,-.
   - Komposisi Resep & Estimasi Margin.
   - Alasan Pengajuan.
3. Admin mengklik baris pengajuan untuk memeriksa detail takaran resep.
4. Admin menentukan keputusan: memilih tombol **Setujui (Approve)**.
5. Admin dapat menambahkan catatan apresiasi/petunjuk SOP (opsional).
6. Sistem memperbarui status pengajuan menjadi `Approved`.
7. Sistem mendaftarkan menu tersebut ke katalog produk dengan atribut `scope: outletId` (terikat ke ID outlet pengusul).
8. Sistem memancarkan event `LocalMenuApproved`.
9. POS Kasir dan App Pelanggan pada outlet pengusul secara real-time menampilkan menu lokal tersebut di daftar produk aktif.

### 5. Alur Alternatif (Admin Menolak Pengajuan)
- **4a. Menolak Menu Lokal**: Admin memilih tombol **Tolak (Reject)**.
- **5a. Mengisi Alasan**: Admin wajib mengisi kolom catatan penolakan (contoh: *"Bahan sirup pandan belum lolos uji standar halal & mutu pusat"*).
- **6a. Update Status**: Sistem mengubah status menjadi `Rejected` dan memancarkan event `LocalMenuRejected`. Menu tidak aktif di outlet manapun.

### 6. Postkondisi
- Menu lokal berstatus sah dan terisolasi khusus di cabang yang disetujui.

### 7. Aturan Bisnis Terkait
- **BR-09**: Menu lokal/resep khusus outlet diusulkan Store Manager dan disetujui Admin Pusat sebelum aktif.
