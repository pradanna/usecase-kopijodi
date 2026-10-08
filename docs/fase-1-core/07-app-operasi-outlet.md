# Modul App Operasi Outlet (Store Manager Mobile)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk aplikasi **App Operasi Outlet** (Fase 1 Core) yang digunakan oleh Store Manager pada smartphone Android/iOS dalam mengelola operasional harian gerai kopi.

---

## UC-OPS-01: Pantau Ringkasan Operasional Harian Outlet

```
Use Case ID      : UC-OPS-01
Nama Use Case    : Pantau Ringkasan Operasional Harian Outlet
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
```

### 1. Deskripsi
Menyajikan dasbor beranda mobile yang merangkum kesehatan operasional gerai pada hari berjalan: total omzet harian, jumlah transaksi, barang yang berada pada level stok kritis, dan status tugas persetujuan yang menunggu tindakan.

### 2. Prekondisi
- Store Manager telah login ke aplikasi mobile operasi outlet.

### 3. Pemicu (Trigger)
- Store Manager membuka aplikasi untuk memantau performa toko.

### 4. Alur Utama (Main Flow)
1. Store Manager membuka tab **Beranda**.
2. Sistem menyajikan kartu-kartu ringkasan operasional:
   - **Omzet Hari Ini (Rp)**: Akumulasi penjualan kotor transaksi kasir & online hari berjalan.
   - **Jumlah Pesanan**: Total cup/transaksi terjual.
   - **Kartu Peringatan Stok Kritis**: Jumlah bahan baku yang berada di bawah batas minimum (*Low Stock*).
   - **Tugas Menunggu Tindakan (Pending Tasks)**:
     - Barang masuk yang perlu dikonfirmasi penerimaannya (Goods Receipt).
     - Pengajuan kas kecil yang menunggu verifikasi pusat.
3. Store Manager mengetuk salah satu kartu (misal: kartu *Stok Kritis*) untuk langsung dialihkan ke layar tindakan terkait (UC-OPS-02).

### 5. Postkondisi
- Store Manager memiliki gambaran instan kondisi gerai dalam satu genggaman.

---

## UC-OPS-02: Cek Stok Bahan Outlet & Notifikasi Low Stock Alert

```
Use Case ID      : UC-OPS-02
Nama Use Case    : Cek Stok Bahan Outlet & Notifikasi Low Stock Alert
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Sistem KDS
```

### 1. Deskripsi
Menampilkan daftar ketersediaan fisik bahan baku outlet secara real-time dan menerima notifikasi peringatan (*push notification simulasi*) saat stok bahan menipis akibat penjualan di KDS.

### 2. Prekondisi
- Aplikasi berjalan di perangkat mobile Store Manager.

### 3. Pemicu (Trigger)
- Pengurangan stok di KDS menyebabkan saldo bahan baku melewati batas minimum pengaman (`LowStockAlert`).

### 4. Alur Utama (Main Flow)
1. Terjadi event `LowStockAlert` dari sistem (contoh: *Susu Fresh Milk tersisa 3.500 ml di mana batas minimum adalah 5.000 ml*).
2. Sistem App Operasi membunyikan notifikasi dan memunculkan banner peringatan di bagian atas layar: *"Perhatian: Stok Susu Fresh Milk menipis! Segera ajukan PO pengisian ulang"*.
3. Store Manager membuka tab **Stok**.
4. Sistem menyajikan daftar bahan baku diurutkan berdasarkan tingkat urgensi (bahan paling kritis berada di urutan teratas):
   - Nama Bahan & Kategori.
   - Saldo On-Hand Saat Ini (3.500 ml).
   - Batas Minimum (5.000 ml).
   - Badge status: **Menipis (Low Stock)** berwarna kuning.
5. Pada baris bahan yang menipis terdapat tombol aksi cepat: **+ Buat PO Pengisian Ulang**.
6. Store Manager mengetuk tombol tersebut untuk langsung diarahkan ke form pembuatan PO dengan bahan tersebut sudah otomatis terpilih (UC-OPS-03).

### 5. Postkondisi
- Resiko kekosongan stok (*out-of-stock*) dapat diantisipasi sebelum jam sibuk operasional.

