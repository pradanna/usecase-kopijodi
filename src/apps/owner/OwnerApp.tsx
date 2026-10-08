import React from 'react';
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
} from 'lucide-react';

export const OwnerApp: React.FC = () => {
  const { outlets, orders, centralDebts, ingredients, stockLots } = useEcosystemStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalDebts = centralDebts.reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

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

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--text)] font-sans text-xs">
      {/* Top Header */}
      <div className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[var(--text)]">OWNER DASHBOARD</div>
            <div className="text-[10px] text-gray-500 font-semibold">Executive Cockpit Jaringan Kopi</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="brand">Konsolidasi 3 Cabang</Badge>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
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
      </div>
    </div>
  );
};
