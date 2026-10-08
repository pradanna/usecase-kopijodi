import React, { useState } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent } from '../../domain/events';
import type { PurchaseOrder, GoodsReceipt, PettyCashExpense, LocalMenuProposal } from '../../domain/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Boxes,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  Plus,
  PackageCheck,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  X,
  FileText,
  Users,
  MapPin,
  UserCheck,
} from 'lucide-react';

export const OpsApp: React.FC = () => {
  const {
    outlets,
    ingredients,
    stockLots,
    purchaseOrders,
    pettyCashExpenses,
    orders,
    employees,
    baristaShifts,
    dispatch,
  } = useEcosystemStore();

  const [selectedOutletId, setSelectedOutletId] = useState<string>('outlet-sudirman');
  const [activeTab, setActiveTab] = useState<'beranda' | 'stok' | 'po' | 'kas' | 'menu' | 'shift'>('beranda');

  // Modal states
  const [isPoModalOpen, setIsPoModalOpen] = useState<boolean>(false);
  const [poItems, setPoItems] = useState<{ ingredientId: string; qty: number }[]>([
    { ingredientId: 'ing-susu-fresh', qty: 2 }, // 2 karton = 24L
  ]);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [activePoForReceipt, setActivePoForReceipt] = useState<PurchaseOrder | null>(null);

  const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState<boolean>(false);
  const [pettyAmount, setPettyAmount] = useState<number>(85000);
  const [pettyDesc, setPettyDesc] = useState<string>('Beli es batu kristal 3 karung');

  const [isLocalMenuModalOpen, setIsLocalMenuModalOpen] = useState<boolean>(false);
  const [localMenuName, setLocalMenuName] = useState<string>('Es Kopi Pandan Wangi');
  const [localMenuPrice, setLocalMenuPrice] = useState<number>(25000);

  const selectedOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  // Stock status for this outlet
  const outletLots = stockLots.filter((l) => l.outletId === selectedOutletId);

  // Today sales summary for this outlet
  const outletOrders = orders.filter((o) => o.outletId === selectedOutletId);
  const todayOmzet = outletOrders.reduce((sum, o) => sum + o.total, 0);

  // Critical stock list
  const criticalStockList = ingredients.map((ing) => {
    const lot = outletLots.find((l) => l.ingredientId === ing.id);
    const currentQty = lot ? lot.qty : 0;
    return {
      ...ing,
      currentQty,
      isLow: currentQty <= ing.minStock,
    };
  }).filter((i) => i.isLow);

  // POs for this outlet
  const outletPOs = purchaseOrders.filter((p) => p.outletId === selectedOutletId);

  // Submit PO without price (BR-04)
  const handleSubmitPo = () => {
    const newPoId = `po_${Date.now()}`;
    const items = poItems.map((pi) => {
      const ing = ingredients.find((i) => i.id === pi.ingredientId);
      return {
        ingredientId: pi.ingredientId,
        ingredientName: ing ? ing.name : pi.ingredientId,
        qty: pi.qty,
        uom: ing ? ing.purchaseUom : 'Karton',
      };
    });

    const newPO: PurchaseOrder = {
      id: newPoId,
      outletId: selectedOutletId,
      supplierType: 'central',
      items,
      status: 'REQUESTED',
      notes: 'Permintaan pasokan reguler gerai',
      createdAt: new Date().toLocaleTimeString('id-ID'),
    };

    dispatch(
      createEvent('PORequested', 'Store Manager (App Ops)', { po: newPO }, selectedOutletId)
    );

    // Auto-advance to SENT by central warehouse after 2 seconds for smooth demo
    setTimeout(() => {
      dispatch(
        createEvent('POSentToCentral', 'Gudang Pusat', { poId: newPoId }, selectedOutletId)
      );
    }, 2500);

    setIsPoModalOpen(false);
  };

  // Confirm goods receipt -> status 'awaiting_invoice' (BR-05)
  const handleConfirmReceipt = () => {
    if (!activePoForReceipt) return;

    const receiptItems = activePoForReceipt.items.map((it) => {
      const ing = ingredients.find((i) => i.id === it.ingredientId);
      const conversion = ing ? ing.conversionRatio : 1000;
      return {
        ingredientId: it.ingredientId,
        qtyReceived: it.qty * conversion, // into usageUom
      };
    });

    const receipt: GoodsReceipt = {
      id: `rcpt_${Date.now()}`,
      poId: activePoForReceipt.id,
      outletId: selectedOutletId,
      items: receiptItems,
      photoUrl: 'https://images.unsplash.com/photo-surat-jalan.jpg',
      receivedAt: new Date().toLocaleTimeString('id-ID'),
    };

    dispatch(
      createEvent(
        'GoodsReceived',
        'Store Manager (Goods Receipt)',
        { receipt },
        selectedOutletId
      )
    );

    setIsReceiptModalOpen(false);
    setActivePoForReceipt(null);
  };

  // Submit petty cash (BR-12)
  const handleSubmitPettyCash = () => {
    const expense: PettyCashExpense = {
      id: `exp_${Date.now()}`,
      outletId: selectedOutletId,
      amount: pettyAmount,
      category: 'Operasional Darurat',
      description: pettyDesc,
      status: pettyAmount <= selectedOutlet.pettyCashLimit ? 'APPROVED' : 'AWAITING_APPROVAL',
      createdAt: new Date().toLocaleTimeString('id-ID'),
    };

    dispatch(
      createEvent(
        'PettyCashSubmitted',
        'Store Manager',
        { expense },
        selectedOutletId
      )
    );

    setIsPettyCashModalOpen(false);
  };

  // Propose local menu (BR-09)
  const handleProposeLocalMenu = () => {
    const proposal: LocalMenuProposal = {
      id: `prop_${Date.now()}`,
      outletId: selectedOutletId,
      menuName: localMenuName,
      proposedPrice: localMenuPrice,
      category: 'Signature Coffee',
      recipe: [
        { ingredientId: 'ing-kopi-blend', qty: 18 },
        { ingredientId: 'ing-susu-fresh', qty: 110 },
        { ingredientId: 'ing-sirup-pandan', qty: 20 },
      ],
      reason: 'Banyak permintaan aroma pandan dari pelanggan perkantoran sekitar',
      status: 'PENDING',
      createdAt: new Date().toLocaleTimeString('id-ID'),
    };

    dispatch(
      createEvent(
        'LocalMenuProposed',
        'Store Manager',
        { proposal },
        selectedOutletId
      )
    );

    setIsLocalMenuModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--text)] select-none">
      {/* Top Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-700)] text-white flex items-center justify-center font-bold">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Store Manager App
              </div>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="text-xs font-bold text-[var(--brand-700)] bg-transparent outline-none cursor-pointer"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Badge variant="brand" className="text-[10px]">
            Shift Aktif
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'beranda' && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 shadow-xs">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold block">
                  Omzet Hari Ini
                </span>
                <span className="text-base font-extrabold text-[var(--brand-700)] tabular-nums block mt-0.5">
                  Rp {todayOmzet.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-[var(--success)] font-bold mt-1 block">
                  {outletOrders.length} transaksi
                </span>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 shadow-xs">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold block">
                  Batas Kas Bebas
                </span>
                <span className="text-base font-extrabold text-[var(--text)] tabular-nums block mt-0.5">
                  Rp {selectedOutlet.pettyCashLimit.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-medium block mt-1">
                  Plafon approval
                </span>
              </div>
            </div>

            {/* Critical Stock Alert Banner */}
            {criticalStockList.length > 0 && (
              <div className="bg-[var(--warning-light)] border-2 border-[var(--warning)]/50 rounded-2xl p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[var(--warning)] shrink-0" />
                  <span className="font-extrabold text-xs text-[var(--warning)]">
                    Peringatan: {criticalStockList.length} Bahan Menipis!
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] space-y-1 mb-2.5">
                  {criticalStockList.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>• {c.name}</span>
                      <span className="font-bold tabular-nums">
                        Sisa: {c.currentQty} {c.usageUom}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsPoModalOpen(true)}
                  className="w-full text-xs font-bold"
                >
                  + Buat PO Pengisian Cepat
                </Button>
              </div>
            )}

            {/* Pending Shipments Action */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[var(--text)]">Pengiriman Bahan Masuk</span>
                <Badge variant="neutral" className="text-[10px]">
                  {outletPOs.filter((p) => p.status === 'SENT').length} tiba
                </Badge>
              </div>

              {outletPOs.filter((p) => p.status === 'SENT').length === 0 ? (
                <div className="text-center py-4 text-xs text-[var(--text-muted)]">
                  Tidak ada pasokan barang dalam perjalanan
                </div>
              ) : (
                outletPOs
                  .filter((p) => p.status === 'SENT')
                  .map((po) => (
                    <div
                      key={po.id}
                      className="p-2.5 rounded-xl border border-[var(--info)]/40 bg-[var(--info-light)]/50 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-xs text-[var(--text)]">{po.id}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">
                          {po.items.map((it) => `${it.qty} ${it.uom} ${it.ingredientName}`).join(', ')}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => {
                          setActivePoForReceipt(po);
                          setIsReceiptModalOpen(true);
                        }}
                        className="text-xs font-bold"
                      >
                        Terima
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STOK BAHAN */}
        {activeTab === 'stok' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-[var(--text-secondary)]">
                Stok Fisik Bahan Gerai
              </span>
              <Button size="sm" onClick={() => setIsPoModalOpen(true)}>
                + Buat PO
              </Button>
            </div>

            <div className="divide-y divide-[var(--border)] bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3">
              {ingredients.map((ing) => {
                const lot = outletLots.find((l) => l.ingredientId === ing.id);
                const currentQty = lot ? lot.qty : 0;
                const isLow = currentQty <= ing.minStock;

                return (
                  <div key={ing.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-[var(--text)]">{ing.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Min. Safety: {ing.minStock} {ing.usageUom}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-extrabold tabular-nums ${isLow ? 'text-[var(--danger)]' : 'text-[var(--text)]'}`}>
                        {currentQty.toLocaleString('id-ID')} {ing.usageUom}
                      </div>
                      <Badge variant={isLow ? 'warning' : 'success'} className="text-[9px] py-0 px-1.5">
                        {isLow ? 'Menipis' : 'Aman'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PO & PENGADAAN */}
        {activeTab === 'po' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-[var(--text-secondary)]">Riwayat PO Pusat</span>
              <Button size="sm" onClick={() => setIsPoModalOpen(true)}>
                + Ajukan PO
              </Button>
            </div>

            <div className="space-y-2">
              {outletPOs.map((po) => (
                <div
                  key={po.id}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-xs text-[var(--brand-700)]">{po.id}</span>
                      <div className="text-[10px] text-[var(--text-muted)]">{po.createdAt}</div>
                    </div>
                    <Badge
                      variant={
                        po.status === 'COMPLETED'
                          ? 'success'
                          : po.status === 'AWAITING_INVOICE'
                          ? 'warning'
                          : po.status === 'SENT'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {po.status === 'AWAITING_INVOICE' ? 'Menunggu Nota' : po.status}
                    </Badge>
                  </div>

                  <div className="text-gray-600 bg-[var(--surface-muted)]/50 p-2 rounded-lg text-[11px]">
                    {po.items.map((it, idx) => (
                      <div key={idx}>
                        • {it.qty} {it.uom} {it.ingredientName} (Tanpa Harga)
                      </div>
                    ))}
                  </div>

                  {po.status === 'SENT' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => {
                        setActivePoForReceipt(po);
                        setIsReceiptModalOpen(true);
                      }}
                      className="w-full text-xs font-bold"
                    >
                      Konfirmasi Terima Barang Fisik
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KAS KECIL */}
        {activeTab === 'kas' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-[var(--text-secondary)]">Belanja Kas Kecil</span>
              <Button size="sm" onClick={() => setIsPettyCashModalOpen(true)}>
                + Catat Belanja
              </Button>
            </div>

            <div className="space-y-2">
              {pettyCashExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 text-xs flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-[var(--text)]">{exp.description}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{exp.createdAt}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[var(--brand-700)] tabular-nums">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </div>
                    <Badge variant={exp.status === 'APPROVED' ? 'success' : 'warning'} className="text-[9px]">
                      {exp.status === 'APPROVED' ? 'Disetujui' : 'Menunggu Approval'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MENU LOKAL */}
        {activeTab === 'menu' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-[var(--text-secondary)]">Menu Lokal Gerai</span>
              <Button size="sm" onClick={() => setIsLocalMenuModalOpen(true)}>
                + Usulkan Menu
              </Button>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold text-[var(--text)]">Usulan Signature Cabang</div>
              <p className="text-gray-500 text-[11px]">
                Menu lokal yang disetujui Admin Pusat hanya akan muncul di POS dan App pelanggan khusus untuk outlet ini.
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: HR, SHIFT & PRESENSI GPS BARISTA */}
        {activeTab === 'shift' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-[var(--text-secondary)]">
                Shift & Presensi Barista ({selectedOutlet.name})
              </span>
              <Badge variant="brand" className="text-[10px] font-mono">
                📍 Geofence 50m Aktif
              </Badge>
            </div>

            {/* Banner GPS Status */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-400">Presensi GPS Terkunci</div>
                  <div className="text-[10px] text-gray-400">Radius absensi maksimum 50m dari titik koordinat gerai</div>
                </div>
              </div>
            </div>

            {/* List Barista Shifts */}
            <div className="space-y-2">
              {baristaShifts
                .filter((s) => s.outletId === selectedOutletId)
                .map((shift) => {
                  const emp = employees.find((e) => e.id === shift.employeeId);
                  const targetCup = emp ? emp.dailyTargetCups : 100;
                  const progressPct = Math.min(100, Math.round((shift.cupsCompleted / targetCup) * 100));

                  return (
                    <div
                      key={shift.id}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 space-y-2.5 shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-black text-sm text-[var(--text)] flex items-center gap-1.5">
                            {shift.employeeName}
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-muted)] text-[var(--text-muted)] font-normal">
                              {emp?.role || 'Barista'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{shift.shiftType}</span>
                          </div>
                        </div>

                        <Badge
                          variant={
                            shift.status === 'CLOCKED_IN'
                              ? 'success'
                              : shift.status === 'COMPLETED'
                              ? 'neutral'
                              : 'warning'
                          }
                          className="text-[10px] uppercase font-bold tracking-wider"
                        >
                          {shift.status === 'CLOCKED_IN'
                            ? 'Aktif Bertugas'
                            : shift.status === 'COMPLETED'
                            ? 'Selesai Shift'
                            : 'Terjadwal'}
                        </Badge>
                      </div>

                      {/* GPS & Clock In Time */}
                      <div className="bg-[var(--surface-muted)] p-2 rounded-xl flex items-center justify-between text-[11px]">
                        <div className="text-[var(--text-muted)]">
                          {shift.status === 'CLOCKED_IN' ? (
                            <>
                              Masuk: <span className="font-bold text-[var(--text)]">{shift.clockInTime}</span>
                            </>
                          ) : (
                            <span className="text-amber-500 font-semibold">Belum Clock-In</span>
                          )}
                        </div>
                        {shift.gpsDistanceMeters !== undefined && (
                          <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-600 font-bold">
                            <MapPin className="w-3 h-3" />
                            <span>GPS: {shift.gpsDistanceMeters}m (Valid)</span>
                          </div>
                        )}
                      </div>

                      {/* Output Racikan & SLA */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-[var(--text-muted)]">Target Output Harian</span>
                          <span className="text-[var(--brand-600)] font-mono">
                            {shift.cupsCompleted} / {targetCup} Cup ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--brand-600)] rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[var(--text-muted)] pt-0.5">
                          <span>SLA Racik: {shift.avgSecondsPerCup ? `${shift.avgSecondsPerCup} dtk/cup` : '-'}</span>
                          <span>Skor Kinerja: <strong className="text-emerald-600 font-mono">{shift.performanceScore} pts</strong></span>
                        </div>
                      </div>

                      {/* Clock In Action Button */}
                      {shift.status === 'SCHEDULED' && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full font-bold flex items-center justify-center gap-1.5 mt-1"
                          onClick={() => {
                            const updatedShift = {
                              ...shift,
                              status: 'CLOCKED_IN' as const,
                              clockInTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                              gpsDistanceMeters: Math.floor(Math.random() * 18) + 8,
                            };
                            dispatch(createEvent('BaristaClockedIn', shift.employeeName, { shift: updatedShift }, selectedOutletId));
                          }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Clock-In Sekarang (Verifikasi GPS)</span>
                        </Button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tabs Bar */}
      <div className="h-14 bg-[var(--surface)] border-t border-[var(--border)] px-2 flex items-center justify-around shrink-0 text-xs">
        {[
          { id: 'beranda', label: 'Beranda', icon: <Boxes className="w-4 h-4" /> },
          { id: 'stok', label: 'Stok', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'po', label: 'PO', icon: <PackageCheck className="w-4 h-4" /> },
          { id: 'kas', label: 'Kas', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'shift', label: 'HR/Shift', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'menu', label: 'Menu', icon: <Coffee className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-0.5 font-bold cursor-pointer transition-colors ${
              activeTab === tab.id ? 'text-[var(--brand-600)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {tab.icon}
            <span className="text-[9px]">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* PO Modal without price (BR-04) */}
      {isPoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-84 p-4 shadow-xl border border-[var(--border)] text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h4 className="font-bold text-sm text-[var(--text)]">Buat PO Bahan ke Pusat</h4>
              <button onClick={() => setIsPoModalOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="p-2 rounded-lg bg-[var(--surface-muted)] text-[11px] text-gray-600">
              Formulir pengajuan PO <strong>tanpa kolom harga</strong> sesuai aturan bisnis pusat (BR-04).
            </div>

            <div>
              <label className="font-bold block mb-1">Pilih Bahan Baku</label>
              <select
                value={poItems[0].ingredientId}
                onChange={(e) => setPoItems([{ ...poItems[0], ingredientId: e.target.value }])}
                className="w-full p-2 border border-[var(--border-strong)] rounded-lg font-medium"
              >
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} ({ing.purchaseUom})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Jumlah Kuantitas Order</label>
              <input
                type="number"
                min="1"
                value={poItems[0].qty}
                onChange={(e) => setPoItems([{ ...poItems[0], qty: parseInt(e.target.value) || 1 }])}
                className="w-full p-2 border border-[var(--border-strong)] rounded-lg font-bold"
              />
            </div>

            <Button onClick={handleSubmitPo} size="md" className="w-full font-bold">
              Kirim PO ke Gudang Pusat
            </Button>
          </div>
        </div>
      )}

      {/* Goods Receipt Confirmation Modal (BR-05) */}
      {isReceiptModalOpen && activePoForReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-84 p-4 shadow-xl border border-[var(--border)] text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h4 className="font-bold text-sm text-[var(--text)]">Terima Fisik Barang</h4>
              <button onClick={() => setIsReceiptModalOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--warning-light)] text-[11px] text-[var(--warning)] font-medium">
              Stok akan dinaikkan dengan status <strong>"Menunggu Nota"</strong> menggunakan estimasi harga terakhir (BR-05).
            </div>

            <div className="space-y-1.5 py-1">
              {activePoForReceipt.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-lg border">
                  <span>{it.ingredientName}</span>
                  <span className="font-bold font-mono text-[var(--success)]">
                    Diterima: {it.qty} {it.uom}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-2 border border-dashed rounded-lg text-gray-500 cursor-pointer">
              <Camera className="w-4 h-4 text-[var(--brand-600)]" />
              <span>Foto Surat Jalan terlampir</span>
            </div>

            <Button onClick={handleConfirmReceipt} variant="success" size="md" className="w-full font-bold">
              Konfirmasi Terima Barang
            </Button>
          </div>
        </div>
      )}

      {/* Petty cash modal (BR-12) */}
      {isPettyCashModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-84 p-4 shadow-xl border border-[var(--border)] text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h4 className="font-bold text-sm text-[var(--text)]">Pengeluaran Kas Kecil</h4>
              <button onClick={() => setIsPettyCashModalOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1">Nominal Rupiah (Rp)</label>
              <input
                type="number"
                value={pettyAmount}
                onChange={(e) => setPettyAmount(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-[var(--border-strong)] rounded-lg font-bold text-sm"
              />
              <div className="text-[10px] text-gray-500 mt-1">
                Batas bebas: Rp {selectedOutlet.pettyCashLimit.toLocaleString('id-ID')}
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Keperluan Belanja</label>
              <input
                type="text"
                value={pettyDesc}
                onChange={(e) => setPettyDesc(e.target.value)}
                className="w-full p-2 border border-[var(--border-strong)] rounded-lg font-medium"
              />
            </div>

            <Button onClick={handleSubmitPettyCash} size="md" className="w-full font-bold">
              Catat Pengeluaran
            </Button>
          </div>
        </div>
      )}

      {/* Local menu proposal modal (BR-09) */}
      {isLocalMenuModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-84 p-4 shadow-xl border border-[var(--border)] text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <h4 className="font-bold text-sm text-[var(--text)]">Usulkan Menu Lokal</h4>
              <button onClick={() => setIsLocalMenuModalOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1">Nama Menu Signature</label>
              <input
                type="text"
                value={localMenuName}
                onChange={(e) => setLocalMenuName(e.target.value)}
                className="w-full p-2 border border-[var(--border-strong)] rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Usulan Harga Jual (Rp)</label>
              <input
                type="number"
                value={localMenuPrice}
                onChange={(e) => setLocalMenuPrice(parseInt(e.target.value) || 0)}
                className="w-full p-2 border border-[var(--border-strong)] rounded-lg font-bold"
              />
            </div>

            <Button onClick={handleProposeLocalMenu} size="md" className="w-full font-bold">
              Kirim Usulan ke Admin Pusat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
