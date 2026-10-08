# Modul ERP Backoffice: Keuangan (Finance Modul)

Dokumen ini mendefinisikan spesifikasi detail seluruh use case untuk modul **Finance Backoffice, Input Nota & True-Up HPP, Manajemen Hutang Pusat, Approval Kas Kecil, dan Rekap Laporan Margin Cabang** pada ERP Backoffice (Fase 1 Core).

---

## UC-BO-17: Input Nota Pembelian & Koreksi HPP Otomatis (True-Up HPP)

```
Use Case ID      : UC-BO-17
Nama Use Case    : Input Nota Pembelian & Koreksi HPP Otomatis (True-Up HPP)
Modul            : ERP Backoffice (Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Store Manager, Owner
```

### 1. Deskripsi
Mencatat faktur tagihan / nota resmi dari supplier/gudang pusat dengan memasukkan harga beli aktual, memicu rekalkulasi otomatis (*true-up*) atas nilai HPP persediaan yang tersisa maupun pesanan yang telah terjual, serta membukukan penambahan saldo hutang outlet.

### 2. Prekondisi
- Barang fisik telah diterima oleh outlet (UC-OPS-04) dengan status lot `awaiting_invoice` dan foto surat jalan/nota fisik telah diunggah.

### 3. Pemicu (Trigger)
- Faktur pembelian fisik/digital tiba di meja kerja Finance Pusat.

### 4. Alur Utama (Main Flow)
1. Finance membuka menu **Keuangan > Verifikasi Faktur Pembelian**.
2. Sistem menampilkan daftar penerimaan barang yang berstatus **"Menunggu Nota"** (badge warna kuning).
3. Finance memilih salah satu transaksi penerimaan untuk membuka formulir verifikasi nota.
4. Sistem menampilkan:
   - Data kuantitas fisik yang telah dikonfirmasi diterima oleh outlet.
   - Panel pratinjau lampiran foto dokumen fisik dari outlet.
   - Harga sementara yang saat ini dipakai (harga beli terakhir).
5. Finance menginput informasi faktur resmi:
   - **Nomor Faktur Resmi / Invoice ID**: Teks (contoh: *INV-PST-2026-1089*).
   - **Tanggal Jatuh Tempo Pembayaran**.
   - **Harga Beli Satuan Definitif** untuk setiap item barang (contoh: harga susu naik dari estimasi Rp 18.000 menjadi Rp 19.500 per liter; biji kopi tetap Rp 120.000/kg).
   - **Biaya Tambahan / Ongkos Kirim / Diskon Nota** (jika ada).
6. Sistem secara dinamis menghitung total nilai faktur riil dan menyajikan **Tabel Analisis Selisih (Variance Analysis)**:
   - Total Nilai Sementara: Rp 2.100.000,-
   - Total Nilai Riil Faktur: Rp 2.175.000,-
   - Selisih (+): Rp 75.000,-
7. Finance menekan tombol **Konfirmasi & Koreksi HPP (True-Up HPP)**.
8. Sistem mengeksekusi algoritma *True-Up HPP* pada domain engine:
   - Mengubah status lot persediaan terkait dari `awaiting_invoice` menjadi `confirmed` (definitif).
   - Memperbarui nilai aset stok yang masih tersimpan di outlet berdasarkan harga riil.
   - Menghitung ulang nilai HPP atas minuman yang sudah terlanjur terjual selama jeda waktu tunggu nota, sehingga laporan margin laba rugi outlet terkoreksi akurat tanpa ada selisih yang tertinggal.
   - Memperbarui harga pembelian terakhir (*last price*) pada master bahan untuk acuan estimasi PO berikutnya.
   - Menambahkan total nominal faktur ke dalam buku hutang dagang outlet bersangkutan ke pusat.
9. Sistem memancarkan event `InvoiceEntered` dan `HppRecalculated`.
10. Dashboard Owner dan Portal Mitra secara instan menerima notifikasi event dan memperbarui grafik omzet, HPP, serta laba kotor.

### 5. Alur Alternatif & Eksepsi
- **5a. Selisih Harga Melampaui Toleransi (> 20%)**: Jika harga faktur menyimpang lebih dari 20% dibandingkan harga referensi, sistem memunculkan kotak dialog konfirmasi ekstra: *"Harga susu mengalami deviasi 25% lebih tinggi dari harga acuan. Lanjutkan koreksi?"* untuk mencegah galat input desimal.

### 6. Postkondisi
- Status stok definitif, HPP riil tercatat tanpa distorsi, dan kewajiban hutang outlet terakru resmi.

### 7. Aturan Bisnis Terkait
- **BR-05**: Penerimaan menaikkan stok dengan status "menunggu nota" dan HPP sementara memakai harga terakhir.
- **BR-06**: Saat nota diinput, harga sebenarnya menggantikan harga sementara dan HPP dikoreksi (termasuk atas stok yang sudah terjual).

