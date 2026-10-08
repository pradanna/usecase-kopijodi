# Dokumentasi Ekosistem Kopi "Satu Gelas, Satu Cerita"

Selamat datang di repositori dokumentasi perancangan dan spesifikasi ekosistem aplikasi kopi multi-outlet **Kopi Jodi / Kopi Jodi**. Dokumen-dokumen di dalam direktori `docs/` ini disusun secara modular berdasarkan fase implementasi dan arsitektur produk yang didefinisikan dalam [PRD.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/PRD.md).

---

## 🗺️ Struktur & Peta Dokumen

```
docs/
├── README.md                                   # Peta panduan seluruh dokumentasi
├── 00-matriks-usecase.md                       # Matriks komprehensif seluruh 53 use case
│
├── fase-1-core/                                # FASE 1: CORE OPERASIONAL & BACKOFFICE (2.5 - 3 Bulan)
│   ├── 00-modular-menu-erp.md                  # Arsitektur 3 Modul ERP: Warehouse, Menu Racikan & Finance
│   ├── 01-erp-backoffice-master-config.md      # UC-BO-01 s/d UC-BO-06 (Bahan, Outlet, RBAC, Toggle, Pajak, Kas Kecil)
│   ├── 02-erp-backoffice-katalog-menu.md       # UC-BO-07 s/d UC-BO-11 (Menu, Resep, Modifier, HPP, Menu Lokal)
│   ├── 03-erp-backoffice-inventory-pengadaan.md# UC-BO-12 s/d UC-BO-16 (Stok Outlet, Awaiting Invoice, PO, Izin Beli Luar)
│   ├── 04-erp-backoffice-finance.md            # UC-BO-17 s/d UC-BO-21 (Input Nota, True-Up HPP, Hutang, Approval, Laporan)
│   ├── 05-pos-kasir.md                         # UC-POS-01 s/d UC-POS-09 (Shift, Menu, Modifier, QRIS, Online Queue, KDS)
│   ├── 06-kds-barista.md                       # UC-KDS-01 s/d UC-KDS-06 (Tiket Dapur, Mulai/Siap, Auto Potong Stok, SLA)
│   └── 07-app-operasi-outlet.md                # UC-OPS-01 s/d UC-OPS-08 (Mobile Manager: Stok, PO Tanpa Harga, Terima, Kas)
│
├── fase-2-omni/                                # FASE 2: OMNI-CHANNEL & CUSTOMER EXPERIENCE (2 Bulan)
│   ├── 01-app-pelanggan.md                     # UC-CUS-01 s/d UC-CUS-07 (Outlet Terdekat, Menu+Markup, QRIS, Live Tracking)
│   └── 02-panel-promo-crm.md                   # UC-CRM-01 s/d UC-CRM-04 (Voucher Global vs Outlet, Emulator Preview, Efektivitas)
│
├── fase-3-scale/                               # FASE 3: SCALE, INVESTOR & EKSEKUTIF (1 - 1.5 Bulan)
│   ├── 01-portal-mitra-investor.md             # UC-PRT-01 s/d UC-PRT-04 (Read-Only: Omzet, HPP Riil vs Sementara, Kepemilikan)
│   ├── 02-owner-dashboard.md                   # UC-OWN-01 s/d UC-OWN-04 (Konsolidasi KPI, Ranking Cabang, Executive Approval)
│   └── 03-demo-stage-orchestrator.md           # UC-STG-01 s/d UC-STG-05 (Device Frames, Auto Demo, Role Switcher, White-Label)
│
└── 04-skenario-integrasi-lintas-aplikasi.md    # Skenario Utama "Satu Gelas, Satu Cerita" & Sorotan S-A s/d S-F
```

---

## 📌 Ringkasan Cakupan per Fase

### 1. [Fase 1: Core Operasional & Backoffice](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-1-core/)
- **Fokus Utama**: Fondasi operasional outlet, rantai pasok bahan, dan pengendalian biaya riil (*True-Up HPP*).
- **Aplikasi Terlibat**:
  1. **ERP Backoffice & Finance Modul** (Desktop Web)
  2. **POS Kasir** (Tablet Landscape)
  3. **KDS Barista** (Monitor / Tablet Landscape)
  4. **App Operasi Outlet** (Mobile Android / iOS)
- **Keunggulan Sistem**: PO tanpa harga, penerimaan barang menaikkan stok dengan status `menunggu nota`, HPP sementara otomatis dikoreksi saat nota resmi diverifikasi Finance, kas kecil bertingkat, dan stok terpotong presisi dari resep saat pesanan selesai di KDS.

### 2. [Fase 2: Omni-Channel & CRM](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-2-omni/)
- **Fokus Utama**: Menjangkau pelanggan online, otomatisasi pesanan *pick-up*, dan kampanye promosi penjualan.
- **Aplikasi Terlibat**:
  1. **App Pelanggan** (PWA / Mobile App)
  2. **Panel Promo CRM** (Desktop Web)
- **Keunggulan Sistem**: Pemilihan outlet terdekat, penyesuaian markup channel online transparan, checkout QRIS simulasi Midtrans, pelacakan live status pembuatan minuman (*Baru $\rightarrow$ Dibuat $\rightarrow$ Siap*), dan pembuatan voucher promo fleksibel (global maupun spesifik outlet).

### 3. [Fase 3: Scale, Investor & Eksekutif](file:///c:/PROJECT/WEBSITE/kopi-jodi/docs/fase-3-scale/)
- **Fokus Utama**: Pengawasan eksekutif lintas cabang, transparansi investor, dan demonstrasi interaktif.
- **Aplikasi Terlibat**:
  1. **Portal Mitra / Investor** (Desktop Web Read-Only)
  2. **Owner Dashboard** (Desktop Web)
  3. **Demo Stage Orchestrator** (Shell Presentasi)
- **Keunggulan Sistem**: Transparansi status HPP dan biaya operasional cabang ke mitra tanpa kebocoran data cabang lain (skema bagi hasil ditunda rapi), dashboard helikopter untuk Owner, alur approval pembelian luar pusat, serta kemampuan *white-label switch* (mengganti nama & tema brand dalam 1 klik).

---

## 🔗 Referensi Dokumen Pendukung
- **PRD Resmi**: [PRD.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/PRD.md)
- **Catatan Perancangan Internal ERP**: [catatan-perancangan-erp-kopi.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/catatan-perancangan-erp-kopi.md)
- **Draf Penawaran Komersial**: [draf-penawaran-aplikasi-kopi.md](file:///c:/PROJECT/WEBSITE/kopi-jodi/draf-penawaran-aplikasi-kopi.md)
