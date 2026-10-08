import React, { useState } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent } from '../../domain/events';
import type { Voucher } from '../../domain/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Tag,
  Plus,
  Ticket,
  Smartphone,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const CrmApp: React.FC = () => {
  const { vouchers, outlets, dispatch } = useEcosystemStore();

  const [code, setCode] = useState<string>('PROMOHEMAT');
  const [title, setTitle] = useState<string>('Diskon Spesial Hari Ini');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(10000);
  const [minOrder, setMinOrder] = useState<number>(35000);
  const [scope, setScope] = useState<string>('global');

  const handleCreateVoucher = () => {
    const newVoucher: Voucher = {
      id: `vouch_${Date.now()}`,
      code: code.toUpperCase().trim(),
      title,
      discountType,
      discountValue,
      minOrderAmount: minOrder,
      scope,
      quota: 500,
      usedCount: 0,
      costBearer: scope === 'global' ? 'central' : 'outlet',
      validUntil: '2026-12-31',
      isActive: true,
    };

    dispatch(
      createEvent('VoucherCreated', 'Marketing CRM', { voucher: newVoucher })
    );

    alert(`Voucher ${newVoucher.code} berhasil diterbitkan!`);
  };

  return (
    <div className="flex h-full bg-[var(--bg)] text-[var(--text)] font-sans text-xs">
      {/* Left Form (60%) */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="text-base font-extrabold text-[var(--text)]">Panel Promo & CRM Marketing</h3>
            <p className="text-[11px] text-gray-500">Kelola kupon voucher diskon global maupun per outlet cabang (BR-11)</p>
          </div>
        </div>

        {/* Create voucher card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[var(--brand-600)]" />
            Buat Kupon Voucher Baru
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold block mb-1">Kode Kupon Voucher</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-2 border rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Judul Promosi</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-bold block mb-1">Tipe Diskon</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full p-2 border rounded-xl font-medium"
              >
                <option value="fixed">Nominal Rupiah (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Nilai Diskon</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Minimal Belanja (Rp)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded-xl font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">Cakupan Wilayah Gerai (Scope)</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full p-2 border rounded-xl font-bold text-xs"
            >
              <option value="global">Global (Berlaku di Seluruh Outlet)</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  Khusus Outlet: {o.name}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleCreateVoucher} size="md" className="w-full font-bold">
            Terbitkan Voucher ke Seluruh Aplikasi
          </Button>
        </div>

        {/* Existing Vouchers List */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-[var(--text)]">Daftar Voucher Aktif</h4>
          <div className="divide-y divide-[var(--border)]">
            {vouchers.map((v) => (
              <div key={v.id} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-[var(--brand-700)] text-xs">{v.code}</span>
                    <Badge variant={v.scope === 'global' ? 'brand' : 'info'} className="text-[9px]">
                      {v.scope === 'global' ? 'Global' : 'Spesifik Cabang'}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{v.title}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[var(--success)]">
                    {v.discountType === 'fixed'
                      ? `Potongan Rp ${v.discountValue.toLocaleString('id-ID')}`
                      : `Diskon ${v.discountValue}%`}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Terpakai: {v.usedCount} / {v.quota} kuota
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Phone Mockup Preview (40%) */}
      <div className="w-80 bg-[var(--surface-muted)]/60 border-l border-[var(--border)] p-6 flex flex-col items-center justify-center shrink-0">
        <div className="text-center mb-3">
          <span className="text-xs font-bold text-gray-500 flex items-center justify-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> Pratinjau Tampilan di HP Pelanggan
          </span>
        </div>

        {/* Miniature Phone Card Preview */}
        <div className="w-64 bg-white rounded-3xl p-4 shadow-xl border border-gray-200 space-y-3">
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            Kupon Saya di Checkout
          </div>
          <div className="bg-gradient-to-r from-[var(--brand-50)] to-amber-50 border border-[var(--brand-600)]/40 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center gap-1.5 text-[var(--brand-700)] font-extrabold text-xs">
              <Ticket className="w-3.5 h-3.5" /> {code}
            </div>
            <div className="font-bold text-xs text-gray-800 mt-1">{title}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">
              Min. belanja Rp {minOrder.toLocaleString('id-ID')}
            </div>
            <div className="mt-2 pt-2 border-t border-[var(--brand-600)]/20 flex justify-between items-center text-[10px]">
              <span className="text-gray-400">Berlaku s/d Des 2026</span>
              <span className="font-extrabold text-[var(--brand-700)]">Pasang</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