---

## UC-BO-18: Kelola Saldo Hutang Outlet ke Gudang Pusat & Aging

```
Use Case ID      : UC-BO-18
Nama Use Case    : Kelola Saldo Hutang Outlet ke Gudang Pusat & Aging
Modul            : ERP Backoffice (Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Owner
```

### 1. Deskripsi
Memantau buku pembantu hutang dagang per cabang kepada warehouse pusat, memetakan umur hutang (*aging of payables*), dan mengidentifikasi cabang yang memiliki kewajiban tertunggak.

### 2. Prekondisi
- Telah ada faktur pembelian yang diverifikasi (UC-BO-17).

### 3. Pemicu (Trigger)
- Penutupan buku bulanan atau audit likuiditas jaringan outlet.

### 4. Alur Utama (Main Flow)
1. Finance membuka menu **Keuangan > Saldo Hutang ke Pusat**.
2. Sistem menyajikan ringkasan per outlet:
   - Nama Outlet.
   - Total Saldo Hutang Aktif.
   - Komposisi Umur Hutang:
     - Lancar ($0 - 30$ hari).
     - Jatuh Tempo ($31 - 60$ hari).
     - Kritis ($> 60$ hari).
   - Jumlah Faktur Belum Lunas.
3. Finance mengklik nama salah satu outlet untuk membuka **Kartu Rekening Hutang Cabang**.
4. Sistem menampilkan daftar seluruh faktur terbuka, tanggal penerbitan, nilai tagihan, nominal yang telah dicicil, dan sisa saldo belum terbayar.

### 5. Postkondisi
- Finance memiliki peta kewajiban cabang yang jelas untuk menentukan jadwal penagihan atau pemotongan kas.

### 7. Aturan Bisnis Terkait
- **BR-07**: Ada saldo hutang per outlet yang dicatat mandiri di ERP Backoffice tanpa integrasi API ke aplikasi pusat.

---

## UC-BO-19: Catat Pembayaran Outlet ke Pusat & Alokasi Pelunasan Faktur

```
Use Case ID      : UC-BO-19
Nama Use Case    : Catat Pembayaran Outlet ke Pusat & Alokasi Pelunasan Faktur
Modul            : ERP Backoffice (Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Store Manager / Mitra
```

### 1. Deskripsi
Mencatat transfer dana pembayaran dari rekening operasional cabang ke rekening kantor pusat untuk melunasi kewajiban pasokan bahan. Pembayaran bersifat fleksibel (bisa dicicil, lumpsum, atau periodik) dan dialokasikan ke faktur-faktur terkait.

### 2. Prekondisi
- Outlet memiliki saldo hutang aktif.
- Finance menerima bukti mutasi transfer bank dari cabang.

### 3. Pemicu (Trigger)
- Setoran pembayaran dari outlet masuk ke rekening pusat.

### 4. Alur Utama (Main Flow)
1. Finance membuka menu **Keuangan > Catat Pembayaran ke Pusat**.
2. Finance memilih outlet pembayar (contoh: *Kopi Jodi - Sudirman*).
3. Sistem menampilkan total sisa hutang dan daftar faktur yang belum lunas.
4. Finance mengisi formulir pembayaran:
   - **Nominal Transfer**: Angka rupiah (contoh: Rp 5.000.000,-).
   - **Tanggal Setor**: Tanggal transaksi bank.
   - **Rekening Bank Penerima**: Dropdown bank pusat.
   - **Unggah Bukti Transfer**: File bukti mutasi.
   - **Metode Alokasi Tagihan**:
     - Opsi A: *Otomatis (FIFO - lunasi faktur tertua terlebih dahulu)*.
     - Opsi B: *Manual (Finance mencentang dan membagi alokasi ke faktur tertentu)*.
5. Finance menekan tombol **Simpan & Alokasikan Pembayaran**.
6. Sistem memotong saldo hutang outlet dan menandai status faktur yang terlunasi menjadi `Paid` atau `Partially Paid`.
7. Sistem memancarkan event `PaymentToCentralRecorded`.
8. Kartu hutang cabang langsung terupdate secara real-time.

### 5. Alur Alternatif & Eksepsi
- **4a. Nilai Pembayaran Melebihi Total Saldo Hutang**: Sistem memunculkan validasi error bahwa nominal melebihi total tagihan yang ada.

### 6. Postkondisi
- Saldo kewajiban cabang berkurang dan alokasi pembayaran tercatat rapi.

### 7. Aturan Bisnis Terkait
- **BR-07**: Pembayaran ke pusat dicatat manual di Backoffice, dapat periodik atau fleksibel (tidak harus per order), tanpa integrasi ke aplikasi warehouse pusat.

---

