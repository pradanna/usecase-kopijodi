import React, { useState, useEffect } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent, type DomainEvent } from '../../domain/events';
import type { BrandThemeId } from '../../domain/types';
import { eventBus } from '../../platform/bus';
import { DeviceFrame } from '../../ui/DeviceFrame';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

// Micro-apps
import { CustomerApp } from '../customer/CustomerApp';
import { PosApp } from '../pos/PosApp';
import { KdsApp } from '../kds/KdsApp';
import { OpsApp } from '../ops/OpsApp';
import { BackofficeApp } from '../backoffice/BackofficeApp';
import { OwnerApp } from '../owner/OwnerApp';
import { PartnerApp } from '../partner/PartnerApp';
import { CrmApp } from '../crm/CrmApp';
import { ProposalApp } from '../proposal/ProposalApp';

import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Palette,
  Terminal,
  Layers,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  X,
  Coffee,
  FileText,
} from 'lucide-react';

export const StageApp: React.FC = () => {
  const { brandId, dispatch } = useEcosystemStore();

  // Top Mode: 'demo' (multi-device) | 'proposal' (resmi penawaran)
  const [stageViewMode, setStageViewMode] = useState<'demo' | 'proposal'>('demo');

  const [activeLayout, setActiveLayout] = useState<'grid' | 'focus'>('grid');
  const [focusedApp, setFocusedApp] = useState<string | null>(null);

  // Live event log
  const [liveEvents, setLiveEvents] = useState<DomainEvent[]>([]);
  const [isEventLogOpen, setIsEventLogOpen] = useState<boolean>(false);

  // Autoplay presentation mode state
  const [isPlayingAutoDemo, setIsPlayingAutoDemo] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentNarrative, setCurrentNarrative] = useState<string>('');

  // Subscribe to live events for the side log
  useEffect(() => {
    const unsub = eventBus.subscribe((evt) => {
      setLiveEvents((prev) => [evt, ...prev.slice(0, 49)]);
    });
    return unsub;
  }, []);

  // Theme switch (BR-17)
  const handleToggleTheme = () => {
    const nextBrandId: BrandThemeId = brandId === 'jodi' ? 'teras' : 'jodi';
    dispatch(createEvent('BrandThemeChanged', 'Presenter (Stage)', { brandId: nextBrandId }));
  };

  // Reset Demo
  const handleResetDemo = () => {
    if (confirm('Reset seluruh data demo ke kondisi bersih awal (T0)?')) {
      dispatch(createEvent('DemoReset', 'Presenter', { resetAt: Date.now() }));
      setLiveEvents([]);
      setIsPlayingAutoDemo(false);
      setCurrentStepIndex(0);
      setCurrentNarrative('Demo di-reset ke kondisi awal.');
    }
  };

  // Skenario Utama: "Satu Gelas, Satu Cerita" Step-by-Step Script
  const steps = [
    {
      title: 'Langkah 1: Pelanggan Pesan Es Kopi Susu via App',
      narration: 'Pelanggan memilih gerai Sudirman, kustomisasi less sugar, pasang voucher HEMAT10, dan checkout bayar QRIS.',
      action: () => {
        const orderId = `ord_auto_${Date.now()}`;
        const newOrder = {
          id: orderId,
          ticketNumber: '#A-101',
          outletId: 'outlet-sudirman',
          channel: 'app' as const,
          customerName: 'Pradana (Demo VIP)',
          items: [
            {
              menuItemId: 'menu-kopi-susu',
              menuName: 'Es Kopi Susu Aren',
              qty: 1,
              unitPrice: 23000,
              selectedModifiers: [
                { groupId: 'mod-sugar', groupName: 'Gula', optionId: 'opt-less', optionName: 'Less Sugar', priceDelta: 0 },
              ],
              subtotal: 23000,
            },
          ],
          subtotal: 23000,
          appMarkupAmount: 3000,
          discountAmount: 10000,
          taxAmount: 0,
          total: 13000,
          status: 'PLACED' as const,
          paymentMethod: 'qris' as const,
          paymentStatus: 'PAID' as const,
          createdAt: new Date().toLocaleTimeString('id-ID'),
          updatedAt: new Date().toLocaleTimeString('id-ID'),
        };
        dispatch(createEvent('PaymentCaptured', 'Midtrans Gateway', { orderId, amount: 13000, method: 'qris' as const }, 'outlet-sudirman'));
        dispatch(createEvent('OrderPlaced', 'Customer App', { order: newOrder }, 'outlet-sudirman'));
      },
    },
    {
      title: 'Langkah 2: Kasir POS Terima Pesanan Online',
      narration: 'Pesanan online muncul di antrean tablet POS dengan penanda badge "Online". Kasir menekan Terima dan meneruskannya ke KDS.',
      action: () => {
        const targetOrder = useEcosystemStore.getState().orders[0];
        if (targetOrder) {
          dispatch(createEvent('OrderAccepted', 'Kasir POS', { orderId: targetOrder.id, estimatedMinutes: 8 }, 'outlet-sudirman'));
        }
      },
    },
    {
      title: 'Langkah 3: Barista Mulai Meracik di KDS',
      narration: 'Tiket meluncur ke layar KDS Barista. Barista menekan Mulai. Status di smartphone pelanggan live berubah menjadi "Sedang Diracik".',
      action: () => {
        const targetOrder = useEcosystemStore.getState().orders[0];
        if (targetOrder) {
          dispatch(createEvent('OrderPrepStarted', 'Barista KDS', { orderId: targetOrder.id, ticketNumber: targetOrder.ticketNumber }, 'outlet-sudirman'));
        }
      },
    },
    {
      title: 'Langkah 4: Barista Tandai Siap & Stok Terpotong Otomatis',
      narration: 'Minuman selesai. Barista mengetuk Siap. Sistem otomatis memotong stok biji kopi, susu, dan cup sesuai resep (BR-08).',
      action: () => {
        const targetOrder = useEcosystemStore.getState().orders[0];
        if (targetOrder) {
          dispatch(createEvent('OrderReady', 'Barista KDS', { orderId: targetOrder.id, ticketNumber: targetOrder.ticketNumber }, 'outlet-sudirman'));
          dispatch(createEvent('StockConsumed', 'Recipe Engine', {
            outletId: 'outlet-sudirman',
            orderId: targetOrder.id,
            consumed: [
              { ingredientId: 'ing-kopi-blend', qty: 18, uom: 'gram' },
              { ingredientId: 'ing-susu-fresh', qty: 120, uom: 'ml' },
              { ingredientId: 'ing-cup-16oz', qty: 1, uom: 'pcs' },
            ],
          }, 'outlet-sudirman'));
        }
      },
    },
    {
      title: 'Langkah 5: Alert Stok Susu Menipis ke Store Manager',
      narration: 'Konsumsi susu melewati batas pengaman safety stock. App Operasi Outlet milik Store Manager membunyikan alert Low Stock.',
      action: () => {
        dispatch(createEvent('LowStockAlert', 'Inventory Engine', {
          outletId: 'outlet-sudirman',
          ingredientId: 'ing-susu-fresh',
          ingredientName: 'Susu Fresh Milk Pasteurisasi',
          currentQty: 4880,
          minStock: 5000,
          uom: 'ml',
        }, 'outlet-sudirman'));
      },
    },
    {
      title: 'Langkah 6: Store Manager Buat PO Tanpa Harga ke Pusat',
      narration: 'Store Manager menerbitkan PO pengisian ulang ke pusat hanya berisi barang dan kuantitas, tanpa kolom harga (BR-04).',
      action: () => {
        const poId = `po_${Date.now()}`;
        const newPO = {
          id: poId,
          outletId: 'outlet-sudirman',
          supplierType: 'central' as const,
          items: [{ ingredientId: 'ing-susu-fresh', ingredientName: 'Susu Fresh Milk Pasteurisasi', qty: 2, uom: 'Karton (12L)' }],
          status: 'SENT' as const, // already dispatched by warehouse
          createdAt: new Date().toLocaleTimeString('id-ID'),
        };
        dispatch(createEvent('PORequested', 'Store Manager', { po: newPO }, 'outlet-sudirman'));
      },
    },
    {
      title: 'Langkah 7: Terima Barang Fisik -> Status "Menunggu Nota"',
      narration: 'Truk logistik tiba. Manager menerima barang. Stok susu fisik langsung bertambah status "Menunggu Nota" dengan HPP sementara (BR-05).',
      action: () => {
        const lastPo = useEcosystemStore.getState().purchaseOrders[0];
        if (lastPo) {
          dispatch(createEvent('GoodsReceived', 'Store Manager', {
            receipt: {
              id: `rcpt_${Date.now()}`,
              poId: lastPo.id,
              outletId: 'outlet-sudirman',
              items: [{ ingredientId: 'ing-susu-fresh', qtyReceived: 24000 }], // 24 L
              receivedAt: new Date().toLocaleTimeString('id-ID'),
            },
          }, 'outlet-sudirman'));
        }
      },
    },
    {
      title: 'Langkah 8: Finance Input Nota Faktur -> True-Up HPP',
      narration: 'Finance pusat memverifikasi faktur riil (Rp 19.500/L). Nilai HPP dikoreksi otomatis (true-up) dan saldo hutang cabang tercatat (BR-06).',
      action: () => {
        const lastPo = useEcosystemStore.getState().purchaseOrders[0];
        if (lastPo) {
          dispatch(createEvent('InvoiceEntered', 'Finance Pusat', {
            invoice: {
              id: `inv_${Date.now()}`,
              invoiceNumber: 'INV-PST-2026-105',
              poId: lastPo.id,
              outletId: 'outlet-sudirman',
              items: [{ ingredientId: 'ing-susu-fresh', qtyReceived: 2, actualPricePerUom: 234000 }],
              totalAmount: 468000,
              verifiedAt: new Date().toLocaleTimeString('id-ID'),
            },
          }, 'outlet-sudirman'));
          dispatch(createEvent('HppRecalculated', 'Finance Engine', {
            outletId: 'outlet-sudirman',
            ingredientId: 'ing-susu-fresh',
            oldUnitCost: 18,
            newUnitCost: 19.5,
          }, 'outlet-sudirman'));
        }
      },
    },
    {
      title: 'Langkah 9: Dashboard Owner & Portal Mitra Terupdate Real-Time',
      narration: 'Grafik omzet, margin, dan HPP definitif di Owner Dashboard dan Portal Mitra terupdate serentak secara real-time!',
      action: () => {
        // Target achieved!
      },
    },
  ];

  // Auto demo stepper loop
  useEffect(() => {
    let timer: any;
    if (isPlayingAutoDemo) {
      if (currentStepIndex < steps.length) {
        const current = steps[currentStepIndex];
        setCurrentNarrative(`${current.title} — ${current.narration}`);
        current.action();

        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, 5500); // 5.5 seconds per step
      } else {
        setIsPlayingAutoDemo(false);
        setCurrentNarrative('Skenario "Satu Gelas, Satu Cerita" selesai sukses 100%!');
      }
    }
    return () => clearTimeout(timer);
  }, [isPlayingAutoDemo, currentStepIndex]);

  const handleStartAutoDemo = () => {
    setCurrentStepIndex(0);
    setIsPlayingAutoDemo(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D1017] text-white overflow-hidden select-none">
      {/* Top Stage Control Header */}
      <div className="h-16 bg-[#161B26] border-b border-gray-800 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand-600)] flex items-center justify-center font-black shadow-md text-white">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">
                DEMO STAGE ORCHESTRATOR
              </span>
              <Badge variant="brand" className="text-[10px] py-0 px-2 font-mono">
                {brandId === 'jodi' ? 'Brand: Kopi Jodi' : 'Brand: Teras Kopi (Toska)'}
              </Badge>
            </div>
            <div className="text-[11px] text-gray-400">
              Ekosistem Terpadu: Satu Gelas, Satu Cerita • Multi-Device Real-Time Sync
            </div>
          </div>
        </div>

        {/* Center: Presentation controls + NEW TAB PROPOSAL SWITCHER */}
        <div className="flex items-center gap-3">
          {/* TAB BARU: Demo Multi-Perangkat vs Proposal Resmi */}
          <div className="flex items-center rounded-xl bg-gray-950 p-1 border border-gray-800 shadow-inner">
            <button
              onClick={() => setStageViewMode('demo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stageViewMode === 'demo'
                  ? 'bg-[var(--brand-600)] text-white shadow-xs'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Demo Perangkat</span>
            </button>
            <button
              onClick={() => setStageViewMode('proposal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                stageViewMode === 'proposal'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Proposal Resmi</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[9px] font-black uppercase">
                Tab Baru
              </span>
            </button>
          </div>

          {stageViewMode === 'demo' && (
            <div className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800">
              <Button
                size="sm"
                variant={isPlayingAutoDemo ? 'danger' : 'primary'}
                onClick={() => {
                  if (isPlayingAutoDemo) {
                    setIsPlayingAutoDemo(false);
                  } else {
                    handleStartAutoDemo();
                  }
                }}
                className="font-bold flex items-center gap-1.5 shadow-md"
              >
                {isPlayingAutoDemo ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlayingAutoDemo ? 'Jeda Demo' : 'Play Demo Otomatis'}</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleToggleTheme}
                className="text-xs font-semibold bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>White-Label</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleResetDemo}
                className="text-xs font-semibold bg-gray-800 text-rose-300 border-gray-700 hover:bg-gray-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEventLogOpen(!isEventLogOpen)}
                className="text-xs font-semibold bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Log ({liveEvents.length})</span>
              </Button>
            </div>
          )}
        </div>

        {/* Quick App Switcher shortcuts */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 font-bold mr-1">Fokus Layar:</span>
          {['Pusat Backoffice', 'Dashboard Owner', 'Portal Mitra', 'Panel CRM'].map((role) => (
            <button
              key={role}
              onClick={() => setFocusedApp(role)}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold cursor-pointer"
            >
              {role}
            </button>
          ))}
          <button
            onClick={() => setStageViewMode('proposal')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-300 text-xs font-bold cursor-pointer flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            <span>Proposal</span>
          </button>
        </div>
      </div>

      {stageViewMode === 'proposal' ? (
        <div className="flex-1 overflow-auto bg-[#F8FAFC]">
          <ProposalApp onBackToDemo={() => setStageViewMode('demo')} />
        </div>
      ) : (
        <>
          {/* Main Multi-Device Stage Canvas */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            {/* Balanced Grid: Customer App (HP), POS (Tablet), KDS (Monitor/Tablet), Ops App (HP) */}
            <div className="flex items-center gap-6 max-w-7xl mx-auto">
              {/* 1. Customer Smartphone */}
              <DeviceFrame
                type="mobile"
                title="App Pelanggan"
                subtitle="PWA iOS / Android"
                isActive={isPlayingAutoDemo && currentStepIndex === 0}
              >
                <CustomerApp />
              </DeviceFrame>

              {/* 2. Tablet POS Kasir */}
              <DeviceFrame
                type="tablet"
                title="POS Kasir Outlet"
                subtitle="Tablet Landscape Counter"
                isActive={isPlayingAutoDemo && (currentStepIndex === 1 || currentStepIndex === 2)}
              >
                <PosApp />
              </DeviceFrame>

              {/* 3. KDS Barista */}
              <DeviceFrame
                type="tablet"
                title="KDS Barista Dapur"
                subtitle="Monitor Layar Dapur"
                isActive={isPlayingAutoDemo && (currentStepIndex === 2 || currentStepIndex === 3)}
              >
                <KdsApp />
              </DeviceFrame>

              {/* 4. Store Manager Smartphone */}
              <DeviceFrame
                type="mobile"
                title="App Operasi Outlet"
                subtitle="Smartphone Store Manager"
                isActive={isPlayingAutoDemo && (currentStepIndex === 4 || currentStepIndex === 5 || currentStepIndex === 6)}
              >
                <OpsApp />
              </DeviceFrame>
            </div>
          </div>

          {/* Bottom Subtitle / Live Narrative Bar */}
          <div className="h-14 bg-[#161B26] border-t border-gray-800 px-6 flex items-center justify-between shrink-0 text-xs font-medium z-30">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-300 font-bold">
                {currentNarrative || 'Siap menjalankan demo. Tekan "Play Demo Otomatis" atau klik langsung di layar perangkat.'}
              </span>
            </div>

            {isPlayingAutoDemo && (
              <div className="flex items-center gap-2 font-mono text-amber-400 font-bold">
                <span>Step {currentStepIndex + 1} of {steps.length}</span>
                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Focus App Modal (Backoffice, Owner, Partner, CRM) */}
      {focusedApp && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-scale-up">
          <div className="w-full max-w-6xl h-[85vh] bg-[var(--bg)] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-700">
            <div className="h-11 bg-gray-900 px-5 flex items-center justify-between border-b border-gray-800 shrink-0">
              <span className="font-extrabold text-sm text-gray-200">{focusedApp}</span>
              <button
                onClick={() => setFocusedApp(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {focusedApp === 'Pusat Backoffice' && <BackofficeApp />}
              {focusedApp === 'Dashboard Owner' && <OwnerApp />}
              {focusedApp === 'Portal Mitra' && <PartnerApp />}
              {focusedApp === 'Panel CRM' && <CrmApp />}
            </div>
          </div>
        </div>
      )}

      {/* Live Event Log Drawer */}
      {isEventLogOpen && (
        <div className="fixed top-16 right-0 bottom-14 w-96 bg-[#161B26] border-l border-gray-800 shadow-2xl z-40 flex flex-col text-xs font-mono">
          <div className="h-11 px-4 border-b border-gray-800 flex items-center justify-between">
            <span className="font-bold text-gray-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Live Event Bus Log
            </span>
            <button onClick={() => setIsEventLogOpen(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {liveEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-sans">Belum ada event yang dipancarkan</div>
            ) : (
              liveEvents.map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-xl bg-gray-900/90 border border-gray-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-extrabold">{evt.type}</span>
                    <span className="text-[10px] text-gray-500">{new Date(evt.ts).toLocaleTimeString('id-ID')}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-sans">
                    Aktor: <span className="text-gray-300 font-semibold">{evt.actor}</span>
                  </div>
                  <pre className="text-[10px] text-amber-300/80 bg-black/40 p-1.5 rounded overflow-x-auto max-h-20">
                    {JSON.stringify(evt.payload, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
