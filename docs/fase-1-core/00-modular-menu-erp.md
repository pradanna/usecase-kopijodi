# Struktur Modular ERP Backoffice Kopi Jodi

Dokumen ini memetakan pemisahan 3 modul utama pada ERP Backoffice Kopi Jodi:
1. **Warehouse (Gudang & Pengadaan Logistik)**
2. **Menu Racikan (Resep, Olahan & R&D)**
3. **Finance & Akuntansi (Keuangan Terintegrasi POS & Cashflow)**

---

## 1. Modul Warehouse & Pengadaan (Gudang & Logistik)

Modul ini berfokus pada manajemen persediaan fisik, pergerakan barang antar-fasilitas, dan pengadaan bahan baku ke supplier.

### Menu dan Sub-Menunya:
1. **Kartu Stok Multi-Warehouse (`stock_cards`)**
   - **Fungsi**: Memantau posisi lot fisik bahan baku per cabang secara *real-time*.
   - **Fitur Utama**:
     - Status lot persediaan: `awaiting_invoice` (stok bertambah dari surat jalan, harga sementara) vs `confirmed` (faktur resmi supplier telah diverifikasi).
     - Valuasi nilai persediaan per bahan dan per gudang.
     - Peringatan stok kritis (*minimum reorder level*).

2. **Master Bahan Baku & Kemasan (`raw_materials`)**
   - **Fungsi**: Database 25 SKU bahan mentah (biji kopi, susu, sirup, cup, sedotan, tote bag).
   - **Fitur Utama**:
     - Satuan Pembelian (UOM Beli: kg, karton, dus, jerigen) vs Satuan Penggunaan (UOM Pakai: gram, ml, pcs).
     - Rasio Konversi Otomatis (misal: 1 karton susu = 12.000 ml).
     - Harga Acuan Pembelian Terakhir (*Last Price*).
     - Pengaturan Izin Pembelian Lokal Cabang (BR-02 & BR-03): toggle boleh beli di pasar lokal via kas kecil jika gudang pusat kosong.

3. **Pengadaan & Purchase Order (PO) Cabang (`purchase_orders`)**
   - **Fungsi**: Manajemen permintaan restock dari outlet ke Gudang Pusat (Central DC).
   - **Fitur Utama**:
     - Penerbitan PO Tanpa Harga oleh Store Manager (BR-04) untuk mencegah manipulasi margin lokal.
     - Status PO: Menunggu Pengiriman, Dikirim Armada, Diterima Parsial, Diterima Lengkap.
     - Konfirmasi penerimaan surat jalan fisik yang memicu stok masuk berstatus `awaiting_invoice`.

4. **Mutasi & Transfer Antar-Gudang (`transfers`)**
   - **Fungsi**: Melacak pergerakan barang antar gudang pusat ke cabang maupun transfer darurat antar-cabang.
   - **Fitur Utama**:
     - Nomor Surat Jalan Pengiriman (DO / Delivery Order).
     - Identitas armada pengirim & kurir internal.
     - Log serah terima barang dan status pengiriman (Dalam Perjalanan vs Selesai Diterima).

5. **Stock Opname & Susut/Waste (`stock_opname`)**
   - **Fungsi**: Audit berkala antara stok fisik di lapangan vs stok sistem kalkulasi POS.
   - **Fitur Utama**:
     - Rekonsiliasi variance kuantitas (kelebihan / kekurangan stok).
     - Pencatatan penyebab susut (kalibrasi grinder espresso, tumpahan susu, cup retak/cacat pabrik, bahan kedaluwarsa).
     - Approval penyesuaian stok oleh Store Manager & Head Barista.

---

## 2. Modul Menu Racikan & Olahan (Resep, Prep & R&D)

Modul ini berfokus pada rekayasa produk, standardisasi resep (*Bill of Materials*), persiapan bahan olahan dapur, dan kustomisasi.