## UC-BO-20: Approval Pengeluaran Kas Kecil di Atas Limit

```
Use Case ID      : UC-BO-20
Nama Use Case    : Approval Pengeluaran Kas Kecil di Atas Limit
Modul            : ERP Backoffice (Persetujuan / Approval)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Pimpinan
Aktor Pendukung  : Store Manager
```

### 1. Deskripsi
Memeriksa bukti nota dan menyetujui pengeluaran darurat kas kecil outlet yang diajukan oleh Store Manager apabila nominalnya melampaui batas bebas approval cabang.

### 2. Prekondisi
- Store Manager telah mengajukan pengeluaran belanja kecil bernominal di atas limit via App Operasi (UC-OPS-05).

### 3. Pemicu (Trigger)
- Event `PettyCashSubmitted` dengan status `awaiting_approval`.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Persetujuan > Pengeluaran Kas Kecil**.
2. Sistem menyajikan daftar permohonan berstatus *Menunggu Persetujuan*:
   - Tanggal & Waktu Pengajuan.
   - Outlet Pengaju & Nama Store Manager.
   - **Nominal Pengeluaran**: (contoh: Rp 350.000,- di mana limit bebas adalah Rp 150.000,-).
   - **Keperluan Belanja**: (contoh: *Beli galon air mineral darurat & sabun cuci alat barista*).
   - Pratinjau Foto Struk Pembelian Fisik.
3. Pengguna memeriksa kesesuaian struk fisik dengan nominal rupiah yang diajukan.
4. Pengguna menekan tombol **Setujui (Approve)**.
5. Sistem mengubah status pengajuan menjadi `Approved` dan membukukan pengeluaran tersebut ke pos buku beban operasional outlet terkait.
6. Sistem memancarkan event `PettyCashApproved`.
7. Status di App Operasi Outlet pemohon berubah menjadi *"Disetujui"*, kas fisik laci resmi terkredit.

### 5. Alur Alternatif (Nominal Sangat Besar / Penolakan)
- **3a. Pengeluaran Bernominal Sangat Besar (> Batas Wewenang Finance)**: Jika nominal melebihi plafon Finance (misal > Rp 1.000.000,-), tombol persetujuan hanya dapat diakses oleh peran *Pimpinan / Owner* (BR-12).
- **4a. Menolak Pengajuan**: Pengguna menekan tombol **Tolak (Reject)** dan mengisi catatan alasan (misal: *"Struk tidak terbaca atau tidak relevan dengan operasional"*). Sistem memancarkan event `PettyCashRejected`. Dana tidak dibukukan sebagai beban perusahaan.

### 6. Postkondisi
- Tata kelola kas kecil terjaga bebas dari potensi fraud pengeluaran fiktif.

### 7. Aturan Bisnis Terkait
- **BR-12**: Kas kecil bertingkat: di bawah batas bebas langsung tercatat; di atas batas wajib persetujuan Finance atau pimpinan.

---

## UC-BO-21: Rekap Laporan Penjualan, HPP, & Margin per Outlet

```
Use Case ID      : UC-BO-21
Nama Use Case    : Rekap Laporan Penjualan, HPP, & Margin per Outlet
Modul            : ERP Backoffice (Laporan Keuangan)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat / Owner
```

### 1. Deskripsi
Menghasilkan laporan konsolidasi laba rugi operasional outlet yang menyajikan rincian omzet penjualan, diskon promo, HPP riil yang telah dikoreksi nota (*true-up*), dan beban operasional kas kecil yang disetujui.

### 2. Prekondisi
- Telah ada transaksi penjualan dan mutasi HPP pada periode yang dipilih.

### 3. Pemicu (Trigger)
- Evaluasi kinerja finansial bulanan atau persiapan laporan manajemen.

### 4. Alur Utama (Main Flow)
1. Pengguna membuka menu **Laporan > Laba Kotor & Margin Outlet**.
2. Pengguna menentukan filter: Outlet target dan periode tanggal transaksi.
3. Sistem menghitung dan menampilkan laporan keuangan terstruktur:
   - **Penjualan Kotor (Gross Sales)**: Total omzet harga dasar.
   - **Kenaikan Harga Channel App (+ Markup)**: Tambahan pendapatan dari channel online.
   - **Potongan Diskon & Promo Voucher (-)**: Nilai voucher yang ditanggung.
   - **Penjualan Bersih (Net Sales)** = Penjualan Kotor + Markup - Diskon.
   - **HPP Bahan Baku Riil (COGS)**: Nilai bahan yang terpakai berstatus terkoreksi nota definitif.
   - **Laba Kotor (Gross Profit)** = Penjualan Bersih - HPP Bahan Baku.
   - **Persentase Margin Kotor (%)** = $(\text{Laba Kotor} / \text{Penjualan Bersih}) \times 100\%$.
   - **Beban Kas Kecil Operasional Cabang**: Total belanja kebutuhan yang disetujui.
   - **Laba Operasional Outlet (Operating Profit)**.