### 7. Aturan Bisnis Terkait
- **BR-08**: Pemotongan stok otomatis memicu alert jika saldo melewati ambang batas minimum.

---

## UC-OPS-03: Penerbitan Purchase Order (PO) Bahan ke Pusat (Tanpa Kolom Harga)

```
Use Case ID      : UC-OPS-03
Nama Use Case    : Penerbitan Purchase Order (PO) Bahan ke Pusat (Tanpa Kolom Harga)
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Admin Gudang Pusat
```

### 1. Deskripsi
Mengajukan permohonan pasokan bahan baku dari gerai ke gudang logistik pusat. Formulir pengajuan PO ini secara sengaja dirancang **hanya memuat nama barang dan kuantitas permintaan tanpa ada kolom harga rupiah**, menghilangkan beban estimasi finansial di tingkat manajer gerai.

### 2. Prekondisi
- Store Manager login di aplikasi mobile operasi cabang.

### 3. Pemicu (Trigger)
- Kebutuhan pasokan rutin atau tindak lanjut dari alert stok menipis.

### 4. Alur Utama (Main Flow)
1. Store Manager membuka tab **Pengadaan > Ajukan PO ke Pusat**.
2. Sistem menyajikan daftar bahan baku yang terdaftar di warehouse pusat. Bahan yang stoknya sedang menipis otomatis berada di bagian atas daftar dengan kuantitas usulan order terisi otomatis (*recommended reorder qty*).
3. Store Manager memilih item dan memasukkan kuantitas yang dibutuhkan:
   - *Susu Fresh Milk*: 50 Liter.
   - *Biji Kopi House Blend*: 10 Kilogram.
   - *Cup Plastik 16oz*: 500 pcs.
4. Antarmuka layar formulir **secara tegas tidak menampilkan input harga satuan, subtotal, maupun total rupiah** (sesuai BR-04).
5. Store Manager menambahkan catatan tanggal ekspektasi kedatangan (contoh: *"Mohon kirim sebelum shift pagi besok"*).
6. Store Manager menekan tombol **Kirim PO ke Gudang Pusat**.
7. Sistem memvalidasi kelengkapan data (minimal 1 item dengan kuantitas > 0).
8. Sistem menerbitkan Nomor PO unik (contoh: `PO-SDR-202610-01`) dengan status `Requested`.
9. Sistem memancarkan event `PORequested`.
10. Dokumen PO langsung masuk ke antrean pengiriman logistik Backoffice Pusat (UC-BO-14).

### 5. Postkondisi
- Permintaan pasokan tercatat resmi dan rapi tanpa ada bias estimasi harga di outlet.

### 7. Aturan Bisnis Terkait
- **BR-04**: PO ke supplier/pusat berisi barang dan kuantitas saja, **tanpa harga**.

---

## UC-OPS-04: Penerimaan Barang Fisik (Goods Receipt) & Status Menunggu Nota

```
Use Case ID      : UC-OPS-04
Nama Use Case    : Penerimaan Barang Fisik & Status Menunggu Nota
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Gudang Pusat, Finance
```

### 1. Deskripsi
Menerima barang fisik yang diantar logistik, memeriksa kesesuaian kuantitas fisik, mengunggah foto surat jalan/barang, dan mengonfirmasi penerimaan. Aksi ini seketika menaikkan saldo stok outlet dengan status khusus **"Menunggu Nota"** dan menggunakan HPP sementara dari harga pembelian terakhir.

### 2. Prekondisi
- Barang fisik tiba di outlet dan status PO adalah *Dalam Pengiriman* (`POSentToCentral`).

### 3. Pemicu (Trigger)
- Mobil kurir/logistik menurunkan barang pasokan di gerai.

### 4. Alur Utama (Main Flow)
1. Store Manager membuka menu **Penerimaan Barang (Goods Receipt)** di App Operasi.
2. Sistem menyajikan daftar PO yang sedang dalam perjalanan menuju outlet ini.
3. Store Manager memilih nomor PO terkait.
4. Sistem menampilkan daftar barang yang dikirim dari pusat.
5. Store Manager menghitung fisik barang yang diturunkan dan memasukkan **Kuantitas Aktual Diterima**:
   - Susu Fresh Milk: Dipesan 50 L, Diterima 50 L (Lengkap).
   - Biji Kopi: Dipesan 10 Kg, Diterima 10 Kg (Lengkap).
   - Cup Plastik: Dipesan 500 pcs, Diterima 500 pcs (Lengkap).
