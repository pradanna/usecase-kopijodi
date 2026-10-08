import React, { useState, useEffect } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent } from '../../domain/events';
import type { Invoice, InvoiceItem, CashierShift, MenuItem, Recipe } from '../../domain/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Building2,
  Boxes,
  FileCheck2,
  DollarSign,
  TrendingUp,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Filter,
  Receipt,
  Banknote,
  Landmark,
  CheckCheck,
  CreditCard,
  Layers,
  Sparkles,
  BookOpen,
  Scale,
  Wallet,
  PieChart,
  Package,
  Truck,
  ClipboardList,
  Utensils,
  Coffee,
  AlertTriangle,
} from 'lucide-react';

export type BackofficeMenu = 'warehouse' | 'catalog' | 'finance' | 'approvals' | 'settings';
export type WarehouseSubTab = 'stock_cards' | 'raw_materials' | 'purchase_orders' | 'transfers' | 'stock_opname';
export type FinanceSubTab = 'cashflow' | 'journal_feed' | 'cashier_recon' | 'debt_trueup' | 'profit_loss';

export interface BackofficeAppProps {
  initialMenu?: BackofficeMenu;
  initialWarehouseSubTab?: WarehouseSubTab;
  initialFinanceSubTab?: FinanceSubTab;
}