4. Pengguna dapat memilih opsi tombol **Ekspor CSV / Excel** untuk arsip akuntansi eksternal.

### 5. Postkondisi
- Angka laporan terbebas dari estimasi bias karena seluruh HPP telah disinkronkan dengan faktur riil.

### 7. Aturan Bisnis Terkait
- **BR-06**: Laporan keuangan menyajikan HPP definitif yang sudah dikoreksi nota resmi.
- **BR-13**: Biaya operasional dan konsolidasi keuangan diatur terpusat oleh Finance di pusat.

---

## UC-BO-22: Rekonsiliasi Kasir & Arus Kas POS (Cashier Shift & Settlement)

```
Use Case ID      : UC-BO-22
Nama Use Case    : Rekonsiliasi Kasir & Arus Kas POS
Modul            : ERP Backoffice (Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Kasir Outlet POS, Store Manager
```

### 1. Deskripsi
Mengintegrasikan data transaksi kasir POS secara langsung ke modul Keuangan ERP. Finance dapat memantau saldo laci kasir real-time, menerima laporan penutupan shift kasir, mengaudit selisih kas fisik (*cash count variance*), dan memvalidasi setoran tunai/bank kasir menjadi berstatus lunas.

### 2. Prekondisi
- Kasir outlet telah membuka shift di POS dan melakukan transaksi walk-in.

### 3. Pemicu (Trigger)
- Kasir menutup shift di tablet POS dan mengirimkan rekonsiliasi kas laci ke ERP, atau Finance melakukan audit harian berkala.

### 4. Alur Utama (Main Flow)
1. Finance membuka menu **Keuangan > Rekonsiliasi Kasir & Kas Laci**.
2. Sistem menyajikan 4 kartu metrik utama:
   - **Kas Fisik di Laci Kasir (Open Drawers)**: Saldo uang tunai fisik yang aktif beredar di counter.
   - **Penerimaan QRIS & Digital**: Total pembayaran digital via payment gateway Midtrans.
   - **Setoran Menunggu Audit Finance**: Jumlah shift kasir yang telah disetor fisik dan menunggu validasi bukti transfer.
   - **Status Selisih Kas (Audit Variance)**: Total selisih uang fisik vs hitungan sistem POS.
3. Finance memilih salah satu shift kasir yang berstatus **"Menunggu Audit"**.
4. Sistem membuka modal audit komparatif:
   - Modal Awal (Float Kasir): Rp 200.000,-
   - Penjualan Tunai POS: Rp 450.000,-
   - Kas yang Seharusnya di Laci: Rp 650.000,-
   - Uang Fisik Dilaporkan Kasir: Rp 650.000,-
   - Status Selisih: Rp 0,- (Cocok).
5. Finance memeriksa bukti transfer/setoran bank dan menginput:
   - Nomor Referensi Setoran Bank (contoh: *SETOR-BCA-20261008-01*).
   - Rekening Bank Penampung (contoh: *Bank BCA Operasional Pusat*).
6. Finance menekan tombol **Verifikasi Lunas & Bukukan ke Kas Bank**.
7. Sistem memancarkan event `CashierSettlementVerified`.
8. Status shift kasir berubah menjadi **"Diverifikasi Lunas"** dan saldo kas bank holding bertambah.

---

## UC-BO-23: Buku Jurnal Kas Masuk Real-Time (Live General Ledger Feed)

```
Use Case ID      : UC-BO-23
Nama Use Case    : Buku Jurnal Kas Masuk POS Real-Time
Modul            : ERP Backoffice (Finance)
Fase             : Fase 1 (Core)
Prioritas        : P0
Aktor Utama      : Finance Pusat
Aktor Pendukung  : Kasir POS, App Pelanggan
```

### 1. Deskripsi
Mencatat jurnal akuntansi entri ganda (*double-entry bookkeeping*) secara instan untuk setiap transaksi penjualan di POS Kasir maupun App Pelanggan tanpa re-entry manual.

### 2. Alur Utama (Main Flow)
1. Setiap kali terjadi event `PaymentCaptured` & `OrderPlaced` di outlet:
2. Sistem secara otomatis menyusun baris jurnal:
   - **Jika Tunai**: [Debit] 1101 - Kas di Tangan Kasir, [Kredit] 4101 - Pendapatan Penjualan Kopi.
   - **Jika QRIS**: [Debit] 1102 - Bank QRIS Midtrans Gateway, [Kredit] 4101 - Pendapatan Penjualan Kopi.
3. Finance dapat memantau buku jurnal kasir langsung pada sub-tab **Buku Jurnal Kasir Real-Time**.

