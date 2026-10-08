# Catatan Perancangan ERP Kopi (Internal)

Status: M0 final, M1 selesai, M2 dihentikan sementara. Target akhir: PRD.
Dokumen ini catatan kerja internal, bukan untuk klien.

---

## Milestone

| # | Milestone | Status |
|---|---|---|
| M0 | Fondasi dan scope | Final |
| M1 | Model bisnis dan aturan bisnis | Selesai (sebagian sengaja ditunda) |
| M2 | Inventory outlet, pembelian, hutang | Berjalan, dihentikan sementara |
| M3 | Menu, resep, modifier, HPP | Belum |
| M4 | Penjualan: POS, KDS, app pelanggan | Belum |
| M5 | Keuangan dan mitra (settlement, portal mitra) | Belum |
| M6 | Arsitektur dan non-fungsional | Belum |
| M7 | Menyusun PRD | Belum |

---

## M0: Fondasi dan scope (final)

**Tujuan:** platform operasional terpadu untuk jaringan kedai kopi (target seperti Fore): operasional outlet, penjualan (kasir dan online), inventory dan pembelian, keuangan dan kemitraan.

**Peran pengguna**
- Owner / superadmin
- Admin pusat
- Finance (akuntansi, hutang dan pembayaran, settlement mitra, perpajakan; hanya ada di pusat)
- Store manager
- Kasir
- Barista
- Mitra / investor (hanya-baca)
- Pelanggan

**Aplikasi**
- Inti: backoffice, POS, app pelanggan
- Pendukung: layar barista (KDS), app operasional outlet, portal mitra
- Nanti: dashboard owner, panel marketing/CRM, web ordering
- Terpisah: aplikasi HR untuk payroll (hanya dicatat, belum dibahas)

**Prinsip dan batasan**
- Satu produk utuh (bukan modular), fitur bisa dimatikan
- 1 brand dulu, satu instalasi per brand (single-tenant); rencana dijual ulang ke brand lain
- Aturan khas klien dibuat sebagai konfigurasi/fitur yang bisa dimatikan
- Pajak berupa konfigurasi, bukan angka di kode
- Berdiri sendiri dari aplikasi warehouse pusat (tanpa integrasi API)
- Tiap outlet punya warehouse (tempat stok) sendiri
- Di luar scope: WMS pusat dan integrasi ke sana

---

## M1: Keputusan model bisnis

1. **Kepemilikan outlet:** milik sendiri atau milik mitra/investor. Relasi outlet dan investor dengan persentase boleh kosong dan punya tanggal berlaku.
2. **Biaya pusat** (gaji, sewa, dll): dicatat Finance di pusat, diberi tag outlet atau tag pusat.
3. **Biaya outlet** (belanja kebutuhan kecil): lewat kas kecil, diinput store manager, diverifikasi Finance.
4. **Kas kecil bertingkat:**
   - Di bawah batas bebas: tanpa persetujuan
   - Melewati batas (per transaksi atau per hari): persetujuan pusat (Finance atau pimpinan)
   - Nominal sangat besar: pimpinan
   - Nilai batas dan penyetuju disimpan sebagai konfigurasi (mesin aturan persetujuan generik)
5. **Promo dan voucher:** fleksibel, global atau per outlet; mencatat "ditanggung oleh".
6. **Pembayaran:** Midtrans (QRIS dll).
7. **Pajak:** PPN dan PPh. Tahap 1 mencatat pajak per transaksi; tahap 2 rekap; pelaporan ke DJP ditunda. Perlakuan PBJT atas penjualan makanan dan minuman perlu dikonfirmasi konsultan pajak klien.
8. **Belanja bahan di luar pusat:** butuh persetujuan pimpinan.
9. **Prioritas sistem:** mencatat semua HPP dan biaya per outlet.

**Sengaja ditunda:** skema bagi hasil mitra dan payout, alokasi biaya pusat ke outlet, jadwal settlement Midtrans, dan penggajian (aplikasi HR terpisah).

---

## M2: Progres (inventory outlet, pembelian, hutang)

**Sudah diputuskan**
- Master bahan dimiliki ERP sendiri (satuan beli dan pakai dengan konversi, kode dan harga referensi pusat opsional, penanda boleh dibeli dari luar)
- Purchasing tetap ada: gudang pusat sebagai pemasok bertanda khusus, plus vendor/toko lain
- PO tanpa harga (hanya bahan dan jumlah)
- Penerimaan menaikkan stok dengan status "menunggu nota"; HPP sementara dari harga terakhir, dikoreksi saat nota diinput
- Pembayaran ke pusat dicatat di admin ERP (tanpa keterkaitan dengan aplikasi pusat); syarat bayar bisa periodik atau fleksibel
- Tagihan dan pembayaran dipisah, dihubungkan lewat alokasi; ada saldo hutang per outlet
- Saran: store manager mengisi harga dari nota, Finance memverifikasi (peringatan jika harga menyimpang)

**Alur draf pembelian bahan**
1. PO/permintaan (tanpa harga). Belanja luar menunggu persetujuan pimpinan.
2. Penerimaan (jumlah, referensi DO/nota, selisih). Status: menunggu nota.
3. Input nota (harga, foto, nomor nota). Status: menunggu verifikasi.
4. Verifikasi Finance, tagihan terbentuk, HPP dikoreksi (true-up).
5. Pembayaran dicatat Finance dan dialokasikan ke tagihan.

**Jalur terpisah:** kas kecil (top-up, pengeluaran bertingkat, verifikasi, hitung kas fisik).

**Keputusan M2 yang masih terbuka**
1. Penerimaan sebagian: boleh atau harus penuh? (cenderung boleh)
2. Batch dan kedaluwarsa (FEFO): dilacak atau cukup stok total?
3. Stock opname: jadwal dan siapa menyetujui koreksi
4. Retur ke pusat atau pemasok
5. Transfer antar outlet: dipakai atau tidak
6. Stok minimum dan saran order (par level): masuk MVP atau ditunda

---

## Pertanyaan terbuka lintas milestone

- Flutter atau PWA untuk POS dan app pelanggan (M4/M6)
- Midtrans: satu merchant untuk semua outlet atau per outlet
- Aturan penumpukan promo (stacking)
- Skema kerja sama mitra: bagi hasil laba, royalti omzet, atau campuran; sama untuk semua mitra atau berbeda per mitra
- Siapa "pimpinan" persisnya (diasumsikan Owner/superadmin)

## Hal di luar teknis

- Pastikan di kontrak bahwa hak atas kode atau lisensi untuk menjual ulang ada di pengembang.
- Konfirmasi perlakuan pajak (PPN, PPh, PBJT) dengan konsultan pajak klien sebelum PRD dikunci.
