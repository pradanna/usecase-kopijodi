import React, { useState } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent } from '../../domain/events';
import type { MenuItem, OrderLineItem, Order } from '../../domain/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Coffee,
  ShoppingBag,
  MapPin,
  Clock,
  Sparkles,
  QrCode,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  X,
  Ticket,
} from 'lucide-react';

export const CustomerApp: React.FC = () => {
  const {
    outlets,
    menuItems,
    recipes,
    stockLots,
    vouchers,
    orders,
    channelMarkupPct,
    dispatch,
  } = useEcosystemStore();

  const [selectedOutletId, setSelectedOutletId] = useState<string>('outlet-sudirman');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  // Modifier state inside item modal
  const [selectedSize, setSelectedSize] = useState<'reguler' | 'large'>('reguler');
  const [selectedSugar, setSelectedSugar] = useState<'normal' | 'less' | 'none'>('normal');
  const [selectedIce, setSelectedIce] = useState<'normal' | 'less'>('normal');
  const [isOatmilk, setIsOatmilk] = useState<boolean>(false);
  const [extraShot, setExtraShot] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<OrderLineItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [voucherError, setVoucherError] = useState<string>('');

  // Payment & Live Tracking
  const [isQrisModalOpen, setIsQrisModalOpen] = useState<boolean>(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const selectedOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  // Filter menus available for this outlet
  const availableMenus = menuItems.filter(
    (m) => (m.scope === 'global' || m.scope === selectedOutletId) && m.status === 'active'
  );

  const filteredMenus =
    activeCategory === 'All'
      ? availableMenus
      : availableMenus.filter((m) => m.category === activeCategory);

  // Check if ingredient is sold out
  const isMenuSoldOut = (menu: MenuItem): boolean => {
    const recipe = recipes.find((r) => r.menuItemId === menu.id);
    if (!recipe) return false;
    return recipe.items.some((item) => {
      const lot = stockLots.find(
        (l) => l.outletId === selectedOutletId && l.ingredientId === item.ingredientId
      );
      return !lot || lot.qty < item.qty;
    });
  };

  // Price calculations with channel markup (BR-10)
  const getAppPrice = (basePrice: number): number => {
    const markup = Math.round((basePrice * channelMarkupPct) / 100);
    return basePrice + markup;
  };

  const handleAddToCart = () => {
    if (!selectedMenu) return;

    let unitPrice = getAppPrice(selectedMenu.basePrice);
    const modifiers: OrderLineItem['selectedModifiers'] = [];

    if (selectedSize === 'large') {
      unitPrice += 4000;
      modifiers.push({
        groupId: 'mod-size',
        groupName: 'Ukuran Cup',
        optionId: 'opt-large',
        optionName: 'Large (22oz)',
        priceDelta: 4000,
      });
    }
    if (isOatmilk) {
      unitPrice += 6000;
      modifiers.push({
        groupId: 'mod-dairy',
        groupName: 'Susu',
        optionId: 'opt-oat',
        optionName: 'Oatmilk',
        priceDelta: 6000,
      });
    }
    if (extraShot) {
      unitPrice += 5000;
      modifiers.push({
        groupId: 'mod-extra',
        groupName: 'Tambahan',
        optionId: 'opt-extra-shot',
        optionName: 'Extra Espresso Shot',
        priceDelta: 5000,
      });
    }
    modifiers.push({
      groupId: 'mod-sugar',
      groupName: 'Gula',
      optionId: `opt-sugar-${selectedSugar}`,
      optionName: selectedSugar === 'less' ? 'Less Sugar' : selectedSugar === 'none' ? 'No Sugar' : 'Normal',
      priceDelta: 0,
    });
    modifiers.push({
      groupId: 'mod-ice',
      groupName: 'Es',
      optionId: `opt-ice-${selectedIce}`,
      optionName: selectedIce === 'less' ? 'Less Ice' : 'Normal Ice',
      priceDelta: 0,
    });

    const newItem: OrderLineItem = {
      menuItemId: selectedMenu.id,
      menuName: selectedMenu.name,
      qty: 1,
      unitPrice,
      selectedModifiers: modifiers,
      notes: notes.trim() || undefined,
      subtotal: unitPrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedMenu(null);
    // Reset modifiers
    setSelectedSize('reguler');
    setSelectedSugar('normal');
    setSelectedIce('normal');
    setIsOatmilk(false);
    setExtraShot(false);
    setNotes('');
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Voucher validation
  const appliedVoucher = vouchers.find((v) => v.code === appliedVoucherCode && v.isActive);
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.scope !== 'global' && appliedVoucher.scope !== selectedOutletId) {
      // Invalid scope
    } else if (cartSubtotal >= appliedVoucher.minOrderAmount) {
      discountAmount =
        appliedVoucher.discountType === 'percentage'
          ? Math.min(
              appliedVoucher.maxDiscount || Infinity,
              Math.round((cartSubtotal * appliedVoucher.discountValue) / 100)
            )
          : appliedVoucher.discountValue;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const applyVoucher = (code: string) => {
    setVoucherError('');
    const v = vouchers.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!v) {
      setVoucherError('Kode voucher tidak ditemukan');
      return;
    }
    if (v.scope !== 'global' && v.scope !== selectedOutletId) {
      setVoucherError(`Voucher hanya berlaku di cabang khusus!`);
      return;
    }
    if (cartSubtotal < v.minOrderAmount) {
      setVoucherError(`Minimum belanja Rp ${v.minOrderAmount.toLocaleString('id-ID')}`);
      return;
    }
    setAppliedVoucherCode(v.code);
  };

  // Handle QRIS Payment Simulation
  const handleSimulatePayment = () => {
    const orderId = `ord_app_${Date.now()}`;
    const ticketNumber = `#A-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      ticketNumber,
      outletId: selectedOutletId,
      channel: 'app',
      customerName: 'Pradana (App User)',
      items: cart,
      subtotal: cartSubtotal,
      appMarkupAmount: Math.round((cartSubtotal * channelMarkupPct) / 100),
      discountAmount,
      taxAmount: 0,
      total: finalTotal,
      status: 'PLACED',
      paymentMethod: 'qris',
      paymentStatus: 'PAID',
      voucherCode: appliedVoucher?.code,
      createdAt: new Date().toLocaleTimeString('id-ID'),
      updatedAt: new Date().toLocaleTimeString('id-ID'),
    };

    // 1. Emit PaymentCaptured
    dispatch(
      createEvent(
        'PaymentCaptured',
        'Customer (Midtrans QRIS)',
        { orderId, amount: finalTotal, method: 'qris' as const },
        selectedOutletId
      )
    );

    // 2. Emit OrderPlaced
    dispatch(
      createEvent('OrderPlaced', 'Customer App', { order: newOrder }, selectedOutletId)
    );

    setIsQrisModalOpen(false);
    setIsCheckoutOpen(false);
    setCart([]);
    setActiveOrderId(orderId);
  };

  // Active tracked order
  const activeOrder = orders.find((o) => o.id === activeOrderId);

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--text)] select-none">
      {/* Top Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center text-white font-bold text-sm">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase">
                Pick-Up di
              </div>
              <div className="text-sm font-bold text-[var(--text)] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--brand-600)]" />
                <select
                  value={selectedOutletId}
                  onChange={(e) => setSelectedOutletId(e.target.value)}
                  className="bg-transparent font-bold cursor-pointer outline-none border-b border-transparent hover:border-[var(--brand-600)]"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] px-2 py-0.5">
            <Clock className="w-2.5 h-2.5 inline mr-1" />
            Buka (10-15m)
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Active Order Live Tracker Banner (If any) */}
        {activeOrder && activeOrder.status !== 'PICKED_UP' && (
          <div className="bg-[var(--brand-50)] border-2 border-[var(--brand-600)] rounded-2xl p-3 shadow-md animate-pulse-subtle">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--brand-700)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Status Pesanan {activeOrder.ticketNumber}
              </span>
              <Badge
                variant={
                  activeOrder.status === 'READY'
                    ? 'success'
                    : activeOrder.status === 'IN_PROGRESS'
                    ? 'warning'
                    : 'info'
                }
              >
                {activeOrder.status === 'READY'
                  ? 'Siap Diambil!'
                  : activeOrder.status === 'IN_PROGRESS'
                  ? 'Sedang Diracik'
                  : 'Diterima Kasir'}
              </Badge>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold mt-2">
              <div
                className={`py-1.5 rounded-lg ${
                  activeOrder.status === 'ACCEPTED' ||
                  activeOrder.status === 'IN_PROGRESS' ||
                  activeOrder.status === 'READY'
                    ? 'bg-[var(--brand-600)] text-white'
                    : 'bg-white/80 text-[var(--text-muted)]'
                }`}
              >
                1. Diterima
              </div>
              <div
                className={`py-1.5 rounded-lg ${
                  activeOrder.status === 'IN_PROGRESS' || activeOrder.status === 'READY'
                    ? 'bg-[var(--brand-600)] text-white'
                    : 'bg-white/80 text-[var(--text-muted)]'
                }`}
              >
                2. Diracik
              </div>
              <div
                className={`py-1.5 rounded-lg ${
                  activeOrder.status === 'READY'
                    ? 'bg-[var(--success)] text-white ring-2 ring-emerald-400'
                    : 'bg-white/80 text-[var(--text-muted)]'
                }`}
              >
                3. Siap Ambil
              </div>
            </div>

            {activeOrder.status === 'READY' && (
              <div className="mt-2 text-center text-xs font-bold text-[var(--success)] bg-white py-1.5 rounded-lg border border-[var(--success)]/20">
                Minuman Anda siap di meja barista! Sebutkan tiket {activeOrder.ticketNumber}
              </div>
            )}
          </div>
        )}

        {/* Promo Banner Carousel */}
        <div className="bg-gradient-to-r from-[var(--brand-700)] to-[var(--brand-600)] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1.5">
              Promo Spesial Hari Ini
            </span>
            <h4 className="text-base font-extrabold leading-tight">
              Hemat s/d Rp 10.000
            </h4>
            <p className="text-xs text-white/90 mt-0.5">
              Gunakan kode <span className="font-mono font-bold underline">HEMAT10</span> saat checkout!
            </p>
          </div>
          <Coffee className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Signature Coffee', 'Espresso Based', 'Non-Coffee', 'Pastry'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat
                  ? 'bg-[var(--brand-600)] text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredMenus.map((menu) => {
            const soldOut = isMenuSoldOut(menu);
            const appPrice = getAppPrice(menu.basePrice);

            return (
              <div
                key={menu.id}
                onClick={() => !soldOut && setSelectedMenu(menu)}
                className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 flex flex-col justify-between transition-all relative overflow-hidden ${
                  soldOut
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:border-[var(--brand-600)]/40 hover:shadow-sm cursor-pointer active:scale-[0.98]'
                }`}
              >
                {/* Local Menu badge if applicable */}
                {menu.scope !== 'global' && (
                  <Badge variant="brand" className="absolute top-2 left-2 text-[9px] py-0 px-1.5">
                    Menu Lokal Cabang
                  </Badge>
                )}

                {soldOut && (
                  <Badge variant="danger" className="absolute top-2 right-2 text-[9px] py-0 px-1.5">
                    Habis
                  </Badge>
                )}

                {/* Cup Icon Illustration */}
                <div className="w-full h-24 bg-[var(--surface-muted)] rounded-xl flex items-center justify-center my-2 text-[var(--brand-600)]/40">
                  <Coffee className="w-12 h-12" />
                </div>

                <div>
                  <h5 className="font-bold text-xs line-clamp-1 text-[var(--text)]">{menu.name}</h5>
                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {menu.description}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="font-extrabold text-xs text-[var(--brand-700)] tabular-nums">
                    Rp {appPrice.toLocaleString('id-ID')}
                  </div>
                  <button
                    disabled={soldOut}
                    className="w-6 h-6 rounded-full bg-[var(--brand-50)] text-[var(--brand-700)] flex items-center justify-center font-bold text-xs hover:bg-[var(--brand-600)] hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button at bottom */}
      {cart.length > 0 && (
        <div className="p-3 bg-[var(--surface)] border-t border-[var(--border)] shrink-0">
          <Button
            onClick={() => setIsCheckoutOpen(true)}
            size="md"
            className="w-full justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                {cart.length}
              </span>
              <span className="font-bold text-xs">Lihat Keranjang Pesanan</span>
            </div>
            <span className="font-extrabold text-sm tabular-nums">
              Rp {cartSubtotal.toLocaleString('id-ID')}
            </span>
          </Button>
        </div>
      )}

      {/* Item Customization Modal */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-t-3xl max-h-[85vh] flex flex-col p-4 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">{selectedMenu.name}</h4>
                <div className="text-xs font-bold text-[var(--brand-700)] tabular-nums">
                  Rp {getAppPrice(selectedMenu.basePrice).toLocaleString('id-ID')}
                </div>
              </div>
              <button
                onClick={() => setSelectedMenu(null)}
                className="w-7 h-7 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-muted)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-3.5 text-xs">
              {/* Size */}
              <div>
                <label className="font-bold text-[var(--text-secondary)] block mb-1.5">
                  Pilih Ukuran Cup
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedSize('reguler')}
                    className={`p-2 rounded-xl border text-center font-semibold cursor-pointer ${
                      selectedSize === 'reguler'
                        ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Regular (16oz)
                  </button>
                  <button
                    onClick={() => setSelectedSize('large')}
                    className={`p-2 rounded-xl border text-center font-semibold cursor-pointer ${
                      selectedSize === 'large'
                        ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)]'
                    }`}
                  >
                    Large (+Rp 4.000)
                  </button>
                </div>
              </div>

              {/* Sugar */}
              <div>
                <label className="font-bold text-[var(--text-secondary)] block mb-1.5">
                  Tingkat Kemanisan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'less', 'none'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSugar(s)}
                      className={`p-1.5 rounded-lg border text-center font-medium capitalize cursor-pointer ${
                        selectedSugar === s
                          ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)] font-bold'
                          : 'border-[var(--border)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {s === 'less' ? 'Less (50%)' : s === 'none' ? 'No Sugar' : 'Normal'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Modifiers */}
              <div className="space-y-2 pt-1 border-t border-[var(--border)]">
                <label className="font-bold text-[var(--text-secondary)] block">
                  Kustomisasi Susu & Tambahan
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl border border-[var(--border)] cursor-pointer">
                  <span className="font-medium">Ganti Susu Oatmilk (+Rp 6.000)</span>
                  <input
                    type="checkbox"
                    checked={isOatmilk}
                    onChange={(e) => setIsOatmilk(e.target.checked)}
                    className="accent-[var(--brand-600)] w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-xl border border-[var(--border)] cursor-pointer">
                  <span className="font-medium">Extra Espresso Shot (+Rp 5.000)</span>
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="accent-[var(--brand-600)] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Special Notes */}
              <div>
                <label className="font-bold text-[var(--text-secondary)] block mb-1">
                  Catatan untuk Barista
                </label>
                <input
                  type="text"
                  placeholder="Contoh: jangan terlalu manis, es dipisah"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[var(--border-strong)] rounded-xl outline-none focus:border-[var(--brand-600)]"
                />
              </div>
            </div>

            <Button onClick={handleAddToCart} size="md" className="w-full mt-2">
              Tambah ke Pesanan
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Screen Bottom Sheet */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-xs">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-t-3xl max-h-[90vh] flex flex-col p-4 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--brand-600)]" />
                <h4 className="font-bold text-sm text-[var(--text)]">Konfirmasi Pesanan</h4>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-7 h-7 rounded-full bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-muted)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Outlet info */}
            <div className="bg-[var(--surface-muted)] p-2.5 rounded-xl my-3 text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--brand-600)] shrink-0" />
              <div>
                <div className="font-bold text-[var(--text)]">{selectedOutlet.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">Ambil sendiri di bar (Pick-Up)</div>
              </div>
            </div>

            {/* Item list */}
            <div className="divide-y divide-[var(--border)] max-h-40 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[var(--text)]">{item.menuName}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {item.selectedModifiers.map((m) => m.optionName).join(', ')}
                    </div>
                  </div>
                  <div className="font-extrabold text-[var(--text)] tabular-nums">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>

            {/* Voucher input */}
            <div className="pt-3 border-t border-[var(--border)]">
              <div className="text-xs font-bold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-[var(--brand-600)]" />
                Gunakan Kode Voucher
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="HEMAT10 / SUDIRMANSERU"
                  value={appliedVoucherCode}
                  onChange={(e) => setAppliedVoucherCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 text-xs font-mono border border-[var(--border-strong)] rounded-lg outline-none focus:border-[var(--brand-600)]"
                />
                <Button size="sm" variant="outline" onClick={() => applyVoucher(appliedVoucherCode)}>
                  Pakai
                </Button>
              </div>
              {voucherError && <div className="text-[10px] text-[var(--danger)] mt-1">{voucherError}</div>}
              {appliedVoucher && !voucherError && (
                <div className="text-[10px] text-[var(--success)] font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Voucher {appliedVoucher.code} berhasil dipasang!
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="bg-[var(--surface-muted)] rounded-xl p-3 my-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal ({cart.length} item)</span>
                <span className="tabular-nums">Rp {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Markup Channel App ({channelMarkupPct}%)</span>
                <span className="text-[10px] text-[var(--brand-700)] font-semibold">Termasuk</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[var(--success)] font-bold">
                  <span>Potongan Diskon</span>
                  <span className="tabular-nums">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-[var(--text)] pt-1.5 border-t border-[var(--border)]">
                <span>Total Bayar</span>
                <span className="text-[var(--brand-700)] tabular-nums">
                  Rp {finalTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <Button
              onClick={() => {
                setIsCheckoutOpen(false);
                setIsQrisModalOpen(true);
              }}
              size="lg"
              className="w-full"
            >
              Bayar via QRIS (Midtrans)
            </Button>
          </div>
        </div>
      )}

      {/* QRIS Payment Modal Simulation */}
      {isQrisModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500">QRIS Standar Nasional</span>
              <button
                onClick={() => setIsQrisModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fake QR image / icon */}
            <div className="w-44 h-44 mx-auto my-3 bg-gray-50 border-2 border-gray-900 rounded-2xl flex flex-col items-center justify-center p-3 relative">
              <QrCode className="w-36 h-36 text-gray-900" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-2 py-0.5 rounded-md shadow-xs border text-[10px] font-extrabold text-[var(--brand-700)]">
                  Kopi Jodi
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 font-medium">Total Pembayaran Pas</div>
            <div className="text-xl font-extrabold text-gray-900 tabular-nums my-1">
              Rp {finalTotal.toLocaleString('id-ID')}
            </div>

            <p className="text-[10px] text-gray-500 mb-4">
              Pindai QR ini melalui BCA Mobile, GoPay, OVO, atau ShopeePay.
            </p>

            <Button
              onClick={handleSimulatePayment}
              size="md"
              variant="success"
              className="w-full font-bold shadow-md"
            >
              Simulasikan Sukses Bayar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