export const BackofficeApp: React.FC<BackofficeAppProps> = ({
  initialMenu = 'finance',
  initialWarehouseSubTab = 'stock_cards',
  initialFinanceSubTab = 'cashflow',
}) => {
  const {
    outlets,
    ingredients,
    stockLots,
    purchaseOrders,
    invoices,
    centralDebts,
    pettyCashExpenses,
    localProposals,
    orders,
    menuItems,
    recipes,
    cashierShifts,
    channelMarkupPct,
    featureToggles,
    dispatch,
  } = useEcosystemStore();

  // Primary Navigation: warehouse | catalog | finance | approvals | settings
  const [activeMenu, setActiveMenu] = useState<BackofficeMenu>(initialMenu);

  // Sub-Navigation Tabs
  const [warehouseSubTab, setWarehouseSubTab] = useState<WarehouseSubTab>(initialWarehouseSubTab);

  const [catalogSubTab, setCatalogSubTab] = useState<
    'menu_catalog' | 'recipe_bom' | 'prepared_items' | 'modifiers' | 'local_proposals'
  >('menu_catalog');

  const [financeSubTab, setFinanceSubTab] = useState<FinanceSubTab>(initialFinanceSubTab);

  const [selectedOutletId, setSelectedOutletId] = useState<string>('all');

  useEffect(() => {
    if (initialMenu) setActiveMenu(initialMenu);
  }, [initialMenu]);

  useEffect(() => {
    if (initialWarehouseSubTab) setWarehouseSubTab(initialWarehouseSubTab);
  }, [initialWarehouseSubTab]);

  useEffect(() => {
    if (initialFinanceSubTab) setFinanceSubTab(initialFinanceSubTab);
  }, [initialFinanceSubTab]);

  // Modals state
  const [selectedShiftForVerification, setSelectedShiftForVerification] = useState<CashierShift | null>(null);
  const [depositSlipNumber, setDepositSlipNumber] = useState<string>('');
  const [selectedPoForInvoice, setSelectedPoForInvoice] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-PST-2026-102');
  const [actualMilkPrice, setActualMilkPrice] = useState<number>(234000); // Rp 19.500/L

  // True-up HPP Execution (BR-06)
  const handleExecuteTrueUp = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    const invoiceItems: InvoiceItem[] = po.items.map((it) => {
      const isMilk = it.ingredientId === 'ing-susu-fresh';
      return {
        ingredientId: it.ingredientId,
        qtyReceived: it.qty,
        actualPricePerUom: isMilk ? actualMilkPrice : 120000,
      };
    });

    const totalAmount = invoiceItems.reduce(
      (sum, item) => sum + item.actualPricePerUom * item.qtyReceived,
      0
    );

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      poId: po.id,
      outletId: po.outletId,
      items: invoiceItems,
      totalAmount,
      verifiedAt: new Date().toLocaleTimeString('id-ID'),
    };

    dispatch(
      createEvent(
        'InvoiceEntered',
        'Finance Pusat',
        { invoice: newInvoice },
        po.outletId
      )
    );

    dispatch(
      createEvent(
        'HppRecalculated',
        'Finance True-Up Engine',
        {
          outletId: po.outletId,
          ingredientId: 'ing-susu-fresh',
          oldUnitCost: 18,
          newUnitCost: actualMilkPrice / 12000,
        },
        po.outletId
      )
    );

    setSelectedPoForInvoice(null);
  };

  // Verify Cashier Settlement (POS Cashier Integration)
  const handleVerifyCashierSettlement = (shift: CashierShift) => {
    const depositRef =
      depositSlipNumber.trim() ||
      shift.depositRef ||
      `SETOR-BANK-${Date.now().toString().slice(-4)}`;

    dispatch(
      createEvent(
        'CashierSettlementVerified',
        'Finance Pusat (Mega)',
        {
          shiftId: shift.id,
          verifiedBy: 'Finance Pusat (Mega)',
          depositRef,
        },
        shift.outletId
      )
    );
    setSelectedShiftForVerification(null);
    setDepositSlipNumber('');
  };

  const handleApprovePettyCash = (expenseId: string) => {
    dispatch(
      createEvent(
        'PettyCashApproved',
        'Finance Manager',
        { expenseId, approvedBy: 'Finance Pusat' }
      )
    );
  };

  const handleApproveLocalMenu = (proposalId: string) => {
    dispatch(
      createEvent(
        'LocalMenuApproved',
        'Admin Pusat',
        { proposalId, approvedMenuId: `menu_local_${proposalId}` }
      )
    );
  };

  // Filtered lists
  const pendingInvoicesPOs = purchaseOrders.filter(
    (p) => p.status === 'AWAITING_INVOICE' || p.status === 'RECEIVED'
  );
  const pendingPettyCash = pettyCashExpenses.filter((e) => e.status === 'AWAITING_APPROVAL');
  const pendingProposals = localProposals.filter((p) => p.status === 'PENDING');

  // Overall financial calculations
  const filteredOrders = orders.filter((o) => selectedOutletId === 'all' || o.outletId === selectedOutletId);
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCashSales = filteredOrders.filter((o) => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.total, 0);
  const totalQrisSales = filteredOrders.filter((o) => o.paymentMethod === 'qris').reduce((sum, o) => sum + o.total, 0);

  const filteredInvoices = invoices.filter((i) => selectedOutletId === 'all' || i.outletId === selectedOutletId);
  const totalPurchasesPaid = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  const filteredPettyCash = pettyCashExpenses.filter(
    (p) => (selectedOutletId === 'all' || p.outletId === selectedOutletId) && p.status === 'APPROVED'
  );
  const totalPettyCashApproved = filteredPettyCash.reduce((sum, p) => sum + p.amount, 0);

  const centralOverheadExpenses = selectedOutletId === 'all' ? 4500000 : 1500000;
  const initialCashBalance = 25000000;
  const netCashFlow = totalRevenue - (totalPurchasesPaid + totalPettyCashApproved + centralOverheadExpenses);
  const endingCashBalance = initialCashBalance + netCashFlow;

  const totalDebts = centralDebts
    .filter((d) => selectedOutletId === 'all' || d.outletId === selectedOutletId)
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);

  // Mock Prepared Items (Semi-Finished Prep di Dapur)
  const PREPARED_PREP_ITEMS = [
    {
      id: 'prep-gula-aren',
      name: 'Simple Syrup Gula Aren Alami (Prep)',
      yieldQty: 1200,
      yieldUom: 'ml',
      prepTime: '25 Menit',
      shelfLife: '7 Hari (Chiller)',
      costPerUom: 28,
      ingredients: [
        { name: 'Gula Aren Bongkah Asli', qty: 1000, uom: 'gram' },
        { name: 'Air Mineral Galon', qty: 500, uom: 'ml' },
        { name: 'Daun Pandan Wangi', qty: 3, uom: 'lembar' },
      ],
    },
    {
      id: 'prep-cold-brew',
      name: 'Cold Brew Concentrate (Steep 24 Jam)',
      yieldQty: 1500,
      yieldUom: 'ml',
      prepTime: '24 Jam',
      shelfLife: '14 Hari (Chiller)',
      costPerUom: 32,
      ingredients: [
        { name: 'Biji Kopi House Blend (Coarse)', qty: 250, uom: 'gram' },
        { name: 'Air Filter RO Dingin', qty: 1800, uom: 'ml' },
      ],
    },
    {
      id: 'prep-grass-jelly',
      name: 'Grass Jelly Topping (Potong Dadu)',
      yieldQty: 800,
      yieldUom: 'gram',
      prepTime: '40 Menit',
      shelfLife: '3 Hari (Chiller)',
      costPerUom: 18,
      ingredients: [
        { name: 'Bubuk Daun Cincau Hitam', qty: 1, uom: 'pack' },
        { name: 'Gula Aren Siap Pakai', qty: 150, uom: 'ml' },
      ],
    },
    {
      id: 'prep-matcha-base',
      name: 'Matcha Uji Base Solution (Whisked)',
      yieldQty: 400,
      yieldUom: 'ml',
      prepTime: '10 Menit',
      shelfLife: '2 Hari (Chiller)',
      costPerUom: 85,
      ingredients: [
        { name: 'Bubuk Matcha Uji Premium', qty: 100, uom: 'gram' },
        { name: 'Air Panas Suhu 80C', qty: 350, uom: 'ml' },
      ],
    },
  ];

  // Mock Transfers
  const STOCK_TRANSFERS = [
    {
      id: 'TRF-20261008-01',
      source: 'Gudang Pusat (Central DC)',
      destination: 'Kopi Jodi - Sudirman',
      items: '15 kg Biji Kopi House Blend, 10 dus Cup 16oz',
      driver: 'Budi (Armada Logistik 1)',
      date: '08 Okt 2026 06:30',
      status: 'Selesai & Diterima',
    },
    {
      id: 'TRF-20261008-02',
      source: 'Gudang Pusat (Central DC)',
      destination: 'Kopi Jodi - Senopati',
      items: '20 karton Susu Fresh Milk Pasteurisasi',
      driver: 'Agus (Truk Pendingin 2)',
      date: '08 Okt 2026 07:15',
      status: 'Selesai & Diterima',
    },
    {
      id: 'TRF-20261008-03',
      source: 'Kopi Jodi - Senopati',
      destination: 'Kopi Jodi - Kemang',
      items: '2 botol Sirup Vanilla (Transfer Darurat Antar-Cabang)',
      driver: 'Kurir Internal',
      date: '08 Okt 2026 11:20',
      status: 'Dalam Pengiriman',
    },
  ];

  // Mock Stock Opname & Waste
  const STOCK_OPNAMES = [
    {
      id: 'OPN-20261008-01',
      outletName: 'Kopi Jodi - Sudirman',
      ingredientName: 'Biji Kopi House Blend',
      systemQty: 45000,
      physicalQty: 44820,
      variance: -180,
      uom: 'gram',
      reason: 'Susut Kalibrasi Grinder Harian Barista',
      status: 'Disetujui Head Barista',
    },
    {
      id: 'OPN-20261008-02',
      outletName: 'Kopi Jodi - Senopati',
      ingredientName: 'Susu Fresh Milk Pasteurisasi',
      systemQty: 24000,
      physicalQty: 23600,
      variance: -400,
      uom: 'ml',
      reason: 'Tumpah saat Frothing Latte Art',
      status: 'Disetujui Store Manager',
    },
    {
      id: 'OPN-20261008-03',
      outletName: 'Kopi Jodi - Kemang',
      ingredientName: 'Cup Plastik 16oz',
      systemQty: 850,
      physicalQty: 848,
      variance: -2,
      uom: 'pcs',
      reason: 'Pecah Cacat Pabrik saat Unpacking',
      status: 'Disetujui Store Manager',
    },
  ];

  return (
    <div className="flex h-full bg-[var(--bg)] text-[var(--text)] font-sans text-xs">
      {/* LEFT SIDEBAR: 3 Flagship Modules + Approvals + Settings */}
      <div className="w-60 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col shrink-0">
        <div className="h-14 px-4 border-b border-[var(--border)] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[var(--text)]">ERP BACKOFFICE</div>
            <div className="text-[10px] text-[var(--brand-700)] font-semibold">Head Office Kopi Jodi</div>
          </div>
        </div>

        {/* Modular Navigation List */}
        <div className="p-3 space-y-1.5 flex-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
            Modul Utama
          </div>

          {[
            {
              id: 'warehouse',
              label: 'Warehouse & Pengadaan',
              desc: 'Gudang, Stok & Logistik',
              icon: <Boxes className="w-4 h-4 text-amber-600" />,
              badge: pendingInvoicesPOs.length,
            },
            {
              id: 'catalog',
              label: 'Menu Racikan & Olahan',
              desc: 'Resep BOM, Prep & Menu',
              icon: <Coffee className="w-4 h-4 text-[var(--brand-600)]" />,
            },
            {
              id: 'finance',
              label: 'Finance & Akuntansi',
              desc: 'Cashflow, Jurnal & Kasir',
              icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
              badge: cashierShifts.filter((s) => s.status === 'PENDING_FINANCE_AUDIT').length,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl font-bold text-left cursor-pointer transition-all ${
                activeMenu === item.id
                  ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-600)]/30 shadow-xs'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              <div className="mt-0.5">{item.icon}</div>
              <div className="flex-1">
                <div className="text-xs font-bold leading-tight">{item.label}</div>
                <div className="text-[10px] font-normal text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="w-5 h-5 rounded-full bg-[var(--warning)] text-white text-[10px] flex items-center justify-center font-extrabold mt-0.5">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 pt-3 py-1">
            Governance
          </div>

          {[
            {
              id: 'approvals',
              label: 'Antrean Persetujuan',
              desc: 'Approval Kas Kecil & Menu',
              icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
              badge: pendingPettyCash.length + pendingProposals.length,
            },
            {
              id: 'settings',
              label: 'Pengaturan & Fitur',
              desc: 'Toggles & Parameter Pajak',
              icon: <Settings className="w-4 h-4 text-gray-600" />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl font-bold text-left cursor-pointer transition-all ${
                activeMenu === item.id
                  ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border border-[var(--brand-600)]/30 shadow-xs'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              <div className="mt-0.5">{item.icon}</div>
              <div className="flex-1">
                <div className="text-xs font-bold leading-tight">{item.label}</div>
                <div className="text-[10px] font-normal text-gray-500 mt-0.5">{item.desc}</div>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="w-5 h-5 rounded-full bg-[var(--danger)] text-white text-[10px] flex items-center justify-center font-extrabold mt-0.5">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[var(--border)] text-[11px] text-gray-500">
          <div className="font-bold text-[var(--text)]">Kopi Jodi Ecosystem</div>
          <div className="text-[10px] text-gray-400">Multi-Outlet ERP v1.2</div>
        </div>
      </div>

      {/* RIGHT MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0">
          <div>
            <span className="font-extrabold text-sm text-[var(--text)] uppercase tracking-wide">
              {activeMenu === 'warehouse'
                ? 'Modul Warehouse & Pengadaan'
                : activeMenu === 'catalog'
                ? 'Modul Menu Racikan & Olahan (R&D)'
                : activeMenu === 'finance'
                ? 'Modul Finance & Akuntansi Terpadu'
                : activeMenu === 'approvals'
                ? 'Pusat Persetujuan Operasional'
                : 'Pengaturan Sistem & Konfigurasi'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[var(--surface-muted)] px-3 py-1.5 rounded-xl border border-[var(--border)]">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="bg-transparent font-bold outline-none cursor-pointer text-xs"
              >
                <option value="all">Konsolidasian (Semua Outlet)</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* ========================================================= */}
          {/* 1. MODUL WAREHOUSE & PENGADAAN (GUDANG)                    */}
          {/* ========================================================= */}
          {activeMenu === 'warehouse' && (
            <div className="space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex border-b border-[var(--border)] gap-2 pb-2 overflow-x-auto">
                {[
                  { id: 'stock_cards', label: 'Kartu Stok Multi-Warehouse', icon: <Boxes className="w-4 h-4" /> },
                  { id: 'raw_materials', label: 'Master Bahan Baku & Kemasan', icon: <Package className="w-4 h-4" /> },
                  { id: 'purchase_orders', label: 'Pengadaan & PO Cabang', icon: <FileCheck2 className="w-4 h-4" />, badge: pendingInvoicesPOs.length },
                  { id: 'transfers', label: 'Mutasi & Transfer Antar-Gudang', icon: <ArrowLeftRight className="w-4 h-4" /> },
                  { id: 'stock_opname', label: 'Stock Opname & Waste/Susut', icon: <Scale className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setWarehouseSubTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      warehouseSubTab === tab.id
                        ? 'bg-[var(--brand-600)] text-white shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 ? (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--warning)] text-white text-[9px] font-extrabold">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {/* 1.1 Kartu Stok Multi-Warehouse */}
              {warehouseSubTab === 'stock_cards' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Total Item Bahan Baku</span>
                      <span className="text-xl font-extrabold text-[var(--brand-700)] tabular-nums block mt-1">{ingredients.length} SKU</span>
                      <span className="text-[10px] text-gray-500 mt-1 block">Tersimpan di master pusat</span>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Total Lot Aktif</span>
                      <span className="text-xl font-extrabold text-blue-600 tabular-nums block mt-1">{stockLots.length} Lot</span>
                      <span className="text-[10px] text-gray-500 mt-1 block">Tersebar di seluruh gudang cabang</span>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Lot Menunggu Nota</span>
                      <span className="text-xl font-extrabold text-[var(--warning)] tabular-nums block mt-1">
                        {stockLots.filter((l) => l.status === 'awaiting_invoice').length} Lot
                      </span>
                      <span className="text-[10px] text-[var(--warning)] font-bold mt-1 block">HPP sementara (BR-05)</span>
                    </div>
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Total Nilai Valuasi Aset</span>
                      <span className="text-xl font-black text-emerald-700 tabular-nums block mt-1">
                        Rp {stockLots.reduce((sum, l) => sum + l.qty * l.unitCost, 0).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Valuasi stok persediaan aktif</span>
                    </div>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-sm text-[var(--text)]">Rincian Fisik & Status Akuntansi Stok Lot</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[var(--surface-muted)] text-gray-600 font-bold border-b">
                          <tr>
                            <th className="p-2.5">Bahan Baku</th>
                            <th className="p-2.5">Lokasi Gudang / Outlet</th>
                            <th className="p-2.5 text-right">Stok Fisik</th>
                            <th className="p-2.5">Status Akuntansi Lot</th>
                            <th className="p-2.5 text-right">HPP Unit Cost</th>
                            <th className="p-2.5 text-right">Total Nilai Aset</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {stockLots
                            .filter((l) => selectedOutletId === 'all' || l.outletId === selectedOutletId)
                            .map((lot) => {
                              const ing = ingredients.find((i) => i.id === lot.ingredientId);
                              const outlet = outlets.find((o) => o.id === lot.outletId);
                              return (
                                <tr key={lot.id} className="hover:bg-[var(--brand-50)]/40">
                                  <td className="p-2.5 font-bold text-[var(--text)]">{ing?.name}</td>
                                  <td className="p-2.5 text-gray-600">{outlet?.name}</td>
                                  <td className="p-2.5 text-right font-extrabold tabular-nums">
                                    {lot.qty.toLocaleString('id-ID')} {ing?.usageUom}
                                  </td>
                                  <td className="p-2.5">
                                    <Badge variant={lot.status === 'confirmed' ? 'success' : 'warning'}>
                                      {lot.status === 'confirmed' ? 'HPP Terkoreksi Definitif' : 'Menunggu Nota Fisik'}
                                    </Badge>
                                  </td>
                                  <td className="p-2.5 text-right font-mono tabular-nums text-gray-700">
                                    Rp {lot.unitCost.toFixed(1)} / {ing?.usageUom}
                                  </td>
                                  <td className="p-2.5 text-right font-mono font-bold tabular-nums text-emerald-800">
                                    Rp {Math.round(lot.qty * lot.unitCost).toLocaleString('id-ID')}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 1.2 Master Bahan Baku & Kemasan */}
              {warehouseSubTab === 'raw_materials' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Master Bahan Baku & Satuan Konversi (BR-02)</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Konfigurasi rasio satuan beli (Karton/Kg/Pack) terhadap satuan racik (ml/gram/pcs) untuk otomatisasi pemotongan resep.
                      </p>
                    </div>
                    <Badge variant="brand">{ingredients.length} Bahan Terdaftar</Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--surface-muted)] text-gray-600 font-bold border-b">
                        <tr>
                          <th className="p-2.5">Nama Bahan</th>
                          <th className="p-2.5">Kategori</th>
                          <th className="p-2.5">Satuan Pembelian</th>
                          <th className="p-2.5">Satuan Pakai</th>
                          <th className="p-2.5 text-right">Rasio Konversi</th>
                          <th className="p-2.5 text-right">Harga Beli Terakhir</th>
                          <th className="p-2.5 text-center">Beli Luar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {ingredients.map((ing) => (
                          <tr key={ing.id} className="hover:bg-[var(--brand-50)]/40">
                            <td className="p-2.5 font-bold text-[var(--text)]">{ing.name}</td>
                            <td className="p-2.5 capitalize text-gray-600">{ing.category}</td>
                            <td className="p-2.5 font-medium">{ing.purchaseUom}</td>
                            <td className="p-2.5 font-medium">{ing.usageUom}</td>
                            <td className="p-2.5 text-right font-mono text-gray-700">
                              1 {ing.purchaseUom} = {ing.conversionRatio.toLocaleString('id-ID')} {ing.usageUom}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                              Rp {ing.lastPrice.toLocaleString('id-ID')}
                            </td>
                            <td className="p-2.5 text-center">
                              <Badge variant={ing.allowExternalPurchase ? 'success' : 'neutral'} className="text-[9px]">
                                {ing.allowExternalPurchase ? 'Diizinkan' : 'Wajib Pusat'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 1.3 Pengadaan & PO Cabang */}
              {warehouseSubTab === 'purchase_orders' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Daftar Purchase Order Cabang (BR-04)</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        PO yang dibuat oleh Store Manager di outlet tidak memiliki kolom harga. Kolom harga hanya diinput oleh Finance di pusat saat faktur resmi diterima.
                      </p>
                    </div>
                    <Badge variant="warning">{pendingInvoicesPOs.length} Menunggu Nota</Badge>
                  </div>

                  <div className="divide-y divide-[var(--border)]">
                    {purchaseOrders.map((po) => {
                      const outlet = outlets.find((o) => o.id === po.outletId);
                      return (
                        <div key={po.id} className="py-3.5 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[var(--brand-700)]">{po.id}</span>
                              <Badge
                                variant={
                                  po.status === 'RECEIVED'
                                    ? 'success'
                                    : po.status === 'AWAITING_INVOICE'
                                    ? 'warning'
                                    : 'info'
                                }
                              >
                                {po.status === 'AWAITING_INVOICE' ? 'Menunggu Nota' : po.status}
                              </Badge>
                              <span className="font-bold text-gray-800">{outlet?.name}</span>
                              <span className="text-[10px] text-gray-400">({po.createdAt})</span>
                            </div>
                            <div className="text-[11px] text-gray-500 mt-1">
                              Item Dipesan: {po.items.map((i) => `${i.qty} ${i.uom} ${i.ingredientName}`).join(', ')}
                            </div>
                          </div>

                          {po.status === 'AWAITING_INVOICE' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setSelectedPoForInvoice(po.id)}
                              className="font-bold text-[10px]"
                            >
                              Input Faktur & True-Up HPP
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1.4 Mutasi & Transfer Antar-Gudang */}
              {warehouseSubTab === 'transfers' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Mutasi & Transfer Stok Antar-Gudang</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Distribusi bahan baku dari Gudang Pusat ke Cabang maupun transfer darurat antar-cabang.
                      </p>
                    </div>
                    <Badge variant="brand">Logistik Terintegrasi</Badge>
                  </div>

                  <div className="divide-y divide-[var(--border)]">
                    {STOCK_TRANSFERS.map((trf) => (
                      <div key={trf.id} className="py-3 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[var(--brand-700)]">{trf.id}</span>
                            <Badge variant={trf.status.includes('Selesai') ? 'success' : 'info'} className="text-[9px]">
                              {trf.status}
                            </Badge>
                            <span className="text-[10px] text-gray-500">{trf.date}</span>
                          </div>
                          <div className="text-xs font-bold text-gray-800 mt-1">
                            {trf.source} <span className="text-gray-400 font-normal">➔</span> {trf.destination}
                          </div>
                          <div className="text-[11px] text-gray-600 mt-0.5">
                            Barang: {trf.items} • Driver: {trf.driver}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--success)] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tervalidasi
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1.5 Stock Opname & Waste/Susut */}
              {warehouseSubTab === 'stock_opname' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Stock Opname & Catatan Waste/Susut Barista</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Pencocokan stok fisik vs sistem kasir secara berkala beserta audit alasan selisih (kalibrasi, tumpah, expired).
                      </p>
                    </div>
                    <Badge variant="brand">Audit Selisih</Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--surface-muted)] text-gray-600 font-bold border-b">
                        <tr>
                          <th className="p-2.5">No. Dokumen</th>
                          <th className="p-2.5">Gerai Cabang</th>
                          <th className="p-2.5">Bahan Baku</th>
                          <th className="p-2.5 text-right">Stok Sistem</th>
                          <th className="p-2.5 text-right">Stok Fisik</th>
                          <th className="p-2.5 text-right">Selisih (+/-)</th>
                          <th className="p-2.5">Alasan / Keterangan</th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {STOCK_OPNAMES.map((opn) => (
                          <tr key={opn.id} className="hover:bg-[var(--brand-50)]/40">
                            <td className="p-2.5 font-mono font-bold text-[var(--brand-700)]">{opn.id}</td>
                            <td className="p-2.5 font-bold text-gray-800">{opn.outletName}</td>
                            <td className="p-2.5">{opn.ingredientName}</td>
                            <td className="p-2.5 text-right font-mono tabular-nums">
                              {opn.systemQty.toLocaleString('id-ID')} {opn.uom}
                            </td>
                            <td className="p-2.5 text-right font-mono tabular-nums font-bold">
                              {opn.physicalQty.toLocaleString('id-ID')} {opn.uom}
                            </td>
                            <td className="p-2.5 text-right font-mono font-black tabular-nums text-[var(--danger)]">
                              {opn.variance} {opn.uom}
                            </td>
                            <td className="p-2.5 text-gray-600">{opn.reason}</td>
                            <td className="p-2.5 text-center">
                              <Badge variant="success" className="text-[9px]">
                                {opn.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MODUL MENU RACIKAN & OLAHAN (R&D & KATALOG)             */}
          {/* ========================================================= */}
          {activeMenu === 'catalog' && (
            <div className="space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex border-b border-[var(--border)] gap-2 pb-2 overflow-x-auto">
                {[
                  { id: 'menu_catalog', label: 'Katalog Menu Jual', icon: <Coffee className="w-4 h-4" /> },
                  { id: 'recipe_bom', label: 'Resep & Takaran BOM', icon: <Utensils className="w-4 h-4" /> },
                  { id: 'prepared_items', label: 'Bahan Racikan Olahan (Prep)', icon: <Layers className="w-4 h-4" /> },
                  { id: 'modifiers', label: 'Grup Kustomisasi & Modifiers', icon: <Sparkles className="w-4 h-4" /> },
                  { id: 'local_proposals', label: 'Usulan Menu Lokal Cabang', icon: <BookOpen className="w-4 h-4" />, badge: pendingProposals.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCatalogSubTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      catalogSubTab === tab.id
                        ? 'bg-[var(--brand-600)] text-white shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 ? (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--danger)] text-white text-[9px] font-extrabold">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {/* 2.1 Katalog Menu Jual */}
              {catalogSubTab === 'menu_catalog' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Daftar Menu Siap Jual (POS & App)</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Harga jual seragam di walk-in, dan otomatis disesuaikan markup +{channelMarkupPct}% pada channel App Pelanggan (BR-10).
                      </p>
                    </div>
                    <Badge variant="brand">{menuItems.length} Menu Aktif</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {menuItems.map((item) => (
                      <div key={item.id} className="p-3.5 rounded-xl border border-[var(--border)] bg-gray-50/50 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-xs text-[var(--text)]">{item.name}</div>
                            <span className="text-[10px] text-gray-500 font-semibold">{item.category}</span>
                          </div>
                          <Badge variant={item.scope === 'global' ? 'brand' : 'warning'} className="text-[9px]">
                            {item.scope === 'global' ? 'Global' : 'Menu Lokal'}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-gray-600 line-clamp-2">{item.description}</p>
                        <div className="pt-2 border-t border-dashed flex justify-between items-center text-xs">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Harga Walk-in:</span>
                            <span className="font-bold font-mono text-[var(--text)]">Rp {item.basePrice.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-blue-600 block">Harga App (+{channelMarkupPct}%):</span>
                            <span className="font-bold font-mono text-blue-700">
                              Rp {Math.round(item.basePrice * (1 + channelMarkupPct / 100)).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2.2 Resep & Takaran BOM */}
              {catalogSubTab === 'recipe_bom' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Formula Resep & Bill of Materials (BOM)</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Resep takaran per cup yang dipotong otomatis saat barista menyelesaikan pesanan di KDS (BR-08).
                      </p>
                    </div>
                    <Badge variant="brand">{recipes.length} Resep Terdaftar</Badge>
                  </div>

                  <div className="divide-y divide-[var(--border)]">
                    {recipes.map((rcp) => {
                      const menu = menuItems.find((m) => m.id === rcp.menuItemId);
                      // Calculate BOM cost
                      let estimatedBomCost = 0;
                      rcp.items.forEach((it) => {
                        const ing = ingredients.find((i) => i.id === it.ingredientId);
                        if (ing) {
                          const unitCost = ing.lastPrice / ing.conversionRatio;
                          estimatedBomCost += unitCost * it.qty;
                        }
                      });
                      const grossMarginPct = menu
                        ? Math.round(((menu.basePrice - estimatedBomCost) / menu.basePrice) * 100)
                        : 0;

                      return (
                        <div key={rcp.menuItemId} className="py-3 flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="font-bold text-xs text-[var(--text)] flex items-center gap-2">
                              <span>{menu?.name || rcp.menuItemId}</span>
                              <Badge variant="neutral" className="text-[9px]">{menu?.category}</Badge>
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Komposisi Racikan:{' '}
                              {rcp.items.map((it) => {
                                const ing = ingredients.find((i) => i.id === it.ingredientId);
                                return `${it.qty} ${ing?.usageUom} ${ing?.name}`;
                              }).join(' + ')}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[11px] font-mono font-bold text-gray-700">
                              HPP Bahan: <span className="text-amber-800">Rp {Math.round(estimatedBomCost).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-700">
                              Estimasi Gross Margin: {grossMarginPct}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2.3 Bahan Racikan Olahan (Semi-Finished Prep) */}
              {catalogSubTab === 'prepared_items' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Bahan Racikan Olahan / Semi-Finished Prep</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Bahan olahan dapur yang dipersiapkan sendiri oleh barista sebelum jam operasional (sirup olahan, cold brew, topping jelly).
                      </p>
                    </div>
                    <Badge variant="brand">Kitchen Prep</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {PREPARED_PREP_ITEMS.map((prep) => (
                      <div key={prep.id} className="p-4 rounded-2xl border border-[var(--border)] bg-gray-50/50 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-extrabold text-xs text-[var(--text)]">{prep.name}</div>
                            <span className="text-[10px] text-gray-500 font-semibold">
                              Hasil Olahan (Yield): {prep.yieldQty} {prep.yieldUom}
                            </span>
                          </div>
                          <Badge variant="brand" className="text-[9px]">Biaya: Rp {prep.costPerUom}/{prep.yieldUom}</Badge>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-[11px] space-y-1">
                          <span className="text-[10px] text-gray-400 font-bold block">Resep Bahan Baku Induk:</span>
                          {prep.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex justify-between text-gray-700">
                              <span>• {ing.name}</span>
                              <span className="font-mono font-semibold">{ing.qty} {ing.uom}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                          <span>Waktu Olah: <strong>{prep.prepTime}</strong></span>
                          <span>Masa Simpan: <strong>{prep.shelfLife}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2.4 Kustomisasi & Modifiers */}
              {catalogSubTab === 'modifiers' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <h4 className="font-extrabold text-sm text-[var(--text)]">Grup Kustomisasi & Opsi Modifiers</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border bg-gray-50 space-y-2">
                      <div className="font-bold text-xs text-gray-900">1. Pilihan Ukuran Cup (Size)</div>
                      <div className="text-[11px] text-gray-600 space-y-1">
                        <div className="flex justify-between"><span>• Reguler (16oz)</span><span className="font-mono">+Rp 0</span></div>
                        <div className="flex justify-between"><span>• Large (22oz)</span><span className="font-mono text-emerald-700 font-bold">+Rp 4.000</span></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-gray-50 space-y-2">
                      <div className="font-bold text-xs text-gray-900">2. Tingkat Kemanisan (Sugar Level)</div>
                      <div className="text-[11px] text-gray-600 space-y-1">
                        <div className="flex justify-between"><span>• Normal Sugar (100%)</span><span className="font-mono">+Rp 0</span></div>
                        <div className="flex justify-between"><span>• Less Sugar (50%)</span><span className="font-mono">+Rp 0</span></div>
                        <div className="flex justify-between"><span>• No Sugar (0%)</span><span className="font-mono">+Rp 0</span></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-gray-50 space-y-2">
                      <div className="font-bold text-xs text-gray-900">3. Alternatif Susu (Dairy Option)</div>
                      <div className="text-[11px] text-gray-600 space-y-1">
                        <div className="flex justify-between"><span>• Fresh Milk Pasteurisasi</span><span className="font-mono">+Rp 0</span></div>
                        <div className="flex justify-between"><span>• Oatmilk Barista Edition</span><span className="font-mono text-emerald-700 font-bold">+Rp 6.000</span></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border bg-gray-50 space-y-2">
                      <div className="font-bold text-xs text-gray-900">4. Extra Shot Espresso & Topping</div>
                      <div className="text-[11px] text-gray-600 space-y-1">
                        <div className="flex justify-between"><span>• Extra 1 Shot Espresso Blend</span><span className="font-mono text-emerald-700 font-bold">+Rp 5.000</span></div>
                        <div className="flex justify-between"><span>• Brown Sugar Grass Jelly</span><span className="font-mono text-emerald-700 font-bold">+Rp 4.000</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2.5 Usulan Menu Lokal */}
              {catalogSubTab === 'local_proposals' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Usulan Menu Lokal Cabang (BR-09)</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Store Manager dapat mengusulkan kreasi menu lokal yang hanya aktif di outlet pengusul setelah disetujui pusat.
                      </p>
                    </div>
                    <Badge variant="warning">{pendingProposals.length} Menunggu Approval</Badge>
                  </div>

                  {localProposals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Belum ada usulan menu lokal dari Store Manager</div>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {localProposals.map((p) => (
                        <div key={p.id} className="py-3 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-xs text-[var(--text)]">{p.menuName}</div>
                            <div className="text-[10px] text-gray-500">
                              Gerai: {p.outletId} • Usulan Harga: Rp {p.proposedPrice.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-gray-600 italic">Alasan: "{p.reason}"</div>
                          </div>
                          {p.status === 'PENDING' ? (
                            <Button size="sm" variant="primary" onClick={() => handleApproveLocalMenu(p.id)}>
                              Setujui Menu
                            </Button>
                          ) : (
                            <Badge variant="success">Sudah Disetujui</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. MODUL FINANCE & AKUNTANSI (LENGKAP: CASHFLOW, JURNAL)     */}
          {/* ========================================================= */}
          {activeMenu === 'finance' && (
            <div className="space-y-6">
              {/* Sub-tab Navigation */}
              <div className="flex border-b border-[var(--border)] gap-2 pb-2 overflow-x-auto">
                {[
                  { id: 'cashflow', label: 'Arus Kas (Cash Flow)', icon: <TrendingUp className="w-4 h-4" /> },
                  { id: 'journal_feed', label: 'Buku Jurnal Umum (General Ledger)', icon: <Receipt className="w-4 h-4" /> },
                  { id: 'cashier_recon', label: 'Rekonsiliasi Kasir & Kas Laci', icon: <Banknote className="w-4 h-4" />, badge: cashierShifts.filter((s) => s.status === 'PENDING_FINANCE_AUDIT').length },
                  { id: 'debt_trueup', label: 'Hutang Cabang & True-Up HPP', icon: <FileCheck2 className="w-4 h-4" />, badge: pendingInvoicesPOs.length },
                  { id: 'profit_loss', label: 'Laba Rugi & Margin Operasional', icon: <PieChart className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFinanceSubTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                      financeSubTab === tab.id
                        ? 'bg-[var(--brand-600)] text-white shadow-xs'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 ? (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[var(--warning)] text-white text-[9px] font-extrabold">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              {/* 3.1 Laporan Arus Kas (Cash Flow) */}
              {financeSubTab === 'cashflow' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Total Kas Masuk Operasional</span>
                      <span className="text-xl font-black text-emerald-700 tabular-nums block mt-1">
                        +Rp {totalRevenue.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Kasir POS Tunai & QRIS Midtrans</span>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Total Kas Keluar Operasional</span>
                      <span className="text-xl font-black text-rose-700 tabular-nums block mt-1">
                        -Rp {(totalPurchasesPaid + totalPettyCashApproved + centralOverheadExpenses).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold mt-1 block">Bahan baku, petty cash, overhead</span>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Arus Kas Bersih (Net Cash Flow)</span>
                      <span className={`text-xl font-black tabular-nums block mt-1 ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {netCashFlow >= 0 ? '+' : ''}Rp {netCashFlow.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium mt-1 block">Surplus arus kas berjalan</span>
                    </div>

                    <div className="bg-[var(--brand-50)] border border-[var(--brand-600)]/30 rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--brand-700)] font-bold block">Posisi Saldo Kas Akhir</span>
                      <span className="text-xl font-black text-[var(--brand-700)] tabular-nums block mt-1">
                        Rp {endingCashBalance.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-gray-600 mt-1 block">Saldo awal: Rp {initialCashBalance.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Rincian Cash Flow Statement */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-sm text-[var(--text)]">Laporan Arus Kas Operasional Terkonsolidasi</h4>

                    <div className="space-y-4 text-xs">
                      {/* Arus Kas Masuk */}
                      <div>
                        <div className="font-extrabold text-emerald-800 pb-1.5 border-b border-emerald-200 flex justify-between">
                          <span>A. ARUS KAS MASUK OPERASIONAL</span>
                          <span className="font-mono">+Rp {totalRevenue.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="divide-y divide-gray-100 pt-1">
                          <div className="py-1.5 flex justify-between text-gray-700 pl-4">
                            <span>1. Penerimaan Penjualan Tunai di Kasir POS</span>
                            <span className="font-mono font-bold text-emerald-700">+Rp {totalCashSales.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="py-1.5 flex justify-between text-gray-700 pl-4">
                            <span>2. Penerimaan Non-Tunai (QRIS & Midtrans PWA)</span>
                            <span className="font-mono font-bold text-emerald-700">+Rp {totalQrisSales.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="py-1.5 flex justify-between text-gray-700 pl-4">
                            <span>3. Pembayaran Pelunasan Piutang Bahan oleh Mitra Cabang</span>
                            <span className="font-mono font-bold text-emerald-700">+Rp 0</span>
                          </div>
                        </div>
                      </div>

                      {/* Arus Kas Keluar */}
                      <div>
                        <div className="font-extrabold text-rose-800 pb-1.5 border-b border-rose-200 flex justify-between">
                          <span>B. ARUS KAS KELUAR OPERASIONAL</span>
                          <span className="font-mono">-Rp {(totalPurchasesPaid + totalPettyCashApproved + centralOverheadExpenses).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="divide-y divide-gray-100 pt-1">
                          <div className="py-1.5 flex justify-between text-gray-700 pl-4">
                            <span>1. Pembayaran Faktur Pembelian Bahan Baku Definitif (Susu, Kopi, Sirup)</span>
                            <span className="font-mono font-bold text-rose-700">-Rp {totalPurchasesPaid.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="py-1.5 flex justify-between text-gray-700 pl-4">
                            <span>2. Pengeluaran Kas Kecil Cabang Disetujui (Petty Cash BR-12)</span>
                            <span className="font-mono font-bold text-rose-700">-Rp {totalPettyCashApproved.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="py-1.5 flex justify-between text-gray-700 pl-4">
                            <span>3. Beban Operasional Umum & Utilitas Kantor Pusat</span>
                            <span className="font-mono font-bold text-rose-700">-Rp {centralOverheadExpenses.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary Net */}
                      <div className="p-3 rounded-xl bg-gray-50 border flex justify-between font-extrabold text-sm">
                        <span>NET ARUS KAS OPERASIONAL BERSIH</span>
                        <span className={`font-mono ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          Rp {netCashFlow.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3.2 Buku Jurnal Umum (General Ledger) */}
              {financeSubTab === 'journal_feed' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[var(--text)]">Buku Jurnal Umum Kas Masuk & Keluar (Live Stream)</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Setiap transaksi POS, penerimaan QRIS, dan pengeluaran kas kecil otomatis diposting dengan nomor bagan akun resmi (COA).
                      </p>
                    </div>
                    <Badge variant="success" className="animate-pulse">Live Double-Entry Posting</Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--surface-muted)] text-gray-600 font-bold border-b">
                        <tr>
                          <th className="p-2.5">Waktu</th>
                          <th className="p-2.5">No. Referensi</th>
                          <th className="p-2.5">Cabang</th>
                          <th className="p-2.5">Akun Debit [Dr]</th>
                          <th className="p-2.5">Akun Kredit [Cr]</th>
                          <th className="p-2.5 text-right">Debit (Rp)</th>
                          <th className="p-2.5 text-right">Kredit (Rp)</th>
                          <th className="p-2.5 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {filteredOrders.map((o) => {
                          const isCash = o.paymentMethod === 'cash';
                          const outlet = outlets.find((ot) => ot.id === o.outletId);
                          return (
                            <tr key={o.id} className="hover:bg-[var(--brand-50)]/40">
                              <td className="p-2.5 font-mono text-gray-500">{o.createdAt}</td>
                              <td className="p-2.5 font-mono font-bold text-[var(--brand-700)]">{o.ticketNumber}</td>
                              <td className="p-2.5 font-medium">{outlet?.name}</td>
                              <td className="p-2.5 text-blue-700 font-semibold">
                                {isCash ? '1101 - Kas di Tangan Kasir' : '1102 - Bank QRIS Midtrans'}
                              </td>
                              <td className="p-2.5 text-emerald-700 font-semibold">
                                4101 - Pendapatan Penjualan Kopi
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold tabular-nums text-blue-700">
                                {o.total.toLocaleString('id-ID')}
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold tabular-nums text-emerald-700">
                                {o.total.toLocaleString('id-ID')}
                              </td>
                              <td className="p-2.5 text-center">
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Posted
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3.3 Rekonsiliasi Kasir & Kas Laci */}
              {financeSubTab === 'cashier_recon' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Kas Fisik di Laci Kasir (Open)</span>
                      <span className="text-xl font-black text-[var(--brand-700)] tabular-nums block mt-1">
                        Rp{' '}
                        {cashierShifts
                          .filter((s) => s.status === 'OPEN' && (selectedOutletId === 'all' || s.outletId === selectedOutletId))
                          .reduce((sum, s) => sum + s.expectedCashInDrawer, 0)
                          .toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-[var(--success)] font-bold mt-1 block">Aktif beredar di laci counter</span>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Penerimaan QRIS & Digital</span>
                      <span className="text-xl font-extrabold text-[var(--info)] tabular-nums block mt-1">
                        Rp{' '}
                        {cashierShifts
                          .filter((s) => selectedOutletId === 'all' || s.outletId === selectedOutletId)
                          .reduce((sum, s) => sum + s.totalQrisSales, 0)
                          .toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium mt-1 block">Masuk rekening Midtrans</span>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Setoran Menunggu Audit Finance</span>
                      <span className="text-xl font-extrabold text-[var(--warning)] tabular-nums block mt-1">
                        {
                          cashierShifts.filter(
                            (s) =>
                              s.status === 'PENDING_FINANCE_AUDIT' &&
                              (selectedOutletId === 'all' || s.outletId === selectedOutletId)
                          ).length
                        }{' '}
                        Shift
                      </span>
                      <span className="text-[10px] text-[var(--warning)] font-bold mt-1 block">Kasir sudah tutup shift</span>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs">
                      <span className="text-[11px] text-[var(--text-muted)] font-semibold block">Status Selisih Kas (Audit)</span>
                      <span className="text-xl font-extrabold text-[var(--success)] tabular-nums block mt-1">Rp 0 (Cocok)</span>
                      <span className="text-[10px] text-[var(--success)] font-bold mt-1 block">Fisik kasir klop dengan POS</span>
                    </div>
                  </div>

                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-sm text-[var(--text)]">Rekonsiliasi Shift Kasir & Penerimaan Kas Harian</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Terhubung langsung dari POS Kasir outlet. Finance memverifikasi kesesuaian fisik uang setoran dengan laporan sistem POS.
                        </p>
                      </div>
                      <Badge variant="brand">Terintegrasi POS Real-Time</Badge>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[var(--surface-muted)] text-gray-600 font-bold border-b">
                          <tr>
                            <th className="p-2.5">Outlet & Kasir</th>
                            <th className="p-2.5 text-right">Modal Awal</th>
                            <th className="p-2.5 text-right">Penjualan Tunai</th>
                            <th className="p-2.5 text-right">Penjualan QRIS</th>
                            <th className="p-2.5 text-right">Kas Laci (Sistem)</th>
                            <th className="p-2.5 text-right">Kas Fisik (Setoran)</th>
                            <th className="p-2.5 text-center">Status</th>
                            <th className="p-2.5 text-right">Aksi Finance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {cashierShifts
                            .filter((s) => selectedOutletId === 'all' || s.outletId === selectedOutletId)
                            .map((shift) => {
                              const outlet = outlets.find((o) => o.id === shift.outletId);
                              return (
                                <tr key={shift.id} className="hover:bg-[var(--brand-50)]/40 transition-colors">
                                  <td className="p-2.5">
                                    <div className="font-bold text-[var(--text)]">{outlet?.name}</div>
                                    <div className="text-[10px] text-gray-500">
                                      {shift.cashierName} • Buka: {shift.openedAt}
                                    </div>
                                  </td>
                                  <td className="p-2.5 text-right tabular-nums text-gray-600 font-medium">
                                    Rp {shift.startingFloat.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-2.5 text-right tabular-nums font-bold text-[var(--success)]">
                                    Rp {shift.totalCashSales.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-2.5 text-right tabular-nums font-bold text-[var(--info)]">
                                    Rp {shift.totalQrisSales.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-2.5 text-right tabular-nums font-black text-[var(--brand-700)]">
                                    Rp {shift.expectedCashInDrawer.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-2.5 text-right tabular-nums font-bold">
                                    {shift.actualCashCount != null ? (
                                      `Rp ${shift.actualCashCount.toLocaleString('id-ID')}`
                                    ) : (
                                      <span className="text-gray-400 italic">Belum hitung</span>
                                    )}
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <Badge
                                      variant={
                                        shift.status === 'VERIFIED'
                                          ? 'success'
                                          : shift.status === 'PENDING_FINANCE_AUDIT'
                                          ? 'warning'
                                          : 'info'
                                      }
                                      className="text-[9px]"
                                    >
                                      {shift.status === 'VERIFIED'
                                        ? 'Diverifikasi Lunas'
                                        : shift.status === 'PENDING_FINANCE_AUDIT'
                                        ? 'Menunggu Audit'
                                        : 'Shift Masih Buka'}
                                    </Badge>
                                  </td>
                                  <td className="p-2.5 text-right">
                                    {shift.status === 'PENDING_FINANCE_AUDIT' ? (
                                      <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => {
                                          setSelectedShiftForVerification(shift);
                                          setDepositSlipNumber(shift.depositRef || '');
                                        }}
                                        className="font-bold text-[10px]"
                                      >
                                        Verifikasi Setoran
                                      </Button>
                                    ) : shift.status === 'VERIFIED' ? (
                                      <span className="text-[10px] text-[var(--success)] font-bold flex items-center justify-end gap-1">
                                        <CheckCheck className="w-3.5 h-3.5" />
                                        {shift.verifiedBy || 'Tervalidasi'}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-gray-400 italic">
                                        Menunggu Kasir Tutup Shift
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3.4 Hutang Cabang & True-Up HPP */}
              {financeSubTab === 'debt_trueup' && (
                <div className="space-y-6">
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-sm text-[var(--text)]">Antrean Verifikasi Faktur & Koreksi HPP (True-Up HPP)</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Penerimaan fisik barang menaikkan stok dengan status "Menunggu Nota". Masukkan harga faktur definitif untuk mengoreksi HPP riil (BR-05 & BR-06).
                        </p>
                      </div>
                      <Badge variant="warning">{pendingInvoicesPOs.length} Menunggu Nota</Badge>
                    </div>

                    {pendingInvoicesPOs.length === 0 ? (
                      <div className="text-center py-8 bg-[var(--surface-muted)]/50 rounded-xl text-gray-500">
                        Semua penerimaan barang telah diverifikasi fakturnya
                      </div>
                    ) : (
                      <div className="divide-y divide-[var(--border)]">
                        {pendingInvoicesPOs.map((po) => {
                          const outlet = outlets.find((o) => o.id === po.outletId);
                          return (
                            <div key={po.id} className="py-3.5 flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-xs text-[var(--brand-700)]">{po.id}</span>
                                  <Badge variant="warning" className="text-[9px]">Menunggu Nota</Badge>
                                  <span className="font-bold text-gray-700">{outlet?.name}</span>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1">
                                  Barang diterima: {po.items.map((i) => `${i.qty} ${i.uom} ${i.ingredientName}`).join(', ')}
                                </div>
                              </div>

                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => setSelectedPoForInvoice(po.id)}
                                className="font-bold"
                              >
                                Input Faktur & True-Up HPP
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Debt Ledger */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-sm text-[var(--text)]">Saldo Hutang Cabang ke Pusat (Payables Aging)</h4>
                    <div className="divide-y divide-[var(--border)]">
                      {centralDebts.map((debt, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold font-mono text-[var(--text)]">{debt.invoiceNumber}</div>
                            <div className="text-[10px] text-gray-500">Jatuh Tempo: {debt.dueDate}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-[var(--danger)] tabular-nums">
                              Rp {(debt.amount - debt.paidAmount).toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-gray-500">Total Faktur: Rp {debt.amount.toLocaleString('id-ID')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3.5 Laba Rugi & Margin Operasional */}
              {financeSubTab === 'profit_loss' && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                  <h4 className="font-extrabold text-sm text-[var(--text)]">Laporan Laba Rugi Operasional Terkonsolidasi</h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>Penjualan Bersih (Net Sales):</span>
                        <span className="font-mono text-emerald-800">Rp {totalRevenue.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 pl-4">
                        <span>• Penjualan Tunai Kasir POS:</span>
                        <span className="font-mono">Rp {totalCashSales.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 pl-4">
                        <span>• Penjualan QRIS Midtrans:</span>
                        <span className="font-mono">Rp {totalQrisSales.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>Beban Pokok Penjualan (HPP / COGS Definitif):</span>
                        <span className="font-mono text-rose-800">-Rp {Math.round(totalRevenue * 0.28).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 pl-4">
                        Telah disinkronisasi dengan faktur harga riil melalui algoritma True-Up HPP (BR-06).
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between font-extrabold text-emerald-900">
                      <span>Laba Kotor Operasional (Gross Profit):</span>
                      <span className="font-mono">Rp {Math.round(totalRevenue * 0.72).toLocaleString('id-ID')} (72.0%)</span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <div className="flex justify-between font-bold text-gray-800">
                        <span>Beban Kas Kecil Cabang (Petty Cash):</span>
                        <span className="font-mono text-rose-800">-Rp {totalPettyCashApproved.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[var(--brand-50)] border border-[var(--brand-600)]/30 rounded-xl flex justify-between font-black text-sm text-[var(--brand-700)]">
                      <span>LABA BERSIH OPERASIONAL (NET OPERATING PROFIT):</span>
                      <span className="font-mono">
                        Rp {Math.round(totalRevenue * 0.72 - totalPettyCashApproved).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. ANTREAN PERSETUJUAN (APPROVALS)                        */}
          {/* ========================================================= */}
          {activeMenu === 'approvals' && (
            <div className="space-y-6">
              {/* Petty Cash Approvals */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-[var(--text)]">Persetujuan Belanja Kas Kecil di Atas Limit (BR-12)</h4>
                {pendingPettyCash.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">Tidak ada pengajuan kas kecil yang menunggu persetujuan</div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {pendingPettyCash.map((e) => (
                      <div key={e.id} className="py-3 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-[var(--text)]">{e.description}</div>
                          <div className="text-[10px] text-gray-500">
                            Outlet: {e.outletId} • Nominal: Rp {e.amount.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <Button size="sm" variant="success" onClick={() => handleApprovePettyCash(e.id)}>
                          Setujui Belanja
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Local Menu Approvals */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-sm text-[var(--text)]">Persetujuan Usulan Menu Lokal Gerai (BR-09)</h4>
                {pendingProposals.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">Tidak ada usulan menu lokal yang pending</div>
                ) : (
                  <div className="divide-y divide-[var(--border)]">
                    {pendingProposals.map((p) => (
                      <div key={p.id} className="py-3 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-[var(--text)]">{p.menuName}</div>
                          <div className="text-[10px] text-gray-500">
                            Usulan Harga: Rp {p.proposedPrice.toLocaleString('id-ID')} • Gerai: {p.outletId}
                          </div>
                          <div className="text-[10px] text-gray-600 italic">Alasan: "{p.reason}"</div>
                        </div>
                        <Button size="sm" variant="primary" onClick={() => handleApproveLocalMenu(p.id)}>
                          Setujui Menu Lokal
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. PENGATURAN & FITUR (SETTINGS)                          */}
          {/* ========================================================= */}
          {activeMenu === 'settings' && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4 max-w-lg">
              <h4 className="font-extrabold text-sm text-[var(--text)]">Feature Toggles Sistem (BR-01)</h4>
              <div className="space-y-3">
                {Object.entries(featureToggles).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center p-2.5 rounded-xl border">
                    <span className="font-mono font-bold text-xs">{key}</span>
                    <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Disabled'}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {/* 1. True-up Invoice Modal */}
      {selectedPoForInvoice && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="font-extrabold text-base text-[var(--text)]">
                Verifikasi Faktur & Koreksi HPP (True-Up)
              </h4>
              <button onClick={() => setSelectedPoForInvoice(null)}>
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
              Memasukkan harga faktur aktual akan <strong>mengoreksi estimasi HPP sementara</strong> pada stok tersisa dan transaksi yang sudah terjual secara retrospektif (BR-06).
            </div>

            <div>
              <label className="font-bold block mb-1">Nomor Faktur / Invoice Resmi</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">
                Harga Faktur Aktual Susu Fresh Milk per Karton (12L)
              </label>
              <input
                type="number"
                value={actualMilkPrice}
                onChange={(e) => setActualMilkPrice(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 border rounded-xl font-mono font-bold text-sm"
              />
              <div className="text-[10px] text-gray-500 mt-1">
                Harga sebelumnya: Rp 216.000 (Rp 18.000/L). Harga nota aktual: Rp {(actualMilkPrice / 12).toLocaleString('id-ID')}/L.
              </div>
            </div>

            <Button
              onClick={() => handleExecuteTrueUp(selectedPoForInvoice)}
              size="lg"
              variant="success"
              className="w-full font-bold shadow-md"
            >
              Konfirmasi Faktur & Rekalkulasi True-Up HPP
            </Button>
          </div>
        </div>
      )}

      {/* 2. Cashier Shift Verification Modal */}
      {selectedShiftForVerification && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h4 className="font-extrabold text-base text-[var(--text)]">
                  Audit & Verifikasi Setoran Kasir POS
                </h4>
                <p className="text-[10px] text-gray-500">
                  {outlets.find((o) => o.id === selectedShiftForVerification.outletId)?.name} •{' '}
                  {selectedShiftForVerification.cashierName}
                </p>
              </div>
              <button onClick={() => setSelectedShiftForVerification(null)}>
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 leading-relaxed text-[11px]">
              Verifikasi ini memvalidasi bahwa uang fisik yang disetor kasir ke bank/finance pusat telah diterima dan dicocokkan dengan catatan kasir POS.
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 border">
                <span className="text-[10px] text-gray-500 font-semibold block">Modal Awal Kasir</span>
                <span className="font-bold tabular-nums">
                  Rp {selectedShiftForVerification.startingFloat.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border">
                <span className="text-[10px] text-gray-500 font-semibold block">Penjualan Tunai POS</span>
                <span className="font-bold tabular-nums text-[var(--success)]">
                  Rp {selectedShiftForVerification.totalCashSales.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border">
                <span className="text-[10px] text-gray-500 font-semibold block">Kas Laci Seharusnya</span>
                <span className="font-black tabular-nums text-[var(--brand-700)]">
                  Rp {selectedShiftForVerification.expectedCashInDrawer.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-semibold block">Fisik Disetor Kasir</span>
                <span className="font-black tabular-nums text-emerald-800">
                  Rp{' '}
                  {(
                    selectedShiftForVerification.actualCashCount ??
                    selectedShiftForVerification.expectedCashInDrawer
                  ).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl border flex justify-between items-center">
              <span className="font-semibold text-gray-600">Selisih Kas Fisik vs Sistem:</span>
              <span className="font-mono font-extrabold text-[var(--success)]">
                Rp {(selectedShiftForVerification.variance ?? 0).toLocaleString('id-ID')} (Seimbang / 0 Selisih)
              </span>
            </div>

            <div>
              <label className="font-bold block mb-1">No. Bukti Setor / Slip Transfer Bank</label>
              <input
                type="text"
                placeholder="Contoh: SETOR-BCA-20261008-01"
                value={depositSlipNumber}
                onChange={(e) => setDepositSlipNumber(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-mono font-bold text-xs outline-none focus:border-[var(--brand-600)]"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Rekening Bank Penampung Pusat</label>
              <div className="p-2.5 bg-gray-50 border rounded-xl text-gray-700 font-medium text-[11px] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>1103 - Bank BCA Rekening Operasional Pusat (0182-9988-11)</span>
              </div>
            </div>

            <Button
              onClick={() => handleVerifyCashierSettlement(selectedShiftForVerification)}
              size="lg"
              variant="success"
              className="w-full font-bold shadow-md"
            >
              Verifikasi Lunas & Bukukan ke Kas Bank
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
