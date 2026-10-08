import React, { useState } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Users2,
  TrendingUp,
  DollarSign,
  PieChart,
  FileDown,
  Building,
  Info,
} from 'lucide-react';

export const PartnerApp: React.FC = () => {
  const { outlets, orders, stockLots, pettyCashExpenses } = useEcosystemStore();

  const partnerOutlets = outlets.filter((o) => o.type === 'partner');
  const [selectedOutletId, setSelectedOutletId] = useState<string>(partnerOutlets[0]?.id || 'outlet-sudirman');

  const selectedOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  // Financial summary for this outlet
  const outletOrders = orders.filter((o) => o.outletId === selectedOutletId);
  const totalGrossRevenue = outletOrders.reduce((sum, o) => sum + o.subtotal + o.appMarkupAmount, 0);
  const totalDiscounts = outletOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const totalNetSales = Math.max(0, totalGrossRevenue - totalDiscounts);

  // COGS & Expense for this outlet
  const confirmedLots = stockLots.filter(
    (l) => l.outletId === selectedOutletId && l.status === 'confirmed'
  );
  const awaitingLots = stockLots.filter(
    (l) => l.outletId === selectedOutletId && l.status === 'awaiting_invoice'
  );

  const approvedExpenses = pettyCashExpenses
    .filter((e) => e.outletId === selectedOutletId && e.status === 'APPROVED')
    .reduce((sum, e) => sum + e.amount, 0);

  // Estimasi HPP
  const estimatedHpp = Math.round(totalNetSales * 0.32); // ~32% food cost benchmark

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--text)] font-sans text-xs">
      {/* Top Header */}
      <div className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-700)] text-white flex items-center justify-center font-bold">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[var(--text)]">PORTAL MITRA / INVESTOR</div>
            <div className="text-[10px] text-gray-500 font-semibold">Mode Baca-Saja (Read-Only)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--surface-muted)] px-3 py-1.5 rounded-lg border">
            <span className="font-semibold text-gray-500">Pilih Outlet:</span>
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="bg-transparent font-bold outline-none cursor-pointer"
            >
              {partnerOutlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>

          <Button size="sm" variant="outline" className="flex items-center gap-1 font-bold">
            <FileDown className="w-3.5 h-3.5" /> Unduh PDF
          </Button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
        {/* Ownership Notice (BR-14) */}
        <div className="bg-[var(--surface-muted)] border border-[var(--border)] rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--brand-600)] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-[var(--text)]">Status Kepemilikan Gerai: </span>
            <Badge variant="neutral" className="ml-1 text-[10px]">
              Belum Diatur (Pending Agreement)
            </Badge>
            <p className="text-[11px] text-gray-600 mt-1">
              Sesuai kebijakan PRD (BR-14), persentase bagi hasil mitra sengaja ditunda dan tidak dihitung otomatis. Halaman ini hanya menampilkan transparansi omzet penjualan riil, status HPP bahan baku, dan pengeluaran biaya gerai.
            </p>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold block">Omzet Bersih Cabang</span>
            <span className="text-xl font-extrabold text-[var(--brand-700)] tabular-nums block mt-1">
              Rp {totalNetSales.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-[var(--success)] font-bold mt-1 block">
              {outletOrders.length} Pesanan Lunas
            </span>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold block">HPP Bahan Baku (COGS)</span>
            <span className="text-xl font-extrabold text-gray-800 tabular-nums block mt-1">
              Rp {estimatedHpp.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-gray-500 font-medium mt-1 block">
              ~32% Rasio HPP
            </span>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold block">Beban Kas Kecil Gerai</span>
            <span className="text-xl font-extrabold text-[var(--danger)] tabular-nums block mt-1">
              Rp {approvedExpenses.toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-gray-500 font-medium mt-1 block">
              Disetujui kantor pusat
            </span>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
            <span className="text-[11px] text-gray-500 font-semibold block">Estimasi Laba Operasional</span>
            <span className="text-xl font-extrabold text-[var(--success)] tabular-nums block mt-1">
              Rp {Math.max(0, totalNetSales - estimatedHpp - approvedExpenses).toLocaleString('id-ID')}
            </span>
            <span className="text-[10px] text-[var(--success)] font-bold mt-1 block">
              Laba kotor operasional
            </span>
          </div>
        </div>

        {/* HPP Audit & Accounting Status (BR-06) */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-extrabold text-sm text-[var(--text)]">
              Transparansi Status HPP Bahan Baku
            </h4>
            <div className="flex gap-2">
              <Badge variant="success">{confirmedLots.length} Lot Definitif (True-Up)</Badge>
              {awaitingLots.length > 0 && (
                <Badge variant="warning">{awaitingLots.length} Lot Sementara</Badge>
              )}
            </div>
          </div>

          <p className="text-[11px] text-gray-600">
            Seluruh mutasi pasokan kopi dan susu disajikan terbuka. Bahan berstatus "Definitif" sudah dikoreksi nilainya sesuai faktur nota asli yang diverifikasi Finance.
          </p>

          <div className="divide-y divide-[var(--border)]">
            {stockLots
              .filter((l) => l.outletId === selectedOutletId)
              .map((lot) => (
                <div key={lot.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[var(--text)]">{lot.ingredientId}</span>
                    <div className="text-[10px] text-gray-500">Diterima: {lot.receivedAt}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={lot.status === 'confirmed' ? 'success' : 'warning'}>
                      {lot.status === 'confirmed' ? 'HPP Terkoreksi Definitif' : 'HPP Sementara'}
                    </Badge>
                    <div className="font-mono font-bold text-gray-700 mt-1">
                      Rp {lot.unitCost.toFixed(1)} / unit
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