6. Store Manager mengambil foto fisik surat jalan atau tumpukan barang menggunakan kamera smartphone.
7. Store Manager menekan tombol **Konfirmasi Terima Barang**.
8. Sistem mengeksekusi logika penerimaan barang (Domain Engine):
   - Saldo fisik stok outlet langsung dinaikkan sesuai kuantitas aktual diterima (stok susu bertambah 50 Liter).
   - Lot persediaan tersebut diberi status **"Menunggu Nota (awaiting_invoice)"**.
   - Sistem mencatat nilai HPP sementara untuk lot tersebut menggunakan **harga beli terakhir (last price)** dari master bahan (BR-05).
   - Status PO diperbarui menjadi `GoodsReceived / Awaiting Invoice`.
9. Sistem memancarkan event `GoodsReceived`.
10. Di ERP Backoffice Finance, transaksi penerimaan ini langsung muncul di daftar antrean verifikasi faktur resmi (UC-BO-17).

### 5. Alur Alternatif (Penerimaan Sebagian / Partial Receive)
- **5a. Terjadi Selisih / Kerusakan Barang**: Jika susu yang pecah di jalan ada 5 Liter, Store Manager menginput kuantitas diterima: 45 Liter, dan mengisi catatan: *"5 Liter bocor di kardus pengiriman"*.
- **8a. Penyesuaian**: Sistem hanya menaikkan stok fisik sebesar 45 Liter dan mencatat selisih 5 Liter pada laporan pengiriman.

### 6. Postkondisi
- Bahan baku siap digunakan untuk berjualan di POS dan KDS, HPP sementara aktif, dan tugas verifikasi faktur diteruskan ke Finance.

### 7. Aturan Bisnis Terkait
- **BR-05**: Penerimaan barang menaikkan stok dengan status "menunggu nota" dan HPP sementara memakai harga terakhir.

---

## UC-OPS-05: Pengajuan Belanja Kas Kecil Bertingkat dengan Bukti Struk

```
Use Case ID      : UC-OPS-05
Nama Use Case    : Pengajuan Belanja Kas Kecil Bertingkat dengan Bukti Struk
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Finance Pusat, Owner
```

### 1. Deskripsi
Mencatat pengeluaran darurat operasional outlet dari uang kas kecil (*petty cash*) dengan melampirkan foto struk fisik pembelian. Sistem menerapkan mesin aturan approval otomatis: nominal di bawah ambang batas langsung disetujui, sedangkan di atas batas otomatis masuk antrean persetujuan Finance/Pimpinan.

### 2. Prekondisi
- Store Manager login di aplikasi operasi outlet. Kas kecil fisik tersedia di gerai.

### 3. Pemicu (Trigger)
- Kebutuhan belanja mendesak outlet (misal: galon air habis, sabun cuci, es batu darurat).

### 4. Alur Utama (Main Flow - Di Bawah Batas Bebas Approval)
1. Store Manager membuka menu **Kas Kecil > Catat Pengeluaran**.
2. Store Manager menginput:
   - **Nominal Pengeluaran**: Rp 85.000,- (plafon bebas approval outlet: Rp 150.000,-).
   - **Kategori Biaya**: Dropdown (*Operasional Gerai / Kebersihan*).
   - **Keterangan Keperluan**: *"Beli 3 galon air mineral darurat & plastik sampah"*.
   - **Lampiran Foto**: Mengambil foto struk belanjaan dari minimarket lokal.
3. Sistem memvalidasi aturan ambang batas (`BR-12`): nominal Rp 85.000,- $\le$ Rp 150.000,- (Bebas Approval).
4. Store Manager menekan tombol **Simpan Pengeluaran**.
5. Sistem langsung menyetujui transaksi (`Status: Approved`), mengurangi saldo kas kecil gerai, dan membukukannya ke pos beban outlet.
6. Sistem memancarkan event `PettyCashSubmitted`.
7. Layar menampilkan bukti tanda terima digital pengeluaran kas kecil yang sah.