### Menu dan Sub-Menunya:
1. **Katalog Menu Jual (`menu_catalog`)**
   - **Fungsi**: Manajemen daftar minuman dan pastry yang siap dipesan oleh pelanggan.
   - **Fitur Utama**:
     - Kategori produk (Kopi Susu Signature, Manual Brew, Non-Coffee & Tea, Refreshment, Pastry & Toast).
     - Penetapan Harga Dasar Walk-In (Dine-in / Takeaway).
     - Kalkulasi Otomatis Markup Channel Online (+15% pada App Pelanggan sesuai BR-10).
     - Status ketersediaan menu (*In Stock* vs *Sold Out*).

2. **Resep & Takaran BOM (Bill of Materials) (`recipe_bom`)**
   - **Fungsi**: Formula takaran eksak per cup yang menjadi dasar pemotongan stok otomatis saat pesanan selesai di KDS (BR-12).
   - **Fitur Utama**:
     - Komposisi per cup: gramasi biji kopi/espresso shot, ml susu, pump sirup gula aren, cup, lid, dan straw.
     - Kalkulasi Otomatis HPP Teoretis per Porsi.
     - Estimasi Gross Margin % berdasarkan harga jual aktif.

3. **Bahan Racikan Olahan (Semi-Finished Prep) (`prepared_items`)**
   - **Fungsi**: Standardisasi racikan bahan setengah jadi yang dimasak/diseduh barista sebelum jam operasional buka.
   - **Fitur Utama**:
     - Resep Batch Dapur: Simple Syrup Gula Aren Alami, Cold Brew Concentrate 24 Jam, Grass Jelly Topping, Matcha Uji Base Solution.
     - Output Yield (Kuantitas hasil produksi batch: ml / gram).
     - Waktu persiapan dan Masa Simpan / *Shelf Life* (suhu chiller vs ruang).
     - HPP bahan olahan per ml/gram.

4. **Kustomisasi & Modifiers (`modifiers`)**
   - **Fungsi**: Pengaturan opsi varian dan kustomisasi rasa yang dapat dipilih pembeli di POS dan App Pelanggan.
   - **Fitur Utama**:
     - Ukuran Cup: Regular (12oz) vs Large (16oz).
     - Level Gula: Normal (100%), Less Sugar (50%), No Sugar (0%).
     - Pilihan Susu: Dairy Milk, Oatmilk (Oatside Barista), Almond Milk (+Rp 6.000).
     - Ekstra: Extra Shot Espresso (+Rp 5.000), Grass Jelly, Coffee Jelly, Vanilla Ice Cream.
     - Delta Pengurangan Stok: Setiap modifier terhubung dengan pemotongan bahan baku riil di BOM.

5. **Usulan Menu Lokal Cabang (`local_proposals`)**
   - **Fungsi**: Fasilitas bagi Store Manager outlet untuk mengusulkan kreasi menu berbasis preferensi lokal (BR-09).
   - **Fitur Utama**:
     - Form usulan: Nama minuman, target harga jual, estimasi HPP, proyeksi porsi harian, dan alasan pasar lokal.
     - Workflow Approval R&D Pusat: Review kelayakan rasa, keamanan pasokan bahan, hingga disetujui (*Approved*) menjadi menu resmi cabang.

---

## 3. Modul Finance & Akuntansi (Keuangan Terintegrasi)

Modul ini adalah pusat kendali keuangan Kopi Jodi yang langsung terhubung secara *real-time* dengan mesin kasir POS, kas kecil cabang, verifikasi faktur supplier, dan rekening bank penampung.

### Menu dan Sub-Menunya:
1. **Laporan Arus Kas (Cash Flow Statement) (`cashflow`)**
   - **Fungsi**: Memantau likuiditas kas masuk dan keluar secara terperinci.
   - **Komponen Utama**:
     - **Arus Kas Masuk (Inflow)**:
       - Penerimaan Penjualan Kasir Tunai (Cash di Laci).
       - Penerimaan Penjualan Digital QRIS Midtrans Gateway.
       - Pelunasan Piutang / Refund Supplier.
     - **Arus Kas Keluar (Outflow)**:
       - Pembayaran Faktur Pembelian Bahan Baku Pusat.
       - Pengeluaran Kas Kecil Cabang yang Disetujui (Petty Cash Operasional).
       - Beban Overhead Pusat (Sewa, Utilitas, Lisensi ERP & Cloud Server).
     - **Arus Kas Bersih (Net Cash Flow)**: Selisih surplus/defisit operasional.
     - **Posisi Saldo Kas Akhir**: Saldo kas awal + Net Cash Flow.

