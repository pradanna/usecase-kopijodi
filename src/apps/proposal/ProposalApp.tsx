import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Building2,
  DollarSign,
  Calendar,
  Check,
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
  AlertTriangle,
  TrendingDown,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ProposalApp: React.FC<{ onBackToDemo?: () => void }> = ({ onBackToDemo }) => {
  const [showPricing, setShowPricing] = useState<boolean>(false); // Default false: fokus fitur tanpa harga
  const [selectedTurnkeyPackage, setSelectedTurnkeyPackage] = useState<'bundling' | 'phase1' | 'phase2' | 'phase3'>('bundling');
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);
  const [comparisonOutletCount, setComparisonOutletCount] = useState<number>(5);

  // Daftar Modul
  const MODULES = [
    {
      id: 1,
      name: 'ERP Backoffice & Finance',
      role: 'Owner, Finance, Admin Pusat',
      device: 'Desktop Web Browser',
      icon: <Building2 className="w-5 h-5 text-indigo-600" />,
      phase: 'Fase 1 (Core)',
      features: [
        'Integrasi Real-Time POS ke ERP: Seluruh transaksi & pendapatan harian outlet (Tunai & QRIS) otomatis masuk ke jurnal pendapatan (Akun 4101) & buku kas pusat tanpa rekonsiliasi manual.',
        'Master 25+ bahan baku, kemasan, & resep racikan otomatis (BOM).',
        'Verifikasi nota supplier fisik & koreksi HPP retrospektif (True-Up HPP).',
        'Buku kas kecil outlet dengan sistem persetujuan bertingkat.',
        'Laporan laba/rugi, arus kas (cashflow), dan buku jurnal umum double-entry multi-cabang.',
        'Manajemen hutang outlet ke gudang pusat & aging piutang.',
      ],
    },
    {
      id: 2,
      name: 'POS Kasir Outlet',
      role: 'Kasir & Frontliner',
      device: 'Tablet Landscape Counter',
      icon: <Tablet className="w-5 h-5 text-amber-600" />,
      phase: 'Fase 1 (Core)',
      features: [
        'Sinkronisasi Pendapatan Otomatis: Setiap transaksi kasir langsung membukukan omzet ke ERP dan mencatat kas masuk secara instan.',
        'Buka & tutup shift kasir dengan audit kas laci fisik (cash count) & rekonsiliasi kasir otomatis.',
        'Kustomisasi varian (ukuran cup, takaran gula, opsi susu alternatif oatmilk).',
        'Pembayaran ganda: Tunai (auto kembalian) dan QRIS dinamis Midtrans.',
        'Bekerja online maupun offline (tetap bisa transaksi saat internet mati, auto-sync saat online).',
        'Cetak struk thermal bluetooth dan sinkronisasi instan ke KDS dapur.',
      ],
    },
    {
      id: 3,
      name: 'KDS Layar Barista',
      role: 'Head Barista & Dapur (Outlet Besar)',
      device: 'Monitor Dapur / Tablet (Flagship & Outlet Besar)',
      icon: <Monitor className="w-5 h-5 text-emerald-600" />,
      phase: 'Fase 1 (Core)',
      features: [
        'Diperuntukkan Khusus Outlet Besar / Flagship: Efektif untuk cabang dengan volume pesanan tinggi & area meja barista terpisah dari kasir.',
        'Fleksibel untuk Outlet Kecil/Booth: Pada gerai kecil atau booth express, KDS ini opsional — barista dapat bekerja langsung dari struk POS kasir.',
        'Antrean tiket pesanan real-time tanpa kertas bon fisik.',
        'Status progres per pesanan: Dalam Antrean -> Sedang Diracik -> Siap Diambil.',
        'Pemotongan stok bahan baku presisi dari resep saat pesanan selesai diracik.',
        'Timer SLA pembuatan minuman dengan indikator warna keterlambatan.',
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
      role: 'Pelanggan Kopi Jodi',
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
                {showPricing ? 'PROPOSAL RESMI & BIAYA' : 'PROPOSAL FITUR & TEKNOLOGI'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Kopi Jodi Ecosystem
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle Tampilkan / Sembunyikan Harga */}
            <button
              onClick={() => setShowPricing(!showPricing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                showPricing
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
              title={showPricing ? "Klik untuk sembunyikan rincian harga investasi" : "Klik untuk menampilkan angka investasi"}
            >
              {showPricing ? <EyeOff className="w-3.5 h-3.5 text-amber-700" /> : <Eye className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{showPricing ? 'Harga Aktif' : 'Fokus Fitur'}</span>
            </button>

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
              href="/Penawaran_Ekosistem_Kopi_Jodi.docx"
              download="Proposal_Fitur_Ekosistem_Kopi_Jodi.docx"
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

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-700/80 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {showPricing
                    ? 'Dokumen Resmi Penawaran Teknis & Komersial'
                    : 'Dokumen Resmi Presentasi Teknis & Solusi Ekosistem'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Pengembangan Ekosistem Aplikasi & ERP Multi-Outlet Kopi Jodi
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
                <span className="text-slate-400">Untuk Klien:</span> <strong className="text-white">Founder Kopi Jodi</strong>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-amber-400">8 Aplikasi</div>
              <div className="text-xs text-slate-300 mt-0.5">Satu Ekosistem Terpadu</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">100% Presisi</div>
              <div className="text-xs text-slate-300 mt-0.5">Potong Stok Berbasis BOM</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-blue-400">True-Up HPP</div>
              <div className="text-xs text-slate-300 mt-0.5">Koreksi Margin Retrospektif</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-rose-400">Zero Leakage</div>
              <div className="text-xs text-slate-300 mt-0.5">Approval Kas Bertingkat</div>
            </div>
          </div>
        </div>

        {/* Section 1: Masalah & Solusi */}
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Tantangan Operasional & Solusi Terintegrasi</h2>
              <p className="text-xs text-slate-500">Mencegah kebocoran profit dan memastikan skalabilitas cabang Kopi Jodi</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Masalah */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>Masalah Nyata Coffee Shop Multi-Outlet:</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Kebocoran Stok Bahan Baku:</strong> Pemakaian susu, biji kopi, sirup, dan cup tidak pernah cocok dengan laporan penjualan kasir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>HPP Bias & Laba Semu:</strong> Nota pembelian fisik dari supplier sering terlambat masuk ke Finance, membuat laporan margin tidak akurat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Fraud Kas Kecil (Petty Cash):</strong> Belanja lokal darurat oleh cabang rawan penyalahgunaan tanpa approval limit bertingkat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Rekapitulasi Omzet Kasir Manual:</strong> Laporan penjualan outlet harus direkap manual tiap malam, rawan selisih kas fisik dan lambat masuk pembukuan pusat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span><strong>Kehilangan Loyalitas Pelanggan:</strong> Antrean kasir panjang saat jam sibuk dan tidak ada platform digital untuk pesan pick-up mandiri.</span>
                </li>
              </ul>
            </div>

            {/* Solusi genossys */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Solusi Ekosistem Kopi Jodi oleh genossys:</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>Auto-Deduct Berbasis Resep (BOM):</strong> Begitu pesanan selesai di KDS Barista, gramasi kopi & ml susu langsung terpotong akurat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>True-Up HPP Otomatis:</strong> Saat nota diverifikasi Finance, sistem mengoreksi HPP minuman yang sudah terjual secara retrospektif.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>Integrasi Otomatis POS &rarr; ERP:</strong> Pendapatan transaksi outlet (Tunai & QRIS) otomatis terjurnal real-time ke akun pendapatan & kas ERP pusat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>Governance Kas Kecil Multi-Tier:</strong> Limit belanja tanpa persetujuan diatur ketat; nominal besar wajib approval Finance & Owner.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>Omni-Channel Customer Experience:</strong> Pelanggan dapat memesan lewat smartphone (PWA) sebelum tiba di outlet dengan QRIS instan.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Cakupan 8 Modul & Ekosistem */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                02
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
                  onClick={() => setActiveModuleTab(idx)}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">{current.name}</h3>
                          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                            {current.phase}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <strong>Pengguna:</strong> {current.role} &bull; <strong>Platform:</strong> {current.device}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {current.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Section 3: Pilihan Skema Kerjasama & Delivery (Interactive Switcher) */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {showPricing ? 'Investasi & Tahapan Milestone Pengembangan' : 'Roadmap & Tahapan Milestone Pengembangan'}
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

              {showPricing && (
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Paket Bundling Seluruh Fase
                  </span>
                  <div className="text-2xl font-black text-emerald-700">Rp 135.000.000</div>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Hemat Rp 15.000.000,- (Dari Total Rp 150 Jt)
                  </span>
                </div>
              )}
            </div>

            {/* Grid 3 Milestone */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div
                onClick={() => setSelectedTurnkeyPackage('phase1')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTurnkeyPackage === 'phase1'
                    ? 'border-[var(--brand-600,#C86D3B)] bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fase 1 (Core)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    2.5 - 3 Bulan
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 my-1.5">
                  Milestone 1 (Fondasi)
                </div>
                {showPricing && (
                  <div className="text-sm font-black text-emerald-700 mb-1">
                    Rp 75.000.000
                  </div>
                )}
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

              <div
                onClick={() => setSelectedTurnkeyPackage('phase2')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTurnkeyPackage === 'phase2'
                    ? 'border-[var(--brand-600,#C86D3B)] bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fase 2 (Omni)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    2 Bulan
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 my-1.5">
                  Milestone 2 (Ekspansi)
                </div>
                {showPricing && (
                  <div className="text-sm font-black text-emerald-700 mb-1">
                    Rp 48.000.000
                  </div>
                )}
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

              <div
                onClick={() => setSelectedTurnkeyPackage('phase3')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTurnkeyPackage === 'phase3'
                    ? 'border-[var(--brand-600,#C86D3B)] bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Fase 3 (Scale)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    1 - 1.5 Bulan
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 my-1.5">
                  Milestone 3 (Skalabilitas)
                </div>
                {showPricing && (
                  <div className="text-sm font-black text-emerald-700 mb-1">
                    Rp 27.000.000
                  </div>
                )}
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
                  {showPricing ? 'Termin Serah Terima & Pembayaran:' : 'Standar Serah Terima Setiap Milestone:'}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {showPricing ? (
                    <>
                      <strong>Termin 1 (30%)</strong> Kickoff & Desain &rarr; <strong>Termin 2 (40%)</strong> Modul Siap UAT Outlet &rarr; <strong>Termin 3 (30%)</strong> Go-Live & Training Selesai.
                    </>
                  ) : (
                    <>
                      Setiap fase melalui tahapan pengujian langsung (*UAT*) di pilot outlet, pelatihan barista/manager, dan pendampingan *go-live* sebelum aktivasi modul berikutnya.
                    </>
                  )}
                </div>
              </div>
              <div className="text-emerald-700 font-bold shrink-0 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                Termasuk Garansi Bug 3 - 6 Bulan
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Komparasi Strategis Kopi Jodi vs Sewa Moka POS per Outlet */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Analisis Strategis: Keunggulan Kopi Jodi vs Sewa Moka POS per Outlet
                </h2>
                <p className="text-xs text-slate-500">
                  Mengapa menyewa POS retail umum per outlet membebani ekspansi cabang, dan bagaimana Kopi Jodi menghemat ratusan juta
                </p>
              </div>
            </div>

            {/* Outlet Selector Slider / Quick Select */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600">Simulasi Cabang:</span>
              {[3, 5, 10, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setComparisonOutletCount(num)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    comparisonOutletCount === num
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {num} Outlet
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Cost Simulation Cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Sisi Moka POS */}
            <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                    Model Sewa POS Retail Umum (Moka POS)
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    Biaya Membengkak per Penambahan Outlet
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-rose-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Biaya Lisensi Dasar ({comparisonOutletCount} outlet):</span>
                  <span className="font-bold">
                    {showPricing
                      ? `Rp ${(comparisonOutletCount * 299000).toLocaleString('id-ID')} /bln`
                      : `Dihitung per outlet baru (~Rp 299rb x ${comparisonOutletCount} gerai)`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Add-on Wajib Kafe (KDS Dapur, Moka Order, BOM Inventory):</span>
                  <span className="font-bold">
                    {showPricing
                      ? `Rp ${(comparisonOutletCount * 200000).toLocaleString('id-ID')} /bln`
                      : `Dihitung per perangkat lisensi (~Rp 200rb x ${comparisonOutletCount} gerai)`}
                  </span>
                </div>
                <div className="pt-2 border-t border-rose-200 flex justify-between items-center text-rose-900">
                  <span className="text-xs font-bold">Total Biaya Sewa ({comparisonOutletCount} Outlet):</span>
                  {showPricing ? (
                    <span className="text-lg font-black">
                      Rp {(comparisonOutletCount * 499000).toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/bln</span>
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold text-rose-800">
                      Membengkak {comparisonOutletCount}x Lipat Setiap Bulan
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Estimasi Biaya 5 Tahun:</span>
                  <span className="font-extrabold text-rose-700">
                    {showPricing
                      ? `Rp ${(comparisonOutletCount * 499000 * 60).toLocaleString('id-ID')},-`
                      : 'Akumulasi Ratusan Juta (Uang Hangus Tanpa Hak Milik)'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Hanya Mendapat Kasir Standar:</strong> Tidak termasuk Mobile App Pelanggan (PWA) resmi Kopi Jodi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Terkena Komisi Ojol 20-30%:</strong> Karena tidak ada App Pelanggan sendiri, pesanan online tetap bergantung pada GrabFood/GoFood.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>Uang Sewa Hangus:</strong> Membayar puluhan hingga ratusan juta tanpa memiliki source code atau aset teknologi.</span>
                </div>
              </div>
            </div>

            {/* Sisi Kopi Jodi Ecosystem */}
            <div className="bg-emerald-50/60 border border-emerald-300 rounded-3xl p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ekosistem Kopi Jodi (genossys)
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    Biaya Flat Bebas Berapapun Jumlah Outlet
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-4 border border-emerald-300 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Biaya Lisensi per Outlet Baru:</span>
                  <span className="font-extrabold text-emerald-700">Rp 0,- (GRATIS Selamanya)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Skema Dedicated Programmer:</span>
                  <span className="font-bold text-emerald-900">
                    {showPricing
                      ? 'Rp 5.000.000 /bln (FLAT untuk SEMUA CABANG)'
                      : 'Biaya Flat untuk SEMUA Cabang (Bebas Tambah Gerai)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-emerald-900">
                  <span className="text-xs font-bold">Biaya per Outlet pada {comparisonOutletCount} Cabang:</span>
                  {showPricing ? (
                    <span className="text-lg font-black text-emerald-700">
                      Rp {Math.round(5000000 / comparisonOutletCount).toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">/outlet/bln</span>
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold text-emerald-700">
                      Semakin Banyak Cabang, Semakin Murah Mendekati Nol
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Opsi Beli Putus (Turnkey Sekali Bayar):</span>
                  <span className="font-extrabold text-emerald-800">
                    {showPricing
                      ? 'Rp 135.000.000,- (Lunas Selamanya)'
                      : 'Lunas Selamanya & 100% Hak Milik Source Code'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>8 Aplikasi Lengkap Sekaligus:</strong> Sudah termasuk App Pelanggan (PWA), KDS Barista, ERP Backoffice, dan Portal Investor.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>Hemat Komisi Ojol 20-30%:</strong> Pelanggan pesan langsung via App Kopi Jodi tanpa potongan komisi pihak ketiga.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                  <span><strong>100% Hak Milik Source Code:</strong> Menjadi aset teknologi berharga yang melipatgandakan valuasi perusahaan Kopi Jodi.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Komparasi Head-to-Head 10 Aspek */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 font-extrabold text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200 flex items-center justify-between">
              <span>Tabel Komparasi Fitur & Kapabilitas: Kopi Jodi vs Sewa Moka POS</span>
              <span className="text-[10px] text-slate-500 font-normal">Standardisasi Jaringan Kafe Modern</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-1/4">Aspek Perbandingan</th>
                    <th className="p-3 w-3/8 text-rose-800 bg-rose-50/40">Sewa Moka POS per Outlet</th>
                    <th className="p-3 w-3/8 text-emerald-900 bg-emerald-50/60">Ekosistem Terintegrasi Kopi Jodi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">1. Skalabilitas Biaya Multi-Cabang</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Membengkak:</strong> Dikenakan biaya per outlet. Buka 10 cabang = bayar 10x lipat biaya sewa setiap bulan selamanya.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Biaya Flat:</strong> Mau 3, 10, 20, atau 50 cabang, biaya software Rp 0 per cabang tambahan. Semakin banyak cabang, biaya per outlet semakin murah mendekati nol.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">2. Mobile App Pelanggan (PWA Brand Sendiri)</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Tidak Ada:</strong> Pelanggan tidak punya aplikasi khusus Kopi Jodi. Harus antre fisik di kasir atau kafe dipotong komisi 20-30% oleh GoFood/GrabFood.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Tersedia (PWA iOS & Android):</strong> Pelanggan pesan pick-up tanpa antre, bayar QRIS instan, kustomisasi rasa, kumpulkan poin loyalty. Zero potongan komisi ojol!
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">3. Koreksi HPP Retrospektif (True-Up HPP)</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Tidak Ada:</strong> HPP statis. Jika nota fisik supplier terlambat dan harga susu naik, Moka tidak bisa mengoreksi HPP pesanan yang sudah terlanjur terjual. Muncul laba semu.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Otomatis (BR-06):</strong> Begitu nota riil diverifikasi Finance, sistem otomatis menghitung ulang HPP pesanan yang sudah terjual secara retrospektif. Laporan laba 100% akurat.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">4. Pemotongan Stok Berbasis Resep Dapur</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Di Kasir:</strong> Stok terpotong saat kasir klik bayar, bukan saat barista selesai meracik. Sering terjadi selisih stok jika ada pembatalan di meja racik.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Di KDS Barista / POS (BR-12):</strong> Untuk outlet besar, stok bahan baku (gramasi espresso, ml susu, sirup) terpotong presisi saat barista menyelesaikan tiket pesanan di layar KDS dapur; untuk gerai booth kecil otomatis terpotong saat transaksi kasir selesai.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">5. Resep Olahan Dapur (Semi-Finished Prep)</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Terbatas Bahan Mentah:</strong> Tidak mendukung resep olahan batch dapur sebelum buka (simple syrup aren batch 1.2L, cold brew 24 jam, topping jelly).
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Mendukung Penuh:</strong> Modul Racikan R&D mengelola resep batch olahan, kuantitas yield, shelf-life chiller, dan HPP bahan olahan per ml.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">6. Kontrol Kas Kecil & Pencegahan Fraud</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Pencatatan Biasa:</strong> Tanpa batas persetujuan berjenjang otomatis. Rawan belanja lokal tanpa kontrol.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Multi-Tier Approval Otomatis:</strong> Limit belanja tanpa approval diatur ketat; pengeluaran besar wajib approval Finance & Owner dengan foto nota fisik.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">7. Transparansi Portal Investor Mitra</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Tidak Ada:</strong> Owner harus repot menarik data Excel secara manual dan mengirimnya satu per satu ke setiap investor cabang.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Portal Mitra Read-Only:</strong> Investor cabang dapat memantau omzet harian, HPP riil, dan estimasi bagi hasil secara transparan tanpa risiko merusak data.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">8. Status Kepemilikan & Aset Perusahaan</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Hanya Sewa (Rental):</strong> Jika berhenti langganan, seluruh akses mati. Perusahaan tidak memiliki nilai aset teknologi sama sekali.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>100% Hak Milik Kopi Jodi:</strong> Seluruh source code, database, dan arsitektur adalah aset intelektual milik Kopi Jodi yang menaikkan valuasi bisnis di mata investor.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">9. Kustomisasi & Tambah Fitur Baru</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Terkunci & Mustahil:</strong> Moka adalah software massal retail umum. Request fitur khusus dari satu kafe tidak akan dibuatkan.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Bebas 100% (*Unlimited*):</strong> Kopi Jodi bebas meminta fitur baru, format laporan khusus, promo unik, atau integrasi apapun tanpa biaya tambahan (*zero change request fee*).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">10. White-Label & Citra Merek (Branding)</td>
                    <td className="p-3 text-slate-700 bg-rose-50/20">
                      <strong>Citra Standar UKM:</strong> Pelanggan dan investor melihat logo Moka di struk dan sistem.
                    </td>
                    <td className="p-3 font-bold text-emerald-800 bg-emerald-50/30">
                      <strong>Citra Korporasi Modern:</strong> 100% brand Kopi Jodi di seluruh perangkat (setara teknologi Fore Coffee / Kopi Kenangan).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 Kesimpulan Finansial Kunci */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs">
                <DollarSign className="w-4 h-4" />
                <span>Penghematan Komisi Ojol (20-30%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jika 1 gerai meraih omzet online Rp 30 Juta/bln di GoFood, potongan komisinya mencapai Rp 6-9 Juta/bln per gerai. Dengan App Pelanggan Kopi Jodi sendiri, omzet tersebut utuh 100%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Kebocoran Stok & Fraud Kas</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-deduct BOM di KDS dan approval kas kecil multi-tier menyelamatkan potensi kehilangan bahan baku dan uang tunai senilai 5-10% omzet kafe setiap bulannya.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs">
                <Award className="w-4 h-4" />
                <span>Valuasi Bisnis Waralaba Melonjak</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calon investor waralaba/mitra cabang akan jauh lebih yakin bergabung karena Kopi Jodi memiliki ekosistem teknologi mandiri yang terbukti transparan dan terstandarisasi.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Estimasi Biaya Pihak Ketiga (Infrastruktur & Lisensi) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              05
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Estimasi Kebutuhan Pihak Ketiga (Infrastruktur & Lisensi)</h2>
              <p className="text-xs text-slate-500">Layanan resmi yang dihubungkan langsung ke platform Kopi Jodi (transparan tanpa markup)</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Cloud Server & Database</div>
              <div className="font-extrabold text-slate-900 text-sm">DigitalOcean / Lightsail</div>
              <div className="text-amber-700 font-black text-xs">
                {showPricing ? 'Rp 600rb - 1.2jt / bln' : 'At-Cost Sesuai Beban Cabang'}
              </div>
              <p className="text-[10px] text-slate-500">Langsung dibayar ke provider</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Payment Gateway QRIS</div>
              <div className="font-extrabold text-slate-900 text-sm">Midtrans Indonesia</div>
              <div className="text-emerald-700 font-black text-xs">
                Tarif Bank Indonesia (0.7%)
              </div>
              <p className="text-[10px] text-slate-500">Tanpa biaya bulanan / setup</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Google Play Developer</div>
              <div className="font-extrabold text-slate-900 text-sm">Google Play Store</div>
              <div className="text-blue-700 font-black text-xs">
                {showPricing ? '$25 USD (~Rp 400rb)' : 'Lisensi Resmi Akun Google ($25 Sekali)'}
              </div>
              <p className="text-[10px] text-slate-500">Sekali bayar seumur hidup</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">Apple Developer Program</div>
              <div className="font-extrabold text-slate-900 text-sm">Apple App Store (iOS)</div>
              <div className="text-purple-700 font-black text-xs">
                {showPricing ? '$99 USD (~Rp 1.6jt/thn)' : 'Lisensi Resmi Apple ($99/thn)'}
              </div>
              <p className="text-[10px] text-slate-500">Lisensi tahunan resmi Apple</p>
            </div>
          </div>
        </section>

        {/* Section 6: Timeline Pengerjaan Fase 1 (12 Minggu) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              06
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Timeline Implementasi Fase 1 (12 Minggu)</h2>
              <p className="text-xs text-slate-500">Roadmap terstruktur dari perancangan hingga go-live di pilot outlet</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {[
                { week: 'M1 - M2', title: 'Perancangan & Resep', desc: 'Finalisasi alur operasional kafe, master resep BOM, skema database, dan UI/UX.' },
                { week: 'M3 - M8', title: 'Core Development', desc: 'Pembuatan ERP Backoffice, POS Kasir Tablet, KDS Barista, dan Mobile Ops Manager.' },
                { week: 'M9 - M10', title: 'Integrasi Hardware', desc: 'Pemasangan printer thermal bluetooth, QRIS gateway, dan stress-testing sistem.' },
                { week: 'M11', title: 'UAT di Pilot Outlet', desc: 'Pengujian lapangan di 1 gerai fisik Kopi Jodi dengan transaksi sesungguhnya.' },
                { week: 'M12', title: 'Training & Go-Live', desc: 'Pelatihan staf barista, kasir, store manager, serah terima, dan peluncuran resmi.' },
              ].map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {step.week}
                  </span>
                  <div className="font-extrabold text-slate-900 text-xs mt-2">{step.title}</div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Lembar Persetujuan & Konfirmasi */}
        <section className="bg-white rounded-3xl border border-slate-300 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              07
            </div>
            <h2 className="text-xl font-black text-slate-900">Lembar Konfirmasi & Penandatanganan</h2>
          </div>
          <div className="text-center max-w-lg mx-auto">
            <p className="text-xs text-slate-500">
              Silakan konfirmasi pilihan skema kerjasama untuk penerbitan Surat Perjanjian Kerjasama (SPK)
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-center space-y-1.5">
            <div className="font-extrabold text-slate-900 text-sm">
              Konfirmasi Ruang Lingkup & Milestone Ekosistem Kopi Jodi
            </div>
            <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
              {showPricing
                ? 'Paket Bundling Penuh (Milestone 1, 2, dan 3): Rp 135.000.000,- dengan serah terima bertahap per fase, pelatihan staf, garansi bug 6 bulan, dan penyerahan seluruh source code.'
                : 'Mencakup pengembangan bertahap 3 Milestone (Fase 1 Fondasi, Fase 2 Ekspansi, Fase 3 Skalabilitas) untuk 8 modul aplikasi terpadu, serah terima berkala per fase, dan garansi bug penuh.'}
            </p>
          </div>

          {/* Tanda Tangan */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 max-w-2xl mx-auto text-center text-xs">
            <div className="space-y-16">
              <div>
                <div className="text-slate-400 uppercase text-[10px] font-bold">Disetujui Oleh (Klien)</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">Manajemen Kopi Jodi</div>
              </div>
              <div>
                <div className="border-b border-slate-400 w-44 mx-auto" />
                <div className="font-bold text-slate-800 mt-1.5">( _______________________ )</div>
                <div className="text-[11px] text-slate-500">Direktur / Founder Kopi Jodi</div>
              </div>
            </div>

            <div className="space-y-16">
              <div>
                <div className="text-slate-400 uppercase text-[10px] font-bold">Disiapkan Oleh (Pengembang)</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">genossys</div>
                <div className="text-[10px] text-slate-500">Email: genossys2019@gmail.com</div>
              </div>
              <div>
                <div className="border-b border-slate-400 w-44 mx-auto" />
                <div className="font-bold text-slate-800 mt-1.5">Pradana Mahendra</div>
                <div className="text-[11px] text-slate-500">Lead Solution Architect</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 print:hidden">
        <p>&copy; 2026 genossys & Kopi Jodi. Seluruh hak cipta dilindungi undang-undang.</p>
      </footer>
    </div>
  );
};

export default ProposalApp;