### 5. Alur Alternatif (Di Atas Batas Bebas - Butuh Approval)
- **2a. Nominal Melampaui Batas Bebas**: Store Manager menginput nominal Rp 450.000,- untuk penggantian selang gas dan servis regulator darurat.
- **3a. Deteksi Approval**: Sistem mendeteksi nominal > Rp 150.000,- dan menampilkan label kuning: *"Memerlukan Persetujuan Finance Pusat"*.
- **4a. Kirim Pengajuan**: Store Manager menekan **Ajukan Persetujuan**. Status tercatat `Awaiting Approval`. Saldo kas kecil belum terpotong final.
- **5a. Event Dipancarkan**: Sistem memancarkan event `PettyCashSubmitted` dengan status pending. Transaksi muncul di layar persetujuan Backoffice Finance (UC-BO-20).

### 6. Postkondisi
- Seluruh arus keluar kas kecil terdokumentasi dengan bukti foto struk fisik dan terkendali secara berjenjang.

### 7. Aturan Bisnis Terkait
- **BR-12**: Belanja kebutuhan kecil outlet memiliki batas nominal (per hari/per transaksi). Di atas batas wajib persetujuan Finance atau pimpinan.

---

## UC-OPS-06: Pengajuan Pembelian Bahan Baku Darurat ke Luar Pusat

```
Use Case ID      : UC-OPS-06
Nama Use Case    : Pengajuan Pembelian Bahan Baku Darurat ke Luar Pusat
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Store Manager
Aktor Pendukung  : Owner / Pimpinan
```

### 1. Deskripsi
Mengajukan permohonan izin darurat ke pimpinan pusat untuk membeli bahan baku kopi/susu ke toko/supplier lokal non-pusat apabila stok gerai habis total dan pengiriman logistik pusat mengalami hambatan.

### 2. Prekondisi
- Stok bahan baku di gerai mendekati 0 dan pengiriman gudang pusat belum tiba.

### 3. Pemicu (Trigger)
- Resiko gerai terpaksa tutup (*closed store*) karena kehabisan bahan utama di jam operasional.

### 4. Alur Utama (Main Flow)
1. Store Manager membuka menu **Pengadaan > Izin Pembelian Luar Pusat**.
2. Store Manager mengisi formulir permohonan:
   - **Nama Toko / Supplier Lokal**: (contoh: *Superindo Cabang Terdekat*).
   - **Bahan Baku yang Hendak Dibeli**: *Susu Fresh Milk Diamond - 20 Liter*.
   - **Estimasi Nominal Biaya**: Rp 400.000,-.
   - **Alasan Darurat**: *"Stok susu habis di jam makan siang, pasokan pusat tertahan demo jalanan"*.
3. Store Manager menekan tombol **Kirim Permohonan ke Pimpinan**.
4. Sistem menandai status permohonan sebagai `Pending Approval Pimpinan`.
5. Sistem memancarkan event `ExternalPurchaseRequested`.
6. Permohonan masuk ke layar persetujuan eksekutif Owner Dashboard (UC-BO-15 / UC-OWN-03).
7. Store Manager menunggu notifikasi keputusan pimpinan sebelum diperbolehkan membeli barang fisik.

### 5. Postkondisi
- Permohonan darurat tercatat secara resmi dan kepatuhan SOP rantai pasok pusat tetap terjaga.

### 7. Aturan Bisnis Terkait
- **BR-03**: Outlet berbelanja bahan lewat warehouse pusat; pembelian luar pusat **wajib persetujuan pimpinan**.

---

## UC-OPS-07: Pengajuan Usulan Menu / Resep Lokal Khusus Outlet

```
Use Case ID      : UC-OPS-07
Nama Use Case    : Pengajuan Usulan Menu / Resep Lokal Khusus Outlet
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Store Manager
Aktor Pendukung  : Admin Pusat
```

### 1. Deskripsi
Mengajukan usulan menu minuman unik khas kearifan lokal gerai kepada Admin Pusat lengkap dengan usulan komposisi takaran resep dan harga jual.

### 2. Prekondisi
- Store Manager login di aplikasi operasi outlet.

### 3. Pemicu (Trigger)
- Ada tren selera pelanggan lokal atau ketersediaan bahan khas di wilayah sekitar cabang.