2. **Buku Jurnal Umum Real-Time (General Ledger Double-Entry) (`journal_feed`)**
   - **Fungsi**: Pembukuan akuntansi otomatis sistemik (*event-driven*) tanpa re-entry manual setiap ada transaksi di kasir POS, belanja cabang, atau faktur supplier.
   - **Bagan Akun (Chart of Accounts / COA)**:
     - `1101` - Kas di Tangan Kasir (Cash on Hand)
     - `1102` - Piutang QRIS Settlement (Midtrans Gateway)
     - `1103` - Kas di Bank Operasional Pusat (Bank BCA / Mandiri)
     - `1104` - Kas Kecil Operasional Cabang (Petty Cash Float)
     - `1301` - Persediaan Bahan Baku & Kemasan
     - `2101` - Hutang Dagang Supplier (Accounts Payable)
     - `4101` - Pendapatan Penjualan Minuman & Makanan (Revenue)
     - `5101` - Beban Pokok Penjualan (HPP / Cost of Goods Sold)
     - `6101` - Beban Operasional Kas Kecil Cabang

3. **Rekonsiliasi Kasir & Kas Laci POS (`cashier_recon`)**
   - **Fungsi**: Audit penutupan shift kasir (*closing shift*) dan rekonsiliasi fisik uang tunai.
   - **Fitur Utama**:
     - **Modal Awal (Float Kasir)**: Uang kembalian yang disiapkan di awal shift.
     - **Penjualan Tunai POS**: Akumulasi uang masuk dari order tunai sistem POS.
     - **Kas Sistem di Laci**: Modal Awal + Penjualan Tunai.
     - **Hitungan Fisik Kasir**: Jumlah lembaran & koin yang dihitung kasir saat tutup shift.
     - **Deteksi Selisih (Cash Variance)**: Indikasi otomatis jika Kas Fisik $\ne$ Kas Sistem (Selisih Lebih / Selisih Kurang).
     - **Verifikasi Setoran Bank**: Input nomor slip transfer/setoran tunai ke rekening bank perusahaan dan validasi oleh tim Finance.

4. **Hutang Cabang & Input Nota / True-Up HPP (`debt_trueup`)**
   - **Fungsi**: Verifikasi faktur riil supplier untuk bahan yang sudah diterima outlet dan rekalkulasi otomatis HPP (*True-Up HPP*).
   - **Fitur Utama**:
     - Daftar penerimaan barang yang berstatus `Menunggu Nota`.
     - Input faktur resmi: Nomor Invoice supplier, tanggal jatuh tempo, dan harga satuan riil.
     - **Eksekusi True-Up HPP (BR-06)**: Menggantikan harga estimasi dengan harga riil, mengoreksi nilai persediaan, dan menghitung ulang HPP minuman yang sudah terlanjur terjual secara retrospektif.
     - **Buku Pembantu Hutang & Payables Aging**: Pemantauan hutang cabang ke gudang pusat dengan pengelompokan umur hutang (Lancar 0-30 hari, Jatuh Tempo 31-60 hari, Kritis >60 hari).

5. **Laporan Laba Rugi Operasional (P&L Statement) (`profit_loss`)**
   - **Fungsi**: Evaluasi kinerja profitabilitas per cabang dan konsolidasi seluruh outlet.
   - **Komponen Utama**:
     - **Pendapatan Bersih (Net Sales)**: Total omzet penjualan POS dan App Pelanggan.
     - **Beban Pokok Penjualan (Definitive COGS)**: HPP bahan baku yang telah dikoreksi *True-Up*.
     - **Laba Kotor (Gross Profit)** & Margin %.
     - **Beban Operasional Toko (OPEX)**: Kas kecil cabang yang disetujui (es batu lokal, galon, kebersihan).
     - **Beban Overhead Pusat**: Alokasi biaya manajemen pusat.
     - **Laba Operasional Bersih (Net Operating Profit / EBITDA)** & EBITDA Margin %.
