import React, { useState, useEffect } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Crown,
  TrendingUp,
  Store,
  AlertTriangle,
  Award,
  ShieldCheck,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  Coffee,
  DollarSign,
  Calendar,
  Check,
  X,
  Sparkles,
  ChevronRight,
  UserCheck,
  Timer,
  Zap,
} from 'lucide-react';

export type OwnerTab = 'cockpit' | 'hr' | 'approvals';

export interface OwnerAppProps {
  initialTab?: OwnerTab;
}

export const OwnerApp: React.FC<OwnerAppProps> = ({ initialTab = 'cockpit' }) => {
  const {
    outlets,
    orders,
    centralDebts,
    ingredients,
    stockLots,
    employees,
    baristaShifts,
    dispatch,
  } = useEcosystemStore();

  const [activeTab, setActiveTab] = useState<OwnerTab>(initialTab);
  const [selectedOutletFilter, setSelectedOutletFilter] = useState<string>('all');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalDebts = centralDebts.reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  // Filtered employees & shifts
  const filteredEmployees = employees.filter(
    (e) => selectedOutletFilter === 'all' || e.outletId === selectedOutletFilter
  );
  const filteredShifts = baristaShifts.filter(
    (s) => selectedOutletFilter === 'all' || s.outletId === selectedOutletFilter
  );

  // Revenue per outlet
  const outletLeaderboard = outlets.map((outlet) => {
    const outletOrders = orders.filter((o) => o.outletId === outlet.id);
    const revenue = outletOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      ...outlet,
      revenue,
      orderCount: outletOrders.length,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Total cups made today
  const totalCupsToday = baristaShifts.reduce((sum, s) => sum + s.cupsCompleted, 0);

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--text)] font-sans text-xs">
      {/* Top Header */}
      <div className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[var(--text)]">OWNER DASHBOARD & HR</div>
            <div className="text-[10px] text-gray-500 font-semibold">Executive Cockpit Jaringan Kopi Jodi</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-[var(--surface-muted)] p-1 rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cockpit'
                ? 'bg-[var(--surface)] text-[var(--brand-700)] shadow-xs font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            📊 Ikhtisar Bisnis
          </button>
          <button
            onClick={() => setActiveTab('hr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hr'
                ? 'bg-[var(--surface)] text-[var(--brand-700)] shadow-xs font-extrabold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>HR & Shift Barista</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
              {baristaShifts.filter((s) => s.status === 'CLOCKED_IN').length} Aktif
            </span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
        {activeTab === 'cockpit' ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Total Omzet Konsolidasi</span>
                <span className="text-2xl font-extrabold text-[var(--brand-700)] tabular-nums block mt-1">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-[var(--success)] font-bold mt-1 block">
                  {orders.length} total pesanan lunas
                </span>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Rata-rata Margin Kotor</span>
                <span className="text-2xl font-extrabold text-[var(--success)] tabular-nums block mt-1">
                  68,4%
                </span>
                <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                  Sehat di atas target (min. 60%)
                </span>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Total Piutang Bahan Pusat</span>
                <span className="text-2xl font-extrabold text-[var(--danger)] tabular-nums block mt-1">
                  Rp {totalDebts.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-gray-500 font-medium mt-1 block">
                  Kewajiban gerai cabang
                </span>
              </div>
            </div>

            {/* Branch Leaderboard */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <h4 className="font-extrabold text-sm text-[var(--text)]">Peringkat Kinerja Gerai (Leaderboard)</h4>
                </div>
                <span className="text-[11px] text-gray-500">Berdasarkan total omzet</span>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {outletLeaderboard.map((item, idx) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--surface-muted)] text-[var(--brand-700)] flex items-center justify-center font-extrabold text-xs">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-[var(--text)]">{item.name}</div>
                        <div className="text-[10px] text-gray-500">
                          Tipe: {item.type === 'own' ? 'Milik Sendiri (Own Store)' : 'Kemitraan (Mitra)'} • {item.orderCount} transaksi
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-[var(--brand-700)] text-sm tabular-nums">
                        Rp {item.revenue.toLocaleString('id-ID')}
                      </div>
                      <Badge variant={item.type === 'own' ? 'brand' : 'neutral'} className="text-[9px]">
                        {item.type === 'own' ? 'Own Store' : 'Partner Store'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk & Early Warnings */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                <h4 className="font-extrabold text-sm text-[var(--text)]">Pusat Peringatan Dini Eksekutif (Alerts)</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex justify-between items-center">
                  <div>
                    <span className="font-bold block">Peringatan Kebutuhan Pasokan Bahan:</span>
                    <span className="text-[11px]">Gerai Sudirman memiliki konsumsi susu mendekati ambang batas minimum.</span>
                  </div>
                  <Badge variant="warning">Perhatian</Badge>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* TAB 2: HR & MANAJEMEN BARISTA MULTI-CABANG */
          <div className="space-y-6">
            {/* Filter Outlet & Summary Cards */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)]">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Manajemen SDM & Shift Barista</h3>
                <p className="text-[11px] text-gray-500">Presensi Geofencing GPS, Target Cup/Hari, & Evaluasi Kecepatan Racik</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Pilih Gerai:</span>
                <select
                  value={selectedOutletFilter}
                  onChange={(e) => setSelectedOutletFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-white text-xs font-bold focus:outline-none"
                >
                  <option value="all">Semua Cabang (3 Gerai)</option>
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3 HR Metrics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-semibold">Barista On-Duty Hari Ini</span>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {baristaShifts.filter((s) => s.status === 'CLOCKED_IN').length} / {employees.filter((e) => e.role.includes('Barista')).length}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                  100% presensi GPS terverifikasi
                </span>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-semibold">Total Cup Dihasilkan</span>
                  <Coffee className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-amber-700 mt-1 block">
                  {totalCupsToday} Cup
                </span>
                <span className="text-[10px] text-gray-500 font-medium block mt-1">
                  Rata-rata 138 detik per cup di KDS
                </span>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-semibold">Estimasi Insentif Harian</span>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-2xl font-black text-blue-700 mt-1 block">
                  Rp 350.000
                </span>
                <span className="text-[10px] text-blue-700 font-bold block mt-1">
                  Bonus pencapaian target cup tim
                </span>
              </div>
            </div>

            {/* Live Shift Attendance Table */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-extrabold text-sm text-[var(--text)]">
                    Jadwal Shift & Presensi Geofencing GPS Live
                  </h4>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Radius Geofencing: 50 Meter</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--surface-muted)] text-gray-500 font-bold border-b border-[var(--border)]">
                    <tr>
                      <th className="p-3">Nama Barista & Outlet</th>
                      <th className="p-3">Shift Kerja</th>
                      <th className="p-3">Status Presensi</th>
                      <th className="p-3">Validasi GPS Geofence</th>
                      <th className="p-3">Output Cup Hari Ini</th>
                      <th className="p-3">Rata-rata SLA</th>
                      <th className="p-3 text-right">Skor Performa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredShifts.map((shift) => {
                      const outlet = outlets.find((o) => o.id === shift.outletId);
                      return (
                        <tr key={shift.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <div className="font-extrabold text-slate-900">{shift.employeeName}</div>
                            <div className="text-[10px] text-gray-500">{outlet ? outlet.name : shift.outletId}</div>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {shift.shiftType}
                          </td>
                          <td className="p-3">
                            {shift.status === 'CLOCKED_IN' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Hadir ({shift.clockInTime})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                Terjadwal
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {shift.gpsDistanceMeters !== undefined ? (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{shift.gpsDistanceMeters}m dari kasir (Valid)</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="font-black text-slate-900">{shift.cupsCompleted} Cup</span>
                          </td>
                          <td className="p-3 text-slate-600">
                            {shift.avgSecondsPerCup > 0 ? `${shift.avgSecondsPerCup} dtk / cup` : '-'}
                          </td>
                          <td className="p-3 text-right">
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                              {shift.performanceScore}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Master Karyawan & Payroll Preview */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-extrabold text-sm text-[var(--text)]">
                    Master Karyawan & Estimasi Gaji Pokok
                  </h4>
                </div>
                <span className="text-[11px] text-gray-500">Total {filteredEmployees.length} Karyawan</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredEmployees.map((emp) => {
                  const outlet = outlets.find((o) => o.id === emp.outletId);
                  return (
                    <div key={emp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-black text-slate-900 text-xs">{emp.name}</div>
                          <div className="text-[10px] text-gray-500 font-semibold">{emp.role} &bull; {outlet?.name}</div>
                        </div>
                        <Badge variant="neutral" className="text-[9px]">{emp.status}</Badge>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                        <span className="text-gray-500">Gaji Pokok:</span>
                        <span className="font-extrabold text-slate-900">Rp {emp.baseSalary.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500">
                        <span>Target Harian:</span>
                        <span className="font-bold text-amber-700">{emp.dailyTargetCups > 0 ? `${emp.dailyTargetCups} Cup / hari` : 'Manajerial'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerApp;