### 4. Alur Utama (Main Flow)
1. Store Manager membuka menu **Katalog Gerai > Usulan Menu Lokal**.
2. Store Manager menekan tombol **+ Buat Usulan Menu Baru**.
3. Store Manager mengisi formulir:
   - **Nama Menu Usulan**: (contoh: *Es Kopi Pandan Wangi*).
   - **Usulan Kategori**: *Signature Local*.
   - **Usulan Harga Jual Dasar**: Rp 25.000,-.
   - **Komposisi Resep Takaran**:
     - *Espresso*: 18 gram.
     - *Fresh Milk*: 100 ml.
     - *Sirup Pandan Asli*: 20 ml.
     - *Cup & Sedotan*: 1 set.
   - **Alasan Pengajuan & Analisis Pasar**: *"Banyak permintaan pegawai perkantoran sekitar untuk rasa pandan lokal"*.
4. Store Manager menekan tombol **Kirim Usulan ke Pusat**.
5. Sistem menyimpan draf menu dengan status `Proposed` (Menunggu Review Pusat).
6. Sistem memancarkan event `LocalMenuProposed`.
7. Usulan diteruskan ke antrean review Admin Pusat di Backoffice (UC-BO-11). Menu **belum aktif** di POS Kasir maupun App Pelanggan.

### 5. Postkondisi
- Inovasi menu cabang tersalurkan melalui tata kelola terpusat yang rapi.

### 7. Aturan Bisnis Terkait
- **BR-09**: Menu lokal/resep khusus outlet diusulkan Store Manager dan disetujui Admin Pusat sebelum aktif.

---

## UC-OPS-08: Pencatatan Produksi Bahan Olahan Internal Outlet (Batching)

```
Use Case ID      : UC-OPS-08
Nama Use Case    : Pencatatan Produksi Bahan Olahan Internal Outlet
Modul            : App Operasi Outlet
Fase             : Fase 1 (Core)
Prioritas        : P1
Aktor Utama      : Store Manager / Barista Senior
```

### 1. Deskripsi
Mencatat proses konversi bahan baku mentah menjadi bahan setengah jadi (*semi-finished goods / bahan olahan*, seperti pembuatan 1 batch sirup gula aren atau 5 liter cold brew concentrate) yang dilakukan di dapur gerai, sehingga stok bahan baku berkurang dan stok bahan olahan bertambah secara otomatis.

### 2. Prekondisi
- Formula bahan olahan telah dikonfigurasi di Backoffice (UC-BO-08).

### 3. Pemicu (Trigger)
- Barista/Manager selesai memasak racikan sirup atau menyeduh cold brew untuk stok beberapa hari ke depan.

### 4. Alur Utama (Main Flow)
1. Store Manager membuka menu **Inventory > Produksi Bahan Olahan (Batching)**.
2. Store Manager memilih formula olahan yang hendak diproduksi (contoh: *Sirup Gula Aren Racikan - Batch 1.000 ml*).
3. Sistem menampilkan kebutuhan bahan baku teoretis per batch:
   - Membutuhkan: *Gula Aren Padat* (800 gram) + *Air Galon* (400 ml).
4. Store Manager menginput jumlah batch yang diproduksi (contoh: *2 Batch* $\rightarrow$ Hasil: 2.000 ml Sirup Gula Aren).
5. Store Manager menekan tombol **Konfirmasi Selesai Produksi**.
6. Sistem mengeksekusi mutasi stok otomatis (Domain Engine):
   - Mengurangi stok bahan baku mentah: Gula Aren Padat berkurang 1.600 gram; Air Galon berkurang 800 ml.
   - Menambah stok bahan olahan: Sirup Gula Aren bertambah 2.000 ml.
7. Sistem memancarkan event `StockAdjusted` (tipe produksi olahan).
8. Kartu stok kedua jenis bahan terupdate seketika.

### 5. Postkondisi
- Saldo bahan olahan bertambah dan bahan mentah terpotong akurat tanpa selisih opname.

### 7. Aturan Bisnis Terkait
- **BR-08**: Bahan olahan (syrup, cold brew) dapat dibuat di outlet sehingga menjadi bahan setengah jadi dengan resepnya sendiri.
