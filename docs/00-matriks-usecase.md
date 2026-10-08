# Matriks Komprehensif Seluruh Use Case Ekosistem Kopi

Dokumen ini menyajikan inventaris lengkap seluruh 53 Use Case di 9 aplikasi ekosistem kopi multi-outlet, dikelompokkan berdasarkan fase pengembangan dan modul aplikasi.

---

## 1. Fase 1: Core Operasional & Backoffice (2,5 – 3 Bulan)

### 1.1 ERP Backoffice: Master Data & Konfigurasi
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-BO-01** | Kelola Master Bahan Baku & Satuan | Admin Pusat | P0 | [01-erp-backoffice-master-config.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/01-erp-backoffice-master-config.md#uc-bo-01) |
| **UC-BO-02** | Kelola Master Outlet & Status Kepemilikan | Admin Pusat / Owner | P0 | [01-erp-backoffice-master-config.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/01-erp-backoffice-master-config.md#uc-bo-02) |
| **UC-BO-03** | Kelola Hak Akses Pengguna & Peran (RBAC) | Admin Pusat | P1 | [01-erp-backoffice-master-config.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/01-erp-backoffice-master-config.md#uc-bo-03) |
| **UC-BO-04** | Kelola Feature Toggle Sistem Dinamis | Admin Pusat / Owner | P0 | [01-erp-backoffice-master-config.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/01-erp-backoffice-master-config.md#uc-bo-04) |
| **UC-BO-05** | Konfigurasi Parameter Pajak & Markup Channel App | Finance / Admin | P0 | [01-erp-backoffice-master-config.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/01-erp-backoffice-master-config.md#uc-bo-05) |
| **UC-BO-06** | Konfigurasi Ambang Batas Kas Kecil Bebas Approval | Finance / Owner | P0 | [01-erp-backoffice-master-config.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/01-erp-backoffice-master-config.md#uc-bo-06) |

### 1.2 ERP Backoffice: Katalog & Menu
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-BO-07** | Kelola Master Menu & Kategori | Admin Pusat | P0 | [02-erp-backoffice-katalog-menu.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/02-erp-backoffice-katalog-menu.md#uc-bo-07) |
| **UC-BO-08** | Kelola Resep Menu & Bahan Olahan Bertingkat | Admin Pusat | P0 | [02-erp-backoffice-katalog-menu.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/02-erp-backoffice-katalog-menu.md#uc-bo-08) |
| **UC-BO-09** | Kelola Modifier Menu (Ukuran, Gula, Add-ons) | Admin Pusat | P1 | [02-erp-backoffice-katalog-menu.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/02-erp-backoffice-katalog-menu.md#uc-bo-09) |
| **UC-BO-10** | Perhitungan & Analisis HPP Teoretis Menu | Finance / Admin | P0 | [02-erp-backoffice-katalog-menu.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/02-erp-backoffice-katalog-menu.md#uc-bo-10) |
| **UC-BO-11** | Review & Persetujuan Menu Lokal Usulan Outlet | Admin Pusat | P0 | [02-erp-backoffice-katalog-menu.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/02-erp-backoffice-katalog-menu.md#uc-bo-11) |

### 1.3 ERP Backoffice: Inventory & Pengadaan
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-BO-12** | Pantau Stok Multi-Outlet & Kartu Stok Terpusat | Admin Pusat / Finance | P0 | [03-erp-backoffice-inventory-pengadaan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/03-erp-backoffice-inventory-pengadaan.md#uc-bo-12) |
| **UC-BO-13** | Pantau Stok Berstatus "Menunggu Nota" | Finance Pusat | P0 | [03-erp-backoffice-inventory-pengadaan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/03-erp-backoffice-inventory-pengadaan.md#uc-bo-13) |
| **UC-BO-14** | Monitor Purchase Order (PO) Tanpa Harga dari Outlet | Admin Gudang Pusat | P0 | [03-erp-backoffice-inventory-pengadaan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/03-erp-backoffice-inventory-pengadaan.md#uc-bo-14) |
| **UC-BO-15** | Review Pengajuan Pembelian Bahan Luar Pusat | Owner / Pimpinan | P1 | [03-erp-backoffice-inventory-pengadaan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/03-erp-backoffice-inventory-pengadaan.md#uc-bo-15) |
| **UC-BO-16** | Stock Opname Terpusat & Penyesuaian Nilai Stok | Finance / Admin | P1 | [03-erp-backoffice-inventory-pengadaan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/03-erp-backoffice-inventory-pengadaan.md#uc-bo-16) |

### 1.4 ERP Backoffice: Keuangan (Finance Modul)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-BO-17** | Input Nota Pembelian & Koreksi HPP Otomatis (True-Up) | Finance Pusat | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-17) |
| **UC-BO-18** | Kelola Saldo Hutang Outlet ke Gudang Pusat & Aging | Finance Pusat | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-18) |
| **UC-BO-19** | Catat Pembayaran Outlet ke Pusat & Alokasi Pelunasan | Finance Pusat | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-19) |
| **UC-BO-20** | Approval Pengeluaran Kas Kecil di Atas Limit | Finance / Pimpinan | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-20) |
| **UC-BO-21** | Rekap Laporan Penjualan, HPP, & Margin per Outlet | Finance / Owner | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-21) |
| **UC-BO-22** | Rekonsiliasi Kasir & Kas Laci POS | Finance Pusat | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-22) |
| **UC-BO-23** | Buku Jurnal Kas Masuk POS Real-Time (General Ledger) | Finance Pusat | P0 | [04-erp-backoffice-finance.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/04-erp-backoffice-finance.md#uc-bo-23) |

### 1.5 POS Kasir (Point of Sale)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-POS-01** | Buka & Tutup Shift Kasir (Modal & Kas Fisik) | Kasir Outlet | P1 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-01) |
| **UC-POS-02** | Cari & Pilih Menu Berdasarkan Outlet Aktif | Kasir Outlet | P0 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-02) |
| **UC-POS-03** | Kustomisasi Pesanan (Modifier, Add-ons, Catatan) | Kasir Outlet | P0 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-03) |
| **UC-POS-04** | Checkout Pembayaran Walk-In (Tunai & QRIS Simulasi) | Kasir Outlet | P0 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-04) |
| **UC-POS-05** | Terima / Tolak Pesanan Online dari App Pelanggan | Kasir Outlet | P0 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-05) |
| **UC-POS-06** | Dispatch Tiket Pesanan Otomatis ke KDS Barista | Sistem / Kasir | P0 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-06) |
| **UC-POS-07** | Cetak & Tampilkan Struk Digital Transaksi | Kasir Outlet | P1 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-07) |
| **UC-POS-08** | Pembatalan / Void Transaksi dengan PIN Supervisor | Kasir / SPV | P1 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-08) |
| **UC-POS-09** | Peringatan Stok Kritis & Auto-Sold Out Menu di POS | Kasir / Sistem | P1 | [05-pos-kasir.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/05-pos-kasir.md#uc-pos-09) |

### 1.6 KDS Barista (Kitchen Display System)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-KDS-01** | Pantau Antrean Tiket Pesanan (Baru, Dibuat, Siap) | Barista | P0 | [06-kds-barista.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/06-kds-barista.md#uc-kds-01) |
| **UC-KDS-02** | Mulai Proses Pembuatan Minuman (Status In Progress) | Barista | P0 | [06-kds-barista.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/06-kds-barista.md#uc-kds-02) |
| **UC-KDS-03** | Tandai Pesanan Siap & Pemotongan Stok Resep Otomatis | Barista | P0 | [06-kds-barista.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/06-kds-barista.md#uc-kds-03) |
| **UC-KDS-04** | Tandai Pesanan Telah Diserahkan / Diambil Pelanggan | Barista / Kasir | P0 | [06-kds-barista.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/06-kds-barista.md#uc-kds-04) |
| **UC-KDS-05** | Intip Formula Resep Cepat & Gramatur Bahan | Barista | P1 | [06-kds-barista.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/06-kds-barista.md#uc-kds-05) |
| **UC-KDS-06** | Indikator SLA Keterlambatan Tiket Pesanan | Barista / Sistem | P1 | [06-kds-barista.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/06-kds-barista.md#uc-kds-06) |

### 1.7 App Operasi Outlet (Store Manager Mobile)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-OPS-01** | Pantau Ringkasan Operasional Harian Outlet | Store Manager | P0 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-01) |
| **UC-OPS-02** | Cek Stok Bahan Outlet & Notifikasi Low Stock Alert | Store Manager | P0 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-02) |
| **UC-OPS-03** | Penerbitan Purchase Order (PO) Tanpa Kolom Harga | Store Manager | P0 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-03) |
| **UC-OPS-04** | Penerimaan Barang Fisik & Status Menunggu Nota | Store Manager | P0 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-04) |
| **UC-OPS-05** | Pengajuan Belanja Kas Kecil Bertingkat dengan Bukti | Store Manager | P0 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-05) |
| **UC-OPS-06** | Pengajuan Pembelian Bahan Baku Darurat ke Luar Pusat | Store Manager | P1 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-06) |
| **UC-OPS-07** | Pengajuan Usulan Menu / Resep Lokal Khusus Outlet | Store Manager | P0 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-07) |
| **UC-OPS-08** | Pencatatan Produksi Bahan Olahan Internal Outlet | Store Manager | P1 | [07-app-operasi-outlet.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/07-app-operasi-outlet.md#uc-ops-08) |

---

## 2. Fase 2: Omni-Channel & CRM (2 Bulan)

### 2.1 App Pelanggan (Customer Mobile App / PWA)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-CUS-01** | Registrasi & Login Cepat Pelanggan (OTP Simulasi) | Pelanggan | P1 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-01) |
| **UC-CUS-02** | Pilih Outlet Kopi Terdekat & Info Operasional | Pelanggan | P0 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-02) |
| **UC-CUS-03** | Eksplorasi Menu Outlet & Kustomisasi Modifier | Pelanggan | P0 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-03) |
| **UC-CUS-04** | Checkout Keranjang, Markup Channel, & Kupon Diskon | Pelanggan | P0 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-04) |
| **UC-CUS-05** | Pembayaran via QRIS Dinamis Simulasi (Midtrans) | Pelanggan | P0 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-05) |
| **UC-CUS-06** | Live Tracking Status Pesanan Real-Time | Pelanggan | P0 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-06) |
| **UC-CUS-07** | Riwayat Transaksi & Fitur 1-Tap Reorder Menu | Pelanggan | P1 | [01-app-pelanggan.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/01-app-pelanggan.md#uc-cus-07) |

### 2.2 Panel Promo CRM
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-CRM-01** | Pembuatan Voucher Diskon (% / Nominal, Kuota, Min.) | Tim Marketing | P0 | [02-panel-promo-crm.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/02-panel-promo-crm.md#uc-crm-01) |
| **UC-CRM-02** | Pengaturan Cakupan Promo (Global vs Spesifik Outlet)| Tim Marketing | P0 | [02-panel-promo-crm.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/02-panel-promo-crm.md#uc-crm-02) |
| **UC-CRM-03** | Pratinjau Tampilan Promo di HP secara Real-Time | Tim Marketing | P1 | [02-panel-promo-crm.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/02-panel-promo-crm.md#uc-crm-03) |
| **UC-CRM-04** | Pemantauan Efektivitas & Dampak Omzet Kampanye | Marketing / Owner | P1 | [02-panel-promo-crm.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/02-panel-promo-crm.md#uc-crm-04) |

---

## 3. Fase 3: Scale, Investor & Eksekutif (1 – 1,5 Bulan)

### 3.1 Portal Mitra / Investor (Read-Only)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-PRT-01** | Login Mitra & Pemilihan Outlet Kemitraan | Mitra / Investor | P1 | [01-portal-mitra-investor.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/01-portal-mitra-investor.md#uc-prt-01) |
| **UC-PRT-02** | Pantau Kinerja Penjualan Cabang (Omzet, Volume, AOV)| Mitra / Investor | P1 | [01-portal-mitra-investor.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/01-portal-mitra-investor.md#uc-prt-02) |
| **UC-PRT-03** | Transparansi HPP (Sementara vs Terkoreksi) & Beban | Mitra / Investor | P1 | [01-portal-mitra-investor.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/01-portal-mitra-investor.md#uc-prt-03) |
| **UC-PRT-04** | Tampilan Kepemilikan ("Belum Diatur") & Unduh PDF | Mitra / Investor | P1 | [01-portal-mitra-investor.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/01-portal-mitra-investor.md#uc-prt-04) |

### 3.2 Owner Dashboard & Eksekutif
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-OWN-01** | Konsolidasi KPI Seluruh Jaringan Outlet | Owner / Direksi | P1 | [02-owner-dashboard.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/02-owner-dashboard.md#uc-own-01) |
| **UC-OWN-02** | Komparasi Performa Cabang (Own vs Mitra) & Peringkat| Owner / Direksi | P1 | [02-owner-dashboard.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/02-owner-dashboard.md#uc-own-02) |
| **UC-OWN-03** | Pusat Persetujuan Eksekutif Terpadu | Owner / Direksi | P1 | [02-owner-dashboard.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/02-owner-dashboard.md#uc-own-03) |
| **UC-OWN-04** | Pusat Peringatan Dini Bisnis (Hutang, Margin, Stok) | Owner / Direksi | P1 | [02-owner-dashboard.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/02-owner-dashboard.md#uc-own-04) |

### 3.3 Demo Stage Orchestrator (Shell Presentasi)
| ID | Nama Use Case | Aktor Utama | Prioritas | Dokumen Detail |
|---|---|---|:---:|---|
| **UC-STG-01** | Orkestrasi Multi-Perangkat (Device Frames Laptop, HP, Tablet)| Presenter | P0 | [03-demo-stage-orchestrator.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/03-demo-stage-orchestrator.md#uc-stg-01) |
| **UC-STG-02** | Mode Presentasi Otomatis "Satu Gelas, Satu Cerita" | Presenter | P0 | [03-demo-stage-orchestrator.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/03-demo-stage-orchestrator.md#uc-stg-02) |
| **UC-STG-03** | Kontrol Presenter, Alih Peran (Role Switcher), & Event Log | Presenter | P0 | [03-demo-stage-orchestrator.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/03-demo-stage-orchestrator.md#uc-stg-03) |
| **UC-STG-04** | White-Label Theme Switcher Instan (Nusa ke Teras Kopi)| Presenter | P1 | [03-demo-stage-orchestrator.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/03-demo-stage-orchestrator.md#uc-stg-04) |
| **UC-STG-05** | Reset State Demo & Seeding Ulang IndexedDB | Presenter | P0 | [03-demo-stage-orchestrator.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/03-demo-stage-orchestrator.md#uc-stg-05) |
