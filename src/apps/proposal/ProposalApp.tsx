import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Building2,
  DollarSign,
  Calendar,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Cpu,
  Mail,
  Smartphone,
  Tablet,
  Monitor,
  Store,
  Users,
  PieChart,
  Award,
  XCircle,
  TrendingDown,
  Lock,
} from 'lucide-react';

interface RoleGroup {
  role: string;
  tagline: string;
  headerClass: string;
  badgeClass: string;
  icon: React.ReactNode;
  features: string[];
}

interface ModuleItem {
  id: number;
  name: string;
  role?: string;
  device: string;
  icon: React.ReactNode;
  phase: string;
  summary?: string;
  workflow?: string[];
  features?: string[];
  roleGroups?: RoleGroup[];
}

export const ProposalApp: React.FC<{ onBackToDemo?: () => void }> = ({ onBackToDemo }) => {
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Daftar Modul
  const MODULES: ModuleItem[] = [
    {
      id: 1,
      name: 'ERP Backoffice & Finance',
      role: 'Owner, Admin Pusat, Finance, Store Manager (akses terbatas per outlet)',
      device: 'Desktop Web Browser',
      icon: <Building2 className="w-5 h-5 text-indigo-600" />,
      phase: 'Fase 1 (Core)',
      summary: 'Pusat kendali stok, pembelian, HPP, dan keuangan seluruh outlet dalam satu sistem.',
      workflow: [
        'Pesan Barang',
        'Terima Barang',
        'Input Nota',
        'HPP Terkoreksi',
        'Laporan Keuangan',
      ],
      roleGroups: [
        {
          role: 'OWNER / PIMPINAN',
          tagline: 'Memantau dan memutuskan',
          headerClass: 'bg-amber-50/90 border-amber-200 text-amber-950',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Award className="w-4 h-4 text-amber-700" />,
          features: [
            'Pantau Semua Outlet Secara Live: Lihat stok dan penjualan seluruh outlet dalam satu layar, lengkap dengan peringatan stok menipis.',
            'Persetujuan Pembelian & Transaksi Besar: Setujui pembelian di luar gudang pusat dan transaksi di atas batas nominal sebelum diproses.',
            'Margin & Kinerja Outlet: Bandingkan margin dan laba/rugi tiap outlet dengan HPP yang sudah terkoreksi, sehingga angkanya akurat.',
            'Outlet Sendiri & Mitra dalam Satu Sistem: Kelola outlet milik sendiri maupun mitra dalam satu sistem, dengan data kepemilikan yang sudah disiapkan.',
          ],
        },
        {
          role: 'ADMIN PUSAT',
          tagline: 'Mengatur data induk dan aturan sistem',
          headerClass: 'bg-purple-50/90 border-purple-200 text-purple-950',
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <Layers className="w-4 h-4 text-purple-700" />,
          features: [
            'Daftar Bahan, Resep & Menu: Kelola daftar induk bahan baku dan kemasan, resep racikan (BOM) yang menghitung modal per gelas, serta bahan olahan seperti sirup dan cold brew.',
            'Persetujuan Menu Khusus Outlet: Tinjau menu dan resep yang diusulkan outlet, lalu setujui sebelum tampil di outlet tersebut.',
            'Hak Akses per Peran & Outlet: Atur siapa boleh melihat dan mengerjakan apa, per peran dan per outlet.',
            'Fitur Hidup/Mati: Aktifkan atau matikan fitur sesuai kebutuhan bisnis tanpa mengubah sistem.',
          ],
        },
        {
          role: 'FINANCE',
          tagline: 'Memastikan angka akurat dan terkendali',
          headerClass: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <DollarSign className="w-4 h-4 text-emerald-700" />,
          features: [
            'Input Nota & Koreksi HPP Otomatis (True-Up HPP): Modal sementara memakai harga terakhir, lalu dikoreksi otomatis begitu nota supplier diinput.',
            'Hutang ke Gudang Pusat: Pantau tagihan tiap outlet beserta umur hutang (aging).',
            'Catat Pembayaran ke Pusat: Catat pembayaran secara fleksibel, per periode atau per nota.',
            'Kas Kecil & Persetujuan Berjenjang: Setujui belanja kebutuhan kecil outlet yang melewati batas nominal sebelum dana dicairkan.',
            'Jurnal Otomatis: Penjualan harian outlet (Tunai & QRIS) tercatat otomatis ke jurnal pendapatan dan buku kas pusat, dengan minim rekonsiliasi manual.',
            'Laporan Keuangan Lengkap: Laporan laba/rugi, arus kas, dan jurnal umum multi-cabang.',
          ],
        },
        {
          role: 'STORE MANAGER',
          tagline: 'Mengelola operasional outlet sendiri (akses terbatas per outlet)',
          headerClass: 'bg-blue-50/90 border-blue-200 text-blue-950',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <Store className="w-4 h-4 text-blue-700" />,
          features: [
            'Stok Outlet Sendiri: Lihat stok outlet dan terima peringatan saat stok menipis.',
            'Pemesanan Barang Tanpa Harga: Pesan ke gudang pusat cukup dengan jenis dan jumlah barang.',
            'Penerimaan Barang: Saat barang diterima, stok langsung bertambah dengan status “menunggu nota”.',
            'Belanja Kebutuhan Kecil: Catat belanja harian outlet dalam batas nominal yang berlaku, dan ajukan persetujuan bila melewati batas.',
            'Usulan Menu Khusus Outlet: Usulkan menu dan resep khusus outlet untuk disetujui pusat.',
            'Pengajuan Pembelian di Luar Gudang Pusat: Ajukan pembelian ke toko lain dengan alasan, untuk disetujui pimpinan.',
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'POS Kasir Outlet',
      role: 'Kasir, Store Manager / Supervisor',
      device: 'Tablet Landscape Counter',
      icon: <Tablet className="w-5 h-5 text-amber-600" />,
      phase: 'Fase 1 (Core)',
      summary: 'Kasir cepat di outlet yang langsung terhubung ke dapur, stok, dan keuangan.',
      workflow: [
        'Pilih Menu',
        'Bayar',
        'Struk & Tiket KDS',
        'Stok Berkurang',
        'Omzet Masuk ERP',
      ],
      roleGroups: [
        {
          role: 'KASIR',
          tagline: 'Melayani pelanggan dengan cepat',
          headerClass: 'bg-amber-50/90 border-amber-200 text-amber-950',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Tablet className="w-4 h-4 text-amber-700" />,
          features: [
            'Transaksi Cepat dengan Varian: Menu tampil sesuai outlet. Atur varian per minuman: ukuran cup, takaran gula, opsi susu alternatif seperti oatmilk, plus catatan khusus.',
            'Pembayaran Tunai & QRIS: Tunai dengan hitungan kembalian otomatis, atau QRIS dinamis Midtrans.',
            'Voucher & Promo: Voucher global maupun khusus outlet langsung diterapkan di keranjang.',
            'Menu Habis Otomatis: Stok berkurang sesuai resep setiap minuman terjual. Menu otomatis ditandai habis bila bahannya tidak cukup.',
            'Struk & Tiket ke Dapur: Cetak struk thermal bluetooth, dan pesanan langsung muncul di layar KDS barista (khusus outlet besar/flagship).',
            'Tetap Berjalan Saat Offline: Transaksi tunai tetap bisa dilakukan saat internet mati dan tersinkron otomatis begitu kembali online.',
          ],
        },
        {
          role: 'STORE MANAGER / SUPERVISOR',
          tagline: 'Mengawasi kas dan transaksi outlet',
          headerClass: 'bg-blue-50/90 border-blue-200 text-blue-950',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <ShieldCheck className="w-4 h-4 text-blue-700" />,
          features: [
            'Shift & Audit Kas Laci: Buka dan tutup shift dengan hitung kas laci fisik (cash count). Selisih terdeteksi lewat rekonsiliasi kasir otomatis.',
            'Otorisasi Pembatalan & Refund: Pembatalan dan refund transaksi hanya bisa diproses setelah disetujui supervisor.',
            'Pendapatan Tercatat Otomatis ke ERP: Setiap transaksi langsung membukukan omzet ke ERP dan mencatat kas masuk, tanpa input ulang.',
            'Riwayat & Laporan Shift: Telusuri semua transaksi per shift dan per kasir, lengkap dengan ringkasan tunai dan QRIS.',
          ],
        },
      ],
    },
    {
      id: 3,
      name: 'KDS Layar Barista',
      role: 'Barista',
      device: 'Monitor Dapur / Tablet',
      icon: <Monitor className="w-5 h-5 text-emerald-600" />,
      phase: 'Fase 1 (Core)',
      summary: 'Layar dapur yang menggantikan kertas bon, sehingga pesanan mengalir cepat dari kasir ke barista tanpa salah baca.',
      workflow: [
        'Pesanan Masuk',
        'Tiket di Layar',
        'Sedang Diracik',
        'Siap Diambil',
      ],
      features: [
        'Antrean Tiket Real-Time: Pesanan dari kasir muncul otomatis di layar tanpa kertas bon, lengkap dengan varian dan catatan pelanggan.',
        'Status Progres per Pesanan: Ubah status dengan satu sentuhan: Dalam Antrean → Sedang Diracik → Siap Diambil. Perubahan langsung terlihat di POS kasir.',
        'Timer Waktu Penyajian: Setiap pesanan punya penghitung waktu, dan warnanya berubah saat mendekati atau melewati target waktu pembuatan.',
      ],
    },
    {
      id: 4,
      name: 'App Operasi Outlet',
      role: 'Store Manager Outlet',
      device: 'Smartphone Android/iOS',
      icon: <Smartphone className="w-5 h-5 text-blue-600" />,
      phase: 'Fase 1 (Core)',
      features: [
        'Penerimaan kiriman barang dari gudang pusat (foto surat jalan & nota).',
        'Pengajuan permintaan restock bahan (PO Cabang Tanpa Harga).',
        'Audit fisik berkala (stock opname) & pencatatan waste/susut kalibrasi.',
        'Pengajuan klaim kas kecil belanja darurat lokal.',
        'Usulan menu kreasi khas outlet ke tim R&D pusat.',
      ],
    },
    {
      id: 5,
      name: 'App Pelanggan (Customer)',
      role: 'Pelanggan Kopi Seduhan Jodi',
      device: 'Mobile PWA iOS & Android',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      phase: 'Fase 2 (Omni)',
      features: [
        'Pencarian outlet terdekat dengan deteksi jarak GPS.',
        'Pemesanan pick-up mandiri (ambil tanpa antre) & delivery.',
        'Integrasi pembayaran QRIS & E-Wallet instan.',
        'Pelacakan status racikan minuman secara live.',
        'Poin loyalitas, membership tiering, & klaim e-voucher promo.',
      ],
    },
    {
      id: 6,
      name: 'CRM & Promo Panel',
      role: 'Tim Marketing & Promosi',
      device: 'Desktop Web Browser',
      icon: <PieChart className="w-5 h-5 text-rose-600" />,
      phase: 'Fase 2 (Omni)',
      features: [
        'Pembuatan voucher diskon nominal & persentase.',
        'Aturan promo fleksibel: berlaku nasional atau khusus cabang tertentu.',
        'Emulator pratinjau tampilan voucher sebelum dipublikasikan.',
        'Analisis performa efektivitas dan ROI setiap kampanye promo.',
      ],
    },
    {
      id: 7,
      name: 'Portal Mitra Investor',
      role: 'Investor / Mitra Cabang',
      device: 'Desktop Web Browser',
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      phase: 'Fase 3 (Scale)',
      features: [
        'Akses baca (read-only) laporan omzet outlet milik mitra secara transparan.',
        'Rincian HPP riil vs sementara dan biaya operasional yang sah.',
        'Kalkulasi estimasi bagi hasil bulanan otomatis.',
        'Membangun kepercayaan penuh antara pemilik brand dan investor cabang.',
      ],
    },
    {
      id: 8,
      name: 'Owner Dashboard & HR',
      role: 'Founder, Direksi & HR',
      device: 'Desktop & Tablet',
      icon: <Award className="w-5 h-5 text-amber-700" />,
      phase: 'Fase 3 (Scale)',
      features: [
        'Konsolidasi KPI performa seluruh cabang dalam satu layar eksekutif.',
        'Peringkat cabang terlaris (leaderboard) dan margin tertinggi.',
        'Pusat persetujuan eksekutif untuk pengeluaran anggaran di atas limit.',
        'Manajemen jadwal shift barista & absensi GPS mobile.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans print:bg-white print:text-black">
      {/* Top Banner Navigation (Kembali ke Demo & Download) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/genossys_logo.png" alt="genossys" className="h-8 w-auto object-contain" />
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                REKOMENDASI SOLUSI TEKNOLOGI
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Kopi Seduhan Jodi Ecosystem
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">

            {onBackToDemo && (
              <button
                onClick={onBackToDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              >
                <span>📱 Demo Interaktif</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>

            <a
              href="/Rekomendasi_Solusi_Teknologi_Kopi_Seduhan_Jodi.docx"
              download="Rekomendasi_Solusi_Teknologi_Kopi_Seduhan_Jodi.docx"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--brand-600,#C86D3B)] hover:bg-[var(--brand-700,#A85428)] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word (.docx)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Cover / Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e1b18] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[var(--brand-600,#C86D3B)]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold backdrop-blur-sm">
                <span>Dokumen Resmi Presentasi Teknis & Solusi Ekosistem</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Pengembangan Ekosistem Aplikasi & ERP Multi-Outlet Kopi Seduhan Jodi
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Standardisasi Operasional Modern Setara Jaringan Kafe Nasional (Fore & Kopi Kenangan) — Terintegrasi Penuh dari Kasir POS, Barista KDS, Gudang, hingga Keuangan Pusat.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-w-[240px] space-y-3 shrink-0">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Technology Partner</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
                  <img src="/genossys_logo.png" alt="genossys" className="w-full h-auto object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">genossys</div>
                  <div className="text-slate-300 text-xs flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>genossys2019@gmail.com</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300">
                <span className="text-slate-400">Untuk Klien:</span> <strong className="text-white">Founder Kopi Seduhan Jodi</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Cakupan 8 Modul & Ekosistem */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Arsitektur & Cakupan 8 Modul Aplikasi</h2>
                <p className="text-xs text-slate-500">Seluruh modul saling terhubung tanpa perantara perulangan data manual</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Module Tab Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/50">
              {MODULES.map((mod, idx) => (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleTab(idx);
                    setSelectedRoleFilter('ALL');
                  }}
                  className={`p-3 text-left border-r border-b sm:border-b-0 border-slate-200 transition-all cursor-pointer ${
                    activeModuleTab === idx
                      ? 'bg-white font-extrabold text-slate-900 border-t-2 border-t-[var(--brand-600,#C86D3B)] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/70 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {mod.icon}
                    <span className="text-xs truncate">{mod.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">{mod.phase}</div>
                </button>
              ))}
            </div>

            {/* Active Module Details */}
            <div className="p-6">
              {(() => {
                const current = MODULES[activeModuleTab];
                return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">{current.name}</h3>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                            {current.phase}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          <strong>Pengguna:</strong> {current.role} &bull; <strong>Platform:</strong> {current.device}
                        </div>
                        {current.summary && (
                          <p className="text-xs text-slate-600 font-medium pt-0.5">
                            {current.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Alur Utama jika ada */}
                    {current.workflow && current.workflow.length > 0 && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-blue-50/70 border border-indigo-100 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <div className="flex items-center gap-1.5 text-indigo-900 font-bold shrink-0">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span>Alur Utama:</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {current.workflow.map((step, idx) => (
                              <React.Fragment key={idx}>
                                <span className="px-2.5 py-0.5 bg-white rounded-md border border-indigo-200/80 shadow-2xs text-slate-800 font-semibold text-[11px]">
                                  {step}
                                </span>
                                {idx < current.workflow!.length - 1 && (
                                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {current.roleGroups && current.roleGroups.length > 0 ? (
                      <div className="space-y-4">
                        {/* Filter Peran Pill Tabs */}
                        <div className="flex flex-wrap items-center gap-1.5 pb-1">
                          <span className="text-[11px] text-slate-400 font-bold mr-1">Filter Peran:</span>
                          <button
                            type="button"
                            onClick={() => setSelectedRoleFilter('ALL')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              selectedRoleFilter === 'ALL'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Semua Peran ({current.roleGroups.length})
                          </button>
                          {current.roleGroups.map((rg) => (
                            <button
                              key={rg.role}
                              type="button"
                              onClick={() => setSelectedRoleFilter(rg.role)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                selectedRoleFilter === rg.role
                                  ? 'bg-[var(--brand-600,#C86D3B)] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {rg.role}
                            </button>
                          ))}
                        </div>

                        {/* Role Cards List */}
                        <div className="space-y-4">
                          {current.roleGroups
                            .filter((rg) => selectedRoleFilter === 'ALL' || selectedRoleFilter === rg.role)
                            .map((rg) => (
                              <div
                                key={rg.role}
                                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                              >
                                {/* Role Header Banner */}
                                <div
                                  className={`px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${rg.headerClass}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                                      {rg.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-black text-sm tracking-wide">{rg.role}</h4>
                                      <p className="text-xs text-slate-600 font-medium">{rg.tagline}</p>
                                    </div>
                                  </div>
                                  <span
                                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border w-fit ${rg.badgeClass}`}
                                  >
                                    {rg.features.length} Fitur
                                  </span>
                                </div>

                                {/* Features in 2 columns */}
                                <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-2.5">
                                  {rg.features.map((feat, idx) => {
                                    let title = '';
                                    let desc = feat;
                                    const colonIdx = feat.indexOf(': ');
                                    if (colonIdx > 0) {
                                      title = feat.slice(0, colonIdx);
                                      desc = feat.slice(colonIdx + 2);
                                    }
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all text-xs"
                                      >
                                        <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-700 shrink-0 mt-0.5 shadow-2xs">
                                          {idx + 1}
                                        </div>
                                        <div className="leading-relaxed text-slate-700">
                                          {title ? (
                                            <>
                                              <strong className="block text-slate-900 font-extrabold mb-0.5">
                                                {title}
                                              </strong>
                                              <span className="text-slate-600">{desc}</span>
                                            </>
                                          ) : (
                                            <span className="text-slate-700">{desc}</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {current.features?.map((feat, i) => {
                          let title = '';
                          let desc = feat;
                          const colonIdx = feat.indexOf(': ');
                          if (colonIdx > 0) {
                            title = feat.slice(0, colonIdx);
                            desc = feat.slice(colonIdx + 2);
                          }
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all text-xs"
                            >
                              <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-700 shrink-0 mt-0.5 shadow-2xs">
                                {i + 1}
                              </div>
                              <div className="leading-relaxed text-slate-700">
                                {title ? (
                                  <>
                                    <strong className="block text-slate-900 font-extrabold mb-0.5">
                                      {title}
                                    </strong>
                                    <span className="text-slate-600">{desc}</span>
                                  </>
                                ) : (
                                  <span className="text-slate-700">{desc}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Section 2: Pilihan Skema Kerjasama & Delivery (Interactive Switcher) */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Roadmap & Tahapan Milestone Pengembangan
                </h2>
                <p className="text-xs text-slate-500">
                  Tahapan delivery terukur dari fondasi operasional cabang hingga ekspansi multi-brand & ekosistem pelanggan
                </p>
              </div>
            </div>
          </div>

          {/* Kartu Utama Milestone Pengembangan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    Phased Rollout Delivery
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    3 Milestone Terintegrasi
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Implementasi Bertahap per Milestone
                </h3>
                <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
                  Pengembangan sistem dibagi menjadi 3 milestone terukur dengan serah terima bertahap per fase agar operasional kafe langsung dapat menggunakan modul inti tanpa menunggu seluruh sistem selesai dibangun.
                </p>
              </div>
            </div>

            {/* Grid 3 Milestone */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fase 1 (Core)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    2.5 - 3 Bulan
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 my-1.5">
                  Milestone 1 (Fondasi)
                </div>
                <div className="mt-2.5 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>ERP Backoffice & Finance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>POS Kasir Tablet Counter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>KDS Layar Barista Dapur</span>
                    <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Outlet Besar
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>App Operasi Outlet (Manager)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>Integrasi Pendapatan POS &rarr; ERP</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fase 2 (Omni)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    2 Bulan
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 my-1.5">
                  Milestone 2 (Ekspansi)
                </div>
                <div className="mt-2.5 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>Mobile App Pelanggan (PWA)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>Online Pickup & Tracking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>CRM & Promo Panel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>Loyalty Point & E-Voucher</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fase 3 (Scale)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    1 - 1.5 Bulan
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 my-1.5">
                  Milestone 3 (Skalabilitas)
                </div>
                <div className="mt-2.5 text-[11px] text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>Portal Mitra / Investor Read-Only</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>Owner Executive Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>HR Shift Barista & GPS Mobile</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600,#C86D3B)] shrink-0" />
                    <span>White-Label Multi-Brand Engine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Serah Terima & Garansi */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-extrabold text-slate-900">
                  Standar Serah Terima Setiap Milestone:
                </div>
                <div className="text-slate-600 mt-0.5">
                  Setiap fase melalui tahapan pengujian langsung (<em>UAT</em>) di pilot outlet, pelatihan barista/manager, dan pendampingan <em>go-live</em> sebelum aktivasi modul berikutnya.
                </div>
              </div>
              <div className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Termasuk Garansi Bug 3 - 6 Bulan
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 print:hidden">
        <p>&copy; 2026 genossys & Kopi Seduhan Jodi. Seluruh hak cipta dilindungi undang-undang.</p>
      </footer>
    </div>
  );
};

export default ProposalApp;
