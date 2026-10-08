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
  ShoppingBag,
  Users,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface DemoStep {
  title: string;
  narration: string;
  activeDevice: string;
  action: () => void;
}

export interface DemoScenario {
  id: string;
  name: string;
  badge: string;
  icon: React.ReactNode;
  tagline: string;
  steps: DemoStep[];
}

export const StageApp: React.FC = () => {
  const { brandId, dispatch } = useEcosystemStore();

  // Top Mode: 'demo' (multi-device) | 'proposal' (resmi penawaran)
  const [stageViewMode, setStageViewMode] = useState<'demo' | 'proposal'>('demo');

  const [focusedApp, setFocusedApp] = useState<string | null>(null);

  // Live event log
  const [liveEvents, setLiveEvents] = useState<DomainEvent[]>([]);
  const [isEventLogOpen, setIsEventLogOpen] = useState<boolean>(false);

  // Active scenario and autoplay states
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('order_flow');
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

  // Reset entire demo to T0
  const handleResetDemo = () => {
    if (confirm('Reset seluruh data demo ke kondisi bersih awal (T0)?')) {
      dispatch(createEvent('DemoReset', 'Presenter', { resetAt: Date.now() }));
      setLiveEvents([]);
      setIsPlayingAutoDemo(false);
      setCurrentStepIndex(0);
      setCurrentNarrative('Seluruh database & event demo telah di-reset ke kondisi awal T0.');
    }
  };

  // ==========================================
  // MULTI-SCENARIO DEMO CATALOGUE
  // ==========================================
  const scenarios: DemoScenario[] = [
    // 1. ORDER-TO-CUP FLOW
    {
      id: 'order_flow',
      name: '1. Order-to-Cup',
      badge: 'Omni-channel',
      icon: <Coffee className="w-4 h-4" />,
      tagline: 'Sinkronisasi pesanan real-time dari App Pelanggan -> POS Kasir -> KDS Barista -> Potong Stok Resep.',
      steps: [
        {
          title: 'Langkah 1: Pelanggan Pesan Es Kopi Susu via App',
          narration: 'Pelanggan memilih gerai Sudirman, kustomisasi Less Sugar, pakai voucher HEMAT10, dan checkout bayar QRIS.',
          activeDevice: 'customer',
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
          activeDevice: 'pos',
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
          activeDevice: 'kds',
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
          activeDevice: 'kds',
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
          title: 'Langkah 5: Pelanggan Ambil Pesanan di Counter Gerai',
          narration: 'Pelanggan menerima notifikasi "Pesanan Siap Diambil", scan QR pickup di kasir, dan otomatis mendapatkan +130 Poin Loyalti.',
          activeDevice: 'customer',
          action: () => {
            const targetOrder = useEcosystemStore.getState().orders[0];
            if (targetOrder) {
              dispatch(createEvent('OrderPickedUp', 'Kasir Counter', { orderId: targetOrder.id }, 'outlet-sudirman'));
            }
          },
        },
      ],
    },

    // 2. PURCHASE & SUPPLY CHAIN FLOW
    {
      id: 'purchase_flow',
      name: '2. Purchase & Supply Chain',
      badge: 'Pengadaan & HPP',
      icon: <ShoppingBag className="w-4 h-4" />,
      tagline: 'PO tanpa harga (BR-04), terima fisik status Menunggu Nota (BR-05), hingga rekonsiliasi faktur & auto true-up HPP (BR-06).',
      steps: [
        {
          title: 'Langkah 1: Alert Stok Susu Menipis di Gerai Sudirman',
          narration: 'Konsumsi susu melewati batas safety stock (tersisa 4.800ml < 5.000ml). App Operasi Outlet milik Store Manager membunyikan alert Low Stock.',
          activeDevice: 'ops',
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
          title: 'Langkah 2: Store Manager Buat PO Tanpa Harga ke Pusat (BR-04)',
          narration: 'Store Manager menerbitkan PO 2 Karton (24L) Susu ke Gudang Pusat. Sesuai aturan BR-04, formulir PO tidak memiliki kolom harga modal.',
          activeDevice: 'ops',
          action: () => {
            const poId = `po_${Date.now()}`;
            const newPO = {
              id: poId,
              outletId: 'outlet-sudirman',
              supplierType: 'central' as const,
              items: [{ ingredientId: 'ing-susu-fresh', ingredientName: 'Susu Fresh Milk Pasteurisasi', qty: 2, uom: 'Karton (12L)' }],
              status: 'SENT' as const,
              notes: 'Permintaan pasokan reguler gerai',
              createdAt: new Date().toLocaleTimeString('id-ID'),
            };
            dispatch(createEvent('PORequested', 'Store Manager', { po: newPO }, 'outlet-sudirman'));
          },
        },
        {
          title: 'Langkah 3: Gudang Pusat Terbitkan Surat Jalan & Kirim Barang',
          narration: 'Gudang logistik pusat memproses PO, menyiapkan 2 karton susu fresh, dan menerbitkan Surat Jalan pengiriman ke outlet Sudirman.',
          activeDevice: 'warehouse',
          action: () => {
            // Dispatched from warehouse
          },
        },
        {
          title: 'Langkah 4: Truk Tiba: Terima Barang Fisik -> Status "Menunggu Nota" (BR-05)',
          narration: 'Barang fisik tiba di gerai. Manager konfirmasi terima barang. Stok fisik 24L langsung masuk kartu stok gerai berstatus "Menunggu Nota" agar bisa langsung dipakai operasional (BR-05).',
          activeDevice: 'ops',
          action: () => {
            const lastPo = useEcosystemStore.getState().purchaseOrders[0];
            if (lastPo) {
              dispatch(createEvent('GoodsReceived', 'Store Manager', {
                receipt: {
                  id: `rcpt_${Date.now()}`,
                  poId: lastPo.id,
                  outletId: 'outlet-sudirman',
                  items: [{ ingredientId: 'ing-susu-fresh', qtyReceived: 24000 }],
                  receivedAt: new Date().toLocaleTimeString('id-ID'),
                },
              }, 'outlet-sudirman'));
            }
          },
        },
        {
          title: 'Langkah 5: Finance Input Faktur Riil -> Sistem Auto True-Up HPP (BR-06)',
          narration: 'Finance pusat memverifikasi faktur riil (Rp 19.500/L). Sistem melakukan rekonsiliasi otomatis (True-Up HPP dari Rp 18/ml ke Rp 19.5/ml) dan mengakui hutang cabang ke pusat.',
          activeDevice: 'finance',
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
      ],
    },

    // 3. HR, SHIFT & BARISTA GPS FLOW
    {
      id: 'hr_flow',
      name: '3. HR & Presensi Barista',
      badge: 'Presensi & KPI',
      icon: <Users className="w-4 h-4" />,
      tagline: 'Jadwal shift, presensi GPS geofencing radius 50m, live tracking output racikan cup, hingga SLA kecepatan barista.',
      steps: [
        {
          title: 'Langkah 1: Barista Buka Jadwal Shift di App Operasi Outlet',
          narration: 'Barista Andi Pratama membuka tab HR/Shift di smartphone gerai Sudirman. Jadwal shift pagi (07:00 - 15:00) terkonfirmasi di sistem.',
          activeDevice: 'ops',
          action: () => {
            // Highlight shift on OpsApp
          },
        },
        {
          title: 'Langkah 2: Clock-In dengan Validasi GPS Geofencing Radius 50m',
          narration: 'Sistem memverifikasi posisi GPS perangkat (11 meter dari gerai, valid di bawah radius 50m). Presensi disetujui, anti-fake GPS dan anti-titip absen.',
          activeDevice: 'ops',
          action: () => {
            const shift = useEcosystemStore.getState().baristaShifts.find((s) => s.outletId === 'outlet-sudirman');
            if (shift) {
              const updatedShift = {
                ...shift,
                status: 'CLOCKED_IN' as const,
                clockInTime: '06:52 WIB',
                gpsDistanceMeters: 11,
              };
              dispatch(createEvent('BaristaClockedIn', 'Andi Pratama', { shift: updatedShift }, 'outlet-sudirman'));
            }
          },
        },
        {
          title: 'Langkah 3: Barista Mulai Meracik di Stasiun KDS Dapur',
          narration: 'Barista aktif di layar KDS. Setiap pesanan yang masuk langsung diproses. Stopwatch SLA per cup mulai berjalan otomatis.',
          activeDevice: 'kds',
          action: () => {
            const targetOrder = useEcosystemStore.getState().orders[0];
            if (targetOrder) {
              dispatch(createEvent('OrderPrepStarted', 'Barista Andi (KDS)', { orderId: targetOrder.id, ticketNumber: targetOrder.ticketNumber }, 'outlet-sudirman'));
            }
          },
        },
        {
          title: 'Langkah 4: Minuman Siap: Counter Output Cup & SLA Kecepatan Terhitung',
          narration: 'Tiket selesai dalam 138 detik (standar SLA < 180 detik). Counter output naik (85 / 120 cup). Skor performa Andi mencapai 96 poin (Grade A).',
          activeDevice: 'kds',
          action: () => {
            const shift = useEcosystemStore.getState().baristaShifts.find((s) => s.outletId === 'outlet-sudirman');
            if (shift) {
              dispatch(createEvent('BaristaShiftCompleted', 'Barista Andi', {
                shiftId: shift.id,
                cupsCompleted: (shift.cupsCompleted || 84) + 1,
              }, 'outlet-sudirman'));
            }
          },
        },
        {
          title: 'Langkah 5: Owner Pantau Leaderboard Barista & Rekap Payroll',
          narration: 'Owner dapat membuka tab "HR & Shift Barista" di Dashboard Owner untuk melihat produktivitas tim, leaderboard gerai, dan estimasi bonus insentif.',
          activeDevice: 'owner',
          action: () => {
            // HR scenario finished
          },
        },
      ],
    },

    // 4. CASHIER & FINANCE RECONCILIATION FLOW
    {
      id: 'finance_flow',
      name: '4. Finance & Rekonsiliasi Kas',
      badge: 'Rekonsiliasi Kas',
      icon: <DollarSign className="w-4 h-4" />,
      tagline: 'Buka modal laci (Float), pencatatan transaksi kasir, tutup shift blind cash count, rekonsiliasi selisih Rp 0 & jurnal deposit bank.',
      steps: [
        {
          title: 'Langkah 1: Kasir Buka Shift POS dengan Modal Awal (Float Rp 200.000)',
          narration: 'Kasir Budi Santoso memasukkan modal awal uang pecahan kecil Rp 200.000 ke laci kasir saat membuka shift pagi.',
          activeDevice: 'pos',
          action: () => {
            const shiftId = `shift_${Date.now()}`;
            dispatch(createEvent('CashierShiftOpened', 'Kasir POS', {
              shift: {
                id: shiftId,
                outletId: 'outlet-sudirman',
                shiftNumber: 1,
                cashierName: 'Budi Santoso',
                openedAt: '07:00 WIB',
                startingFloat: 200000,
                totalCashSales: 0,
                totalQrisSales: 0,
                totalTransactions: 0,
                expectedCashInDrawer: 200000,
                status: 'OPEN' as const,
              },
            }, 'outlet-sudirman'));
          },
        },
        {
          title: 'Langkah 2: Transaksi Penjualan Masuk (Tunai Rp 180.000 & QRIS Rp 250.000)',
          narration: 'Kasir melayani transaksi langsung di meja kasir. Uang tunai masuk laci dan saldo kasir shift bertambah secara terisolasi per user.',
          activeDevice: 'pos',
          action: () => {
            const cashOrder = {
              id: `ord_cash_${Date.now()}`,
              ticketNumber: '#POS-08',
              outletId: 'outlet-sudirman',
              channel: 'pos' as const,
              customerName: 'Pelanggan Walk-in (Tunai)',
              items: [
                {
                  menuItemId: 'menu-kopi-susu',
                  menuName: 'Es Kopi Susu Aren',
                  qty: 2,
                  unitPrice: 20000,
                  selectedModifiers: [],
                  subtotal: 40000,
                },
              ],
              subtotal: 40000,
              appMarkupAmount: 0,
              discountAmount: 0,
              taxAmount: 0,
              total: 40000,
              status: 'COMPLETED' as any,
              paymentMethod: 'cash' as const,
              paymentStatus: 'PAID' as const,
              createdAt: new Date().toLocaleTimeString('id-ID'),
              updatedAt: new Date().toLocaleTimeString('id-ID'),
            };
            dispatch(createEvent('PaymentCaptured', 'Kasir POS', { orderId: cashOrder.id, amount: 40000, method: 'cash' as const }, 'outlet-sudirman'));
            dispatch(createEvent('OrderPlaced', 'Kasir POS', { order: cashOrder as any }, 'outlet-sudirman'));
          },
        },
        {
          title: 'Langkah 3: Kasir Tutup Shift & Lakukan "Blind Cash Count"',
          narration: 'Kasir menghitung fisik uang kertas & koin di laci kasir tanpa melihat angka ekspektasi sistem terlebih dahulu (Anti-Fraud Blind Count).',
          activeDevice: 'pos',
          action: () => {
            const openShift = useEcosystemStore.getState().cashierShifts.find((s) => s.status === 'OPEN' && s.outletId === 'outlet-sudirman');
            if (openShift) {
              const physicalCash = openShift.expectedCashInDrawer;
              dispatch(createEvent('CashierShiftClosed', 'Kasir POS', {
                shift: {
                  ...openShift,
                  status: 'PENDING_FINANCE_AUDIT' as const,
                  closedAt: new Date().toLocaleTimeString('id-ID'),
                  actualCashCounted: physicalCash,
                  variance: 0,
                  closingNotes: 'Penghitungan fisik laci kasir cocok sempurna',
                },
              }, 'outlet-sudirman'));
            }
          },
        },
        {
          title: 'Langkah 4: Rekonsiliasi Sistem: Variance / Selisih Rp 0 (Match 100%)',
          narration: 'Sistem membandingkan hitungan fisik vs penjualan sistem: Total Rp 380.000 (Float Rp 200k + Kas Rp 180k). Selisih = Rp 0 (Tepat & Akurat).',
          activeDevice: 'recon',
          action: () => {
            // Verified variance 0
          },
        },
        {
          title: 'Langkah 5: Finance Verifikasi Setoran Bank & Auto-Posting Jurnal',
          narration: 'Finance memvalidasi bukti transfer setoran kas ke Bank BCA (#DEP-BCA-8821). Sistem otomatis mendebit Kas Bank dan mengkredit Kas Kasir Outlet.',
          activeDevice: 'journal',
          action: () => {
            const auditShift = useEcosystemStore.getState().cashierShifts.find((s) => s.status === 'PENDING_FINANCE_AUDIT' || s.status === 'VERIFIED');
            if (auditShift) {
              dispatch(createEvent('CashierSettlementVerified', 'Finance Supervisor', {
                shiftId: auditShift.id,
                verifiedBy: 'Finance Supervisor',
                depositRef: 'DEP-BCA-20261008-01',
              }, 'outlet-sudirman'));
            }
          },
        },
      ],
    },

    // 5. PETTY CASH ANTI-FRAUD FLOW
    {
      id: 'petty_cash_flow',
      name: '5. Petty Cash Anti-Fraud',
      badge: 'Kontrol Pengeluaran',
      icon: <ShieldCheck className="w-4 h-4" />,
      tagline: 'Pengajuan kas kecil darurat gerai, validasi plafon 3-tier, foto struk fisik, approval bertingkat & posting beban otomatis.',
      steps: [
        {
          title: 'Langkah 1: Store Manager Ajukan Kas Kecil Darurat (Beli Es Batu)',
          narration: 'Outlet mengalami lonjakan pengunjung dan kehabisan es batu. Manager membeli 3 karung es batu kristal darurat seharga Rp 85.000.',
          activeDevice: 'ops',
          action: () => {
            const expenseId = `petty_${Date.now()}`;
            dispatch(createEvent('PettyCashSubmitted', 'Store Manager', {
              expense: {
                id: expenseId,
                outletId: 'outlet-sudirman',
                amount: 85000,
                category: 'Operasional',
                description: 'Beli es batu kristal 3 karung (supplier darurat)',
                receiptPhotoUrl: '/receipt-ice.jpg',
                status: 'AWAITING_APPROVAL' as const,
                createdAt: new Date().toLocaleTimeString('id-ID'),
              },
            }, 'outlet-sudirman'));
          },
        },
        {
          title: 'Langkah 2: Sistem Validasi Plafon 3-Tier (Tier 1: Nominal <= Rp 100.000)',
          narration: 'Karena nominal Rp 85.000 berada di bawah batas plafon bebas outlet (Rp 100.000), pengajuan otomatis di-approve (Tier 1) dengan syarat foto nota.',
          activeDevice: 'approvals',
          action: () => {
            const lastExpense = useEcosystemStore.getState().pettyCashExpenses[0];
            if (lastExpense) {
              dispatch(createEvent('PettyCashApproved', 'Sistem Otorisasi Otomatis', {
                expenseId: lastExpense.id,
                approvedBy: 'Auto-Rule Tier 1 (<= Plafon Bebas)',
              }, 'outlet-sudirman'));
            }
          },
        },
        {
          title: 'Langkah 3: Saldo Kas Gerai Terpotong & Tercatat di Jurnal Beban Cabang',
          narration: 'Saldo petty cash outlet Sudirman terpotong dari Rp 500.000 menjadi Rp 415.000. Finance pusat dapat melihat struk digital secara terpusat tanpa risiko struk fiktif.',
          activeDevice: 'owner',
          action: () => {
            // Petty cash done
          },
        },
      ],
    },
  ];

  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const steps = currentScenario.steps;

  // Handle Switch Scenario
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setCurrentStepIndex(0);
    setIsPlayingAutoDemo(false);
    const scen = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
    setCurrentNarrative(`${scen.name}: ${scen.steps[0].title} — ${scen.steps[0].narration}`);
  };

  // Next Step Manual
  const handleNextStep = () => {
    if (currentStepIndex < steps.length) {
      const current = steps[currentStepIndex];
      setCurrentNarrative(`${current.title} — ${current.narration}`);
      current.action();
      if (currentStepIndex + 1 < steps.length) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlayingAutoDemo(false);
        setCurrentNarrative(`Skenario "${currentScenario.name}" selesai sukses 100%!`);
      }
    }
  };

  // Auto demo stepper loop
  useEffect(() => {
    let timer: any;
    if (isPlayingAutoDemo) {
      if (currentStepIndex < steps.length) {
        const current = steps[currentStepIndex];
        setCurrentNarrative(`${current.title} — ${current.narration}`);
        current.action();

        timer = setTimeout(() => {
          if (currentStepIndex + 1 < steps.length) {
            setCurrentStepIndex((prev) => prev + 1);
          } else {
            setIsPlayingAutoDemo(false);
            setCurrentNarrative(`Skenario "${currentScenario.name}" selesai sukses 100%!`);
          }
        }, 5000); // 5 seconds per step
      } else {
        setIsPlayingAutoDemo(false);
        setCurrentNarrative(`Skenario "${currentScenario.name}" selesai sukses 100%!`);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlayingAutoDemo, currentStepIndex, selectedScenarioId]);

  const handleStartAutoDemo = () => {
    setCurrentStepIndex(0);
    setIsPlayingAutoDemo(true);
  };

  // Check if a device is active in the current step
  const isActiveDevice = (deviceKey: string) => {
    if (currentStepIndex >= steps.length) return false;
    const currentActive = steps[currentStepIndex]?.activeDevice;
    if (currentActive === 'all') return true;
    return currentActive === deviceKey;
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D1017] text-white overflow-hidden select-none">
      {/* 1. TOP MAIN NAVIGATION BAR (h-14, clean, balanced 3-col layout) */}
      <div className="h-14 bg-[#11141C] border-b border-gray-800/90 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 gap-3">
        {/* Left: Branding & Brand Theme Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-black shadow-md text-white">
            <Coffee className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider text-white">
              KOPI JODI
            </span>
            <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
              ERP & POS
            </span>
            <Badge variant="brand" className="text-[9px] py-0 px-1.5 font-mono">
              {brandId === 'jodi' ? 'Brand Jodi' : 'Teras Kopi'}
            </Badge>
          </div>
        </div>

        {/* Center: Main View Switcher (Demo Perangkat vs Proposal Resmi) */}
        <div className="flex items-center rounded-xl bg-gray-950 p-1 border border-gray-800 shadow-inner shrink-0">
          <button
            onClick={() => setStageViewMode('demo')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              stageViewMode === 'demo'
                ? 'bg-[var(--brand-600)] text-white shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Simulasi Perangkat</span>
          </button>
          <button
            onClick={() => setStageViewMode('proposal')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              stageViewMode === 'proposal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Proposal Fitur & Solusi</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/30">
              PITCH
            </span>
          </button>
        </div>

        {/* Right: Quick Fullscreen Apps + Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Fullscreen Apps Pills */}
          <div className="hidden xl:flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs">
            <span className="text-[10px] text-gray-500 font-bold px-1.5 uppercase tracking-wider">Modul:</span>
            {[
              { id: 'Pusat Backoffice', label: 'Backoffice', icon: '🏢' },
              { id: 'Dashboard Owner', label: 'Owner', icon: '👑' },
              { id: 'Portal Mitra', label: 'Mitra', icon: '🤝' },
              { id: 'Panel CRM', label: 'CRM', icon: '👥' },
            ].map((app) => (
              <button
                key={app.id}
                onClick={() => setFocusedApp(app.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <span>{app.icon}</span>
                <span>{app.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Utility Icons */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={handleToggleTheme}
              title="Ganti Tema White-Label"
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-amber-400 cursor-pointer transition-colors text-xs flex items-center gap-1"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline text-[10px]">Tema</span>
            </button>
            <button
              onClick={handleResetDemo}
              title="Reset Database Demo ke T0"
              className="p-1.5 rounded-lg hover:bg-gray-800 text-rose-400 hover:text-rose-300 cursor-pointer transition-colors text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline text-[10px]">Reset T0</span>
            </button>
            <button
              onClick={() => setIsEventLogOpen(!isEventLogOpen)}
              title="Buka Live Event Log"
              className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors text-xs flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-gray-850 px-1.5 py-0.5 rounded">
                {liveEvents.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {stageViewMode === 'proposal' ? (
        <div className="flex-1 overflow-auto bg-[#F8FAFC]">
          <ProposalApp onBackToDemo={() => setStageViewMode('demo')} />
        </div>
      ) : (
        <>
          {/* 2. SCENARIO TOOLBAR & PLAYBACK CONTROLS (h-12, clean & compact) */}
          <div className="h-12 bg-[#141822] border-b border-gray-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 gap-3">
            {/* Left: 5 Scenario Segmented Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:flex items-center gap-1 mr-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Skenario:
              </span>

              {scenarios.map((scen, idx) => {
                const isSelected = scen.id === selectedScenarioId;
                return (
                  <button
                    key={scen.id}
                    onClick={() => handleSelectScenario(scen.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
                      isSelected
                        ? 'bg-[var(--brand-600)] text-white border-[var(--brand-500)] shadow-md shadow-[var(--brand-900)]/40 ring-1 ring-[var(--brand-400)]/30'
                        : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="shrink-0">{scen.icon}</span>
                    <span>{scen.name.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Integrated Stepper Playback Controls */}
            <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800/80 shadow-inner shrink-0">
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
                className="font-bold flex items-center gap-1.5 shadow-xs px-2.5 py-1 text-xs rounded-lg"
              >
                {isPlayingAutoDemo ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlayingAutoDemo ? 'Jeda' : 'Play Skenario'}</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleNextStep}
                className="text-xs font-bold bg-gray-900 hover:bg-gray-800 text-amber-300 border-gray-700 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                title="Langkah berikutnya manual"
              >
                <span>Lanjut Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setIsPlayingAutoDemo(false);
                  const current = steps[0];
                  setCurrentNarrative(`${currentScenario.name}: ${current.title} — ${current.narration}`);
                }}
                title="Ulang Skenario ke Langkah 1"
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="text-[11px] font-mono text-gray-400 bg-gray-900 px-2 py-1 rounded-lg border border-gray-800 font-bold shrink-0">
                <span className="text-amber-400">{Math.min(currentStepIndex + 1, steps.length)}</span>/{steps.length}
              </div>
            </div>
          </div>

          {/* 3. SLIM SCENARIO TAGLINE RIBBON */}
          <div className="h-7 bg-[#0E1119] border-b border-gray-800/60 px-4 sm:px-6 flex items-center justify-between text-xs text-gray-400 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="text-gray-300 font-medium text-[11px] truncate">
                {currentScenario.tagline}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[11px] text-gray-400 font-mono shrink-0">
              <span>Fokus: <strong className="text-amber-300 font-semibold">{currentScenario.badge}</strong></span>
              <span className="text-gray-600">•</span>
              <span>{steps.length} Langkah Terpandu</span>
            </div>
          </div>

          {/* Main Multi-Device Stage Canvas */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center no-scrollbar">

            {/* DYNAMIC SCENARIO CANVAS - TAMPILAN BERBEDA SESUAI DEMO YANG DIPILIH */}
            {selectedScenarioId === 'order_flow' && (
              <div className="flex items-center gap-6 max-w-7xl mx-auto animate-fade-in">
                {/* 1. Customer Smartphone */}
                <DeviceFrame
                  type="mobile"
                  title="App Pelanggan"
                  subtitle="PWA iOS / Android • Pesan & QRIS"
                  isActive={isActiveDevice('customer')}
                >
                  <CustomerApp />
                </DeviceFrame>

                {/* 2. Tablet POS Kasir */}
                <DeviceFrame
                  type="tablet"
                  title="POS Kasir Outlet"
                  subtitle="Tablet Kasir • Terima Pesanan Online"
                  isActive={isActiveDevice('pos')}
                >
                  <PosApp />
                </DeviceFrame>

                {/* 3. KDS Barista */}
                <DeviceFrame
                  type="tablet"
                  title="KDS Barista Dapur"
                  subtitle="Monitor Dapur • Racik & Potong Stok Resep"
                  isActive={isActiveDevice('kds')}
                >
                  <KdsApp />
                </DeviceFrame>

                {/* 4. Store Manager Smartphone */}
                <DeviceFrame
                  type="mobile"
                  title="App Operasi Outlet"
                  subtitle="Smartphone Store Manager • Pantau Stok & Shift"
                  isActive={isActiveDevice('ops')}
                >
                  <OpsApp initialTab="beranda" />
                </DeviceFrame>
              </div>
            )}

            {selectedScenarioId === 'purchase_flow' && (
              <div className="flex items-center gap-6 max-w-[1650px] mx-auto animate-fade-in w-full justify-center">
                {/* 1. Store Manager Smartphone: Buat PO & Terima Barang */}
                <DeviceFrame
                  type="mobile"
                  title="App Operasi Gerai"
                  subtitle="Store Manager • PO Tanpa Harga (BR-04) & Terima Fisik (BR-05)"
                  isActive={isActiveDevice('ops')}
                >
                  <OpsApp initialTab="po" />
                </DeviceFrame>

                {/* 2. Warehouse Central: Dispatching */}
                <DeviceFrame
                  type="desktop"
                  title="Gudang Logistik Pusat (ERP)"
                  subtitle="Dispatched Pasokan, Resi Logistik & Terbitkan Surat Jalan"
                  isActive={isActiveDevice('warehouse')}
                  className="w-[480px] xl:w-[540px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Pusat Backoffice')}
                >
                  <BackofficeApp initialMenu="warehouse" initialWarehouseSubTab="purchase_orders" />
                </DeviceFrame>

                {/* 3. Finance Central: True-Up HPP */}
                <DeviceFrame
                  type="desktop"
                  title="Finance & Akuntansi Pusat"
                  subtitle="Input Faktur Supplier Riil, Auto True-Up HPP & Saldo Hutang (BR-06)"
                  isActive={isActiveDevice('finance')}
                  className="w-[480px] xl:w-[540px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Pusat Backoffice')}
                >
                  <BackofficeApp initialMenu="finance" initialFinanceSubTab="debt_trueup" />
                </DeviceFrame>
              </div>
            )}

            {selectedScenarioId === 'hr_flow' && (
              <div className="flex items-center gap-6 max-w-[1650px] mx-auto animate-fade-in w-full justify-center">
                {/* 1. Barista Smartphone: Clock-In GPS */}
                <DeviceFrame
                  type="mobile"
                  title="Smartphone Barista"
                  subtitle="Presensi GPS Geofencing Radius 50m (Anti-Fake GPS)"
                  isActive={isActiveDevice('ops')}
                >
                  <OpsApp initialTab="shift" />
                </DeviceFrame>

                {/* 2. KDS Kitchen Display: Racik & SLA */}
                <DeviceFrame
                  type="tablet"
                  title="KDS Barista Dapur"
                  subtitle="Live Counter Output Cup & Stopwatch SLA Kecepatan"
                  isActive={isActiveDevice('kds')}
                >
                  <KdsApp />
                </DeviceFrame>

                {/* 3. Owner Dashboard: HR & Payroll */}
                <DeviceFrame
                  type="desktop"
                  title="Dashboard Owner (Modul HR)"
                  subtitle="Leaderboard Barista, Audit Presensi GPS & Estimasi Payroll"
                  isActive={isActiveDevice('owner')}
                  className="w-[520px] xl:w-[600px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Dashboard Owner')}
                >
                  <OwnerApp initialTab="hr" />
                </DeviceFrame>
              </div>
            )}

            {selectedScenarioId === 'finance_flow' && (
              <div className="flex items-center gap-6 max-w-[1650px] mx-auto animate-fade-in w-full justify-center">
                {/* 1. Tablet POS Kasir: Shift & Cash Count */}
                <DeviceFrame
                  type="tablet"
                  title="POS Kasir Outlet"
                  subtitle="Shift Kasir, Modal Float Rp 200k, & Blind Cash Count"
                  isActive={isActiveDevice('pos')}
                >
                  <PosApp />
                </DeviceFrame>

                {/* 2. Backoffice: Rekonsiliasi Kasir */}
                <DeviceFrame
                  type="desktop"
                  title="Audit & Rekonsiliasi Kasir"
                  subtitle="Pencocokan Kas Laci (Variance Rp 0) & Slip Setoran Bank"
                  isActive={isActiveDevice('recon')}
                  className="w-[480px] xl:w-[540px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Pusat Backoffice')}
                >
                  <BackofficeApp initialMenu="finance" initialFinanceSubTab="cashier_recon" />
                </DeviceFrame>

                {/* 3. Backoffice: Jurnal Umum & Cashflow */}
                <DeviceFrame
                  type="desktop"
                  title="Buku Jurnal Umum Finansial"
                  subtitle="Auto-Posting Debit Kas Bank & Kredit Kas Kasir Gerai"
                  isActive={isActiveDevice('journal')}
                  className="w-[480px] xl:w-[540px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Pusat Backoffice')}
                >
                  <BackofficeApp initialMenu="finance" initialFinanceSubTab="journal_feed" />
                </DeviceFrame>
              </div>
            )}

            {selectedScenarioId === 'petty_cash_flow' && (
              <div className="flex items-center gap-6 max-w-[1650px] mx-auto animate-fade-in w-full justify-center">
                {/* 1. Smartphone Ops: Pengajuan Kas */}
                <DeviceFrame
                  type="mobile"
                  title="App Operasi Gerai"
                  subtitle="Pengajuan Kas Kecil Darurat + Foto Nota Struk Fisik"
                  isActive={isActiveDevice('ops')}
                >
                  <OpsApp initialTab="kas" />
                </DeviceFrame>

                {/* 2. Backoffice: Portal Approval 3-Tier */}
                <DeviceFrame
                  type="desktop"
                  title="Portal Approval & Audit Nota"
                  subtitle="Validasi Plafon 3-Tier (Tier 1 Auto-Approved, Tier 2-3 Review)"
                  isActive={isActiveDevice('approvals')}
                  className="w-[480px] xl:w-[540px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Pusat Backoffice')}
                >
                  <BackofficeApp initialMenu="approvals" />
                </DeviceFrame>

                {/* 3. Owner Dashboard: Biaya Cabang */}
                <DeviceFrame
                  type="desktop"
                  title="Dashboard Owner: Kontrol Biaya"
                  subtitle="Monitoring Beban Operasional & Pengeluaran Kas Gerai"
                  isActive={isActiveDevice('owner')}
                  className="w-[480px] xl:w-[540px] shrink-0"
                  screenHeight="h-[460px]"
                  onMaximize={() => setFocusedApp('Dashboard Owner')}
                >
                  <OwnerApp initialTab="cockpit" />
                </DeviceFrame>
              </div>
            )}
          </div>

          {/* Bottom Subtitle / Live Narrative Bar */}
          <div className="h-16 bg-[#161B26] border-t border-gray-800 px-6 flex items-center justify-between shrink-0 text-xs font-medium z-30">
            <div className="flex items-center gap-3 max-w-4xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="text-gray-400 font-mono text-[10px] uppercase block">
                  {currentScenario.name} • Langkah {Math.min(currentStepIndex + 1, steps.length)} dari {steps.length}
                </span>
                <span className="text-gray-200 font-bold text-xs line-clamp-1">
                  {currentNarrative || `${steps[0]?.title}: ${steps[0]?.narration}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Context shortcut */}
              {(selectedScenarioId === 'purchase_flow' || selectedScenarioId === 'finance_flow') && (
                <button
                  onClick={() => setFocusedApp('Pusat Backoffice')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Backoffice ERP</span>
                </button>
              )}

              {selectedScenarioId === 'hr_flow' && (
                <button
                  onClick={() => setFocusedApp('Dashboard Owner')}
                  className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800/80 text-purple-300 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Modul HR Owner</span>
                </button>
              )}

              <div className="flex items-center gap-2 font-mono text-amber-400 font-bold shrink-0">
                <span className="text-xs">Step {Math.min(currentStepIndex + 1, steps.length)}/{steps.length}</span>
                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${((Math.min(currentStepIndex + 1, steps.length)) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
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
        <div className="fixed top-16 right-0 bottom-16 w-96 bg-[#161B26] border-l border-gray-800 shadow-2xl z-40 flex flex-col text-xs font-mono">
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
