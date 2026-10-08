import React, { useState } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent } from '../../domain/events';
import type { MenuItem, OrderLineItem, Order } from '../../domain/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Coffee,
  ShoppingBag,
  Bell,
  Search,
  Check,
  CreditCard,
  Banknote,
  QrCode,
  X,
  Printer,
  ChevronRight,
  User,
} from 'lucide-react';

export const PosApp: React.FC = () => {
  const {
    outlets,
    menuItems,
    recipes,
    stockLots,
    orders,
    cashierShifts,
    dispatch,
  } = useEcosystemStore();

  const [selectedOutletId, setSelectedOutletId] = useState<string>('outlet-sudirman');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart state for walk-in order
  const [cart, setCart] = useState<OrderLineItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');

  // Modifier modal for selected item
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<'reguler' | 'large'>('reguler');
  const [selectedSugar, setSelectedSugar] = useState<'normal' | 'less' | 'none'>('normal');
  const [isOatmilk, setIsOatmilk] = useState<boolean>(false);
  const [extraShot, setExtraShot] = useState<boolean>(false);

  // Online orders drawer
  const [isOnlineDrawerOpen, setIsOnlineDrawerOpen] = useState<boolean>(false);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [cashGiven, setCashGiven] = useState<number>(50000);

  // Receipt Modal
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Shift & Cash Drawer modal
  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [depositSlipInput, setDepositSlipInput] = useState<string>('');

  const selectedOutlet = outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  const activeShift = cashierShifts.find((s) => s.outletId === selectedOutletId && s.status === 'OPEN') ||
    cashierShifts.find((s) => s.outletId === selectedOutletId) || {
      id: `shift_${selectedOutletId}_temp`,
      outletId: selectedOutletId,
      cashierName: 'Siti Rahma (Kasir 1)',
      shiftNumber: 1,
      openedAt: '08:00 WIB',
      startingFloat: 200000,
      totalCashSales: 0,
      totalQrisSales: 0,
      totalTransactions: 0,
      expectedCashInDrawer: 200000,
      status: 'OPEN' as const,
    };

  const [physicalCashCount, setPhysicalCashCount] = useState<number>(activeShift.expectedCashInDrawer);

  // Menus for this outlet
  const availableMenus = menuItems.filter(
    (m) =>
      (m.scope === 'global' || m.scope === selectedOutletId) &&
      m.status === 'active' &&
      (searchQuery === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (activeCategory === 'All' || m.category === activeCategory)
  );

  // Online orders queue waiting for cashier acceptance
  const onlineOrdersQueue = orders.filter(
    (o) => o.outletId === selectedOutletId && o.channel === 'app' && o.status === 'PLACED'
  );

  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddToCart = () => {
    if (!selectedMenu) return;

    let unitPrice = selectedMenu.basePrice;
    const modifiers: OrderLineItem['selectedModifiers'] = [];

    if (selectedSize === 'large') {
      unitPrice += 4000;
      modifiers.push({
        groupId: 'mod-size',
        groupName: 'Ukuran Cup',
        optionId: 'opt-large',
        optionName: 'Large',
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
        optionName: 'Extra Shot',
        priceDelta: 5000,
      });
    }
    modifiers.push({
      groupId: 'mod-sugar',
      groupName: 'Gula',
      optionId: `opt-sugar-${selectedSugar}`,
      optionName: selectedSugar,
      priceDelta: 0,
    });

    const newItem: OrderLineItem = {
      menuItemId: selectedMenu.id,
      menuName: selectedMenu.name,
      qty: 1,
      unitPrice,
      selectedModifiers: modifiers,
      subtotal: unitPrice,
    };

    setCart((prev) => [...prev, newItem]);
    setSelectedMenu(null);
    setSelectedSize('reguler');
    setSelectedSugar('normal');
    setIsOatmilk(false);
    setExtraShot(false);
  };

  // Complete walk-in checkout
  const handleCompleteWalkInCheckout = () => {
    const orderId = `ord_pos_${Date.now()}`;
    const ticketNumber = `#W-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      ticketNumber,
      outletId: selectedOutletId,
      channel: 'pos',
      customerName,
      items: cart,
      subtotal: cartSubtotal,
      appMarkupAmount: 0,
      discountAmount: 0,
      taxAmount: 0,
      total: cartSubtotal,
      status: 'ACCEPTED', // directly accepted by cashier
      paymentMethod,
      paymentStatus: 'PAID',
      createdAt: new Date().toLocaleTimeString('id-ID'),
      updatedAt: new Date().toLocaleTimeString('id-ID'),
    };

    // 1. Payment Captured
    dispatch(
      createEvent(
        'PaymentCaptured',
        'Kasir Outlet',
        { orderId, amount: cartSubtotal, method: paymentMethod },
        selectedOutletId
      )
    );

    // 2. Order Placed
    dispatch(
      createEvent('OrderPlaced', 'Kasir POS', { order: newOrder }, selectedOutletId)
    );

    // 3. Dispatch directly to KDS
    dispatch(
      createEvent('OrderAccepted', 'Kasir POS', { orderId, estimatedMinutes: 8 }, selectedOutletId)
    );

    setLastCompletedOrder(newOrder);
    setIsPaymentModalOpen(false);
    setCart([]);
    setCustomerName('Walk-in Customer');
  };

  // Accept incoming online order from App
  const handleAcceptOnlineOrder = (order: Order) => {
    dispatch(
      createEvent(
        'OrderAccepted',
        'Kasir POS',
        { orderId: order.id, estimatedMinutes: 10 },
        selectedOutletId
      )
    );
  };

  return (
    <div className="flex h-full bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      {/* LEFT AREA: Catalog & Menu Grid (65%) */}
      <div className="flex-1 flex flex-col border-r border-[var(--border)] overflow-hidden">
        {/* Top bar */}
        <div className="h-14 bg-[var(--surface)] border-b border-[var(--border)] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] text-white flex items-center justify-center font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text)]">POS KASIR</div>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="text-xs text-[var(--brand-700)] font-bold bg-transparent outline-none cursor-pointer"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Orders Notification Bell */}
            <button
              onClick={() => setIsOnlineDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] cursor-pointer transition-colors"
            >
              <Bell className="w-4 h-4" />
              {onlineOrdersQueue.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--info)] text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                  {onlineOrdersQueue.length}
                </span>
              )}
            </button>

            {/* Laci & Rekonsiliasi Shift Button */}
            <button
              onClick={() => {
                setPhysicalCashCount(activeShift.expectedCashInDrawer);
                setIsShiftModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--brand-50)] text-xs font-bold border border-[var(--border)] text-[var(--brand-700)] cursor-pointer transition-colors shadow-xs"
            >
              <Banknote className="w-4 h-4 text-[var(--success)]" />
              <span>Shift & Kas Laci</span>
            </button>

            <div className="text-right text-xs">
              <div className="font-bold text-[var(--text)]">{activeShift.cashierName}</div>
              <div className="text-[10px] text-[var(--success)] font-semibold tabular-nums">
                Kas Laci: Rp {activeShift.expectedCashInDrawer.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>

        {/* Categories & Search */}
        <div className="p-3 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {['All', 'Signature Coffee', 'Espresso Based', 'Non-Coffee', 'Pastry'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeCategory === cat
                    ? 'bg-[var(--brand-600)] text-white shadow-xs'
                    : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--brand-50)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-48 shrink-0">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[var(--surface-muted)] border border-transparent rounded-lg outline-none focus:border-[var(--brand-600)] focus:bg-white"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 p-3 overflow-y-auto grid grid-cols-3 xl:grid-cols-4 gap-2.5">
          {availableMenus.map((menu) => (
            <div
              key={menu.id}
              onClick={() => setSelectedMenu(menu)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 flex flex-col justify-between hover:border-[var(--brand-600)] hover:shadow-xs cursor-pointer active:scale-[0.98] transition-all"
            >
              <div>
                {menu.scope !== 'global' && (
                  <Badge variant="brand" className="text-[9px] px-1.5 py-0 mb-1">
                    Lokal
                  </Badge>
                )}
                <h5 className="font-bold text-xs text-[var(--text)] line-clamp-2">{menu.name}</h5>
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--border)] font-extrabold text-xs text-[var(--brand-700)] tabular-nums">
                Rp {menu.basePrice.toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT AREA: Cart & Transaction Panel (35%) */}
      <div className="w-72 lg:w-80 bg-[var(--surface)] flex flex-col shrink-0">
        {/* Cart Header */}
        <div className="h-14 border-b border-[var(--border)] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--brand-600)]" />
            <span className="font-bold text-xs text-[var(--text)]">Pesanan Kasir</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-[10px] text-[var(--danger)] font-bold hover:underline cursor-pointer"
            >
              Kosongkan
            </button>
          )}
        </div>

        {/* Customer input */}
        <div className="p-3 border-b border-[var(--border)] bg-[var(--surface-muted)]/50">
          <div className="flex items-center gap-1.5 text-xs">
            <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama pelanggan..."
              className="flex-1 bg-transparent border-b border-[var(--border-strong)] text-xs font-semibold outline-none py-0.5 focus:border-[var(--brand-600)]"
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--text-muted)] py-12">
              <ShoppingBag className="w-10 h-10 stroke-1 mb-2 text-[var(--border-strong)]" />
              <div className="text-xs font-semibold">Keranjang kosong</div>
              <div className="text-[10px]">Pilih menu di sisi kiri untuk menambah pesanan</div>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="bg-[var(--surface-muted)]/60 rounded-xl p-2.5 border border-[var(--border)] text-xs flex justify-between items-start"
              >
                <div>
                  <div className="font-bold text-[var(--text)]">{item.menuName}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {item.selectedModifiers.map((m) => m.optionName).join(', ')}
                  </div>
                </div>
                <div className="font-extrabold text-[var(--brand-700)] tabular-nums">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Total & Checkout Button */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-muted)] shrink-0 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-[var(--text-secondary)]">Total Tagihan</span>
            <span className="font-extrabold text-base text-[var(--brand-700)] tabular-nums">
              Rp {cartSubtotal.toLocaleString('id-ID')}
            </span>
          </div>

          <Button
            disabled={cart.length === 0}
            onClick={() => setIsPaymentModalOpen(true)}
            size="lg"
            className="w-full text-sm font-bold shadow-md"
          >
            Bayar (Rp {cartSubtotal.toLocaleString('id-ID')})
          </Button>
        </div>
      </div>

      {/* Modifier modal for POS item */}
      {selectedMenu && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-96 p-4 shadow-xl border border-[var(--border)]">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <div>
                <h4 className="font-bold text-sm text-[var(--text)]">{selectedMenu.name}</h4>
                <div className="text-xs font-bold text-[var(--brand-700)] tabular-nums">
                  Rp {selectedMenu.basePrice.toLocaleString('id-ID')}
                </div>
              </div>
              <button onClick={() => setSelectedMenu(null)} className="text-[var(--text-muted)]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Ukuran Cup</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedSize('reguler')}
                    className={`p-2 rounded-lg border font-semibold ${
                      selectedSize === 'reguler'
                        ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    Regular (16oz)
                  </button>
                  <button
                    onClick={() => setSelectedSize('large')}
                    className={`p-2 rounded-lg border font-semibold ${
                      selectedSize === 'large'
                        ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)]'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    Large (+Rp 4k)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Tingkat Gula</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['normal', 'less', 'none'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSugar(s)}
                      className={`p-1.5 rounded-lg border font-medium capitalize ${
                        selectedSugar === s
                          ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)] font-bold'
                          : 'border-[var(--border)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                <label className="flex items-center justify-between p-1.5 rounded-lg border border-[var(--border)] cursor-pointer">
                  <span>Ganti Susu Oatmilk (+Rp 6.000)</span>
                  <input
                    type="checkbox"
                    checked={isOatmilk}
                    onChange={(e) => setIsOatmilk(e.target.checked)}
                    className="accent-[var(--brand-600)]"
                  />
                </label>
                <label className="flex items-center justify-between p-1.5 rounded-lg border border-[var(--border)] cursor-pointer">
                  <span>Extra Espresso Shot (+Rp 5.000)</span>
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="accent-[var(--brand-600)]"
                  />
                </label>
              </div>
            </div>

            <Button onClick={handleAddToCart} size="md" className="w-full">
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      )}

      {/* Payment Selection Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] rounded-2xl w-96 p-5 shadow-2xl border border-[var(--border)]">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <h4 className="font-bold text-sm text-[var(--text)]">Metode Pembayaran</h4>
              <button onClick={() => setIsPaymentModalOpen(false)}>
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="my-3 text-center">
              <div className="text-xs text-[var(--text-muted)]">Total Tagihan</div>
              <div className="text-2xl font-extrabold text-[var(--brand-700)] tabular-nums my-0.5">
                Rp {cartSubtotal.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Methods */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)] font-bold'
                    : 'border-[var(--border)]'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Uang Tunai</span>
              </button>
              <button
                onClick={() => setPaymentMethod('qris')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-700)] font-bold'
                    : 'border-[var(--border)]'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">QRIS Dinamis</span>
              </button>
            </div>

            {paymentMethod === 'cash' && (
              <div className="space-y-2 mb-4 text-xs">
                <div className="font-semibold text-[var(--text-secondary)]">Uang Diterima:</div>
                <div className="flex gap-2">
                  {[cartSubtotal, 50000, 100000].map((nom) => (
                    <button
                      key={nom}
                      onClick={() => setCashGiven(nom)}
                      className={`flex-1 py-1.5 rounded-lg border text-center tabular-nums cursor-pointer ${
                        cashGiven === nom
                          ? 'bg-[var(--brand-600)] text-white border-[var(--brand-600)] font-bold'
                          : 'border-[var(--border)] bg-[var(--surface-muted)]'
                      }`}
                    >
                      {nom.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-[var(--surface-muted)] mt-2">
                  <span className="font-semibold text-[var(--text-secondary)]">Kembalian:</span>
                  <span className="font-extrabold text-sm text-[var(--success)] tabular-nums">
                    Rp {Math.max(0, cashGiven - cartSubtotal).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            <Button onClick={handleCompleteWalkInCheckout} size="lg" className="w-full font-bold">
              Konfirmasi & Kirim ke KDS
            </Button>
          </div>
        </div>
      )}

      {/* Online Orders Drawer (Pesanan Masuk dari App) */}
      {isOnlineDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-[var(--surface)] w-96 h-full p-4 flex flex-col shadow-2xl animate-slide-left">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-2">
                <Badge variant="info">Online</Badge>
                <h4 className="font-bold text-sm text-[var(--text)]">Antrean Pesanan App</h4>
              </div>
              <button onClick={() => setIsOnlineDrawerOpen(false)} className="cursor-pointer">
                <X className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {onlineOrdersQueue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[var(--text-muted)] py-16">
                  <Coffee className="w-10 h-10 stroke-1 mb-2 text-[var(--border-strong)]" />
                  <div className="text-xs font-semibold">Tidak ada pesanan online baru</div>
                  <div className="text-[10px]">Pesanan dari App Pelanggan akan muncul di sini</div>
                </div>
              ) : (
                onlineOrdersQueue.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[var(--surface-muted)]/70 border-2 border-[var(--info)]/40 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-extrabold text-sm text-[var(--info)]">
                          {order.ticketNumber}
                        </span>
                        <div className="text-xs font-bold text-[var(--text)]">{order.customerName}</div>
                      </div>
                      <Badge variant="info" className="text-[10px]">
                        Lunas QRIS
                      </Badge>
                    </div>

                    <div className="text-xs text-[var(--text-secondary)] space-y-1 py-1 border-y border-[var(--border)]">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {it.qty}x {it.menuName}
                          </span>
                          <span className="tabular-nums">Rp {it.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs font-extrabold">
                      <span>Total:</span>
                      <span className="text-[var(--brand-700)] tabular-nums">
                        Rp {order.total.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleAcceptOnlineOrder(order)}
                      className="w-full text-xs font-bold mt-1"
                    >
                      Terima & Teruskan ke KDS
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Receipt Modal */}
      {lastCompletedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl text-xs space-y-3">
            <div className="text-center pb-2 border-b border-dashed border-gray-300">
              <div className="font-extrabold text-base text-[var(--brand-700)]">KOPI JODI</div>
              <div className="text-[10px] text-gray-500">{selectedOutlet.name}</div>
              <div className="text-[10px] text-gray-400 mt-1">Struk Pembayaran Sah</div>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>No. Tiket:</span>
              <span className="font-mono font-bold text-gray-900">{lastCompletedOrder.ticketNumber}</span>
            </div>

            <div className="space-y-1 py-2 border-y border-dashed border-gray-200">
              {lastCompletedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.qty}x {it.menuName}</span>
                  <span className="tabular-nums">Rp {it.subtotal.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-1">
              <span>TOTAL</span>
              <span className="tabular-nums">Rp {lastCompletedOrder.total.toLocaleString('id-ID')}</span>
            </div>

            <div className="text-center text-[10px] text-gray-400 pt-1">
              Tiket pesanan otomatis dikirim ke layar Barista KDS
            </div>

            <Button
              onClick={() => setLastCompletedOrder(null)}
              size="md"
              className="w-full font-bold"
            >
              Tutup Struk
            </Button>
          </div>
        </div>
      )}

      {/* Cash Drawer & Shift Reconcilation Modal */}
      {isShiftModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="font-extrabold text-base text-[var(--text)]">Rekonsiliasi Laci Kas & Shift</h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {selectedOutlet.name} • {activeShift.cashierName}
                </p>
              </div>
              <Badge variant={activeShift.status === 'OPEN' ? 'info' : activeShift.status === 'VERIFIED' ? 'success' : 'warning'}>
                {activeShift.status === 'OPEN' ? 'Shift Aktif' : activeShift.status === 'VERIFIED' ? 'Terverifikasi Finance' : 'Menunggu Audit Finance'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[var(--surface-muted)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold block">Modal Awal Laci (Float)</span>
                <span className="text-sm font-extrabold tabular-nums mt-0.5 block">Rp {activeShift.startingFloat.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-[var(--surface-muted)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold block">Penjualan Tunai Kasir</span>
                <span className="text-sm font-extrabold text-[var(--success)] tabular-nums mt-0.5 block">Rp {activeShift.totalCashSales.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-[var(--surface-muted)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold block">Penjualan Non-Tunai / QRIS</span>
                <span className="text-sm font-extrabold text-[var(--info)] tabular-nums mt-0.5 block">Rp {activeShift.totalQrisSales.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-[var(--brand-50)] p-3 rounded-xl border border-[var(--brand-600)]/30">
                <span className="text-[10px] text-[var(--brand-700)] font-bold block">Uang Kas di Laci (Sistem)</span>
                <span className="text-sm font-black text-[var(--brand-700)] tabular-nums mt-0.5 block">Rp {activeShift.expectedCashInDrawer.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Input Fisik Kasir */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-[var(--text)] block mb-1">
                  Hitungan Uang Fisik Riil di Laci (Cash Count):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">Rp</span>
                  <input
                    type="number"
                    value={physicalCashCount}
                    onChange={(e) => setPhysicalCashCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl text-sm font-extrabold tabular-nums outline-none focus:border-[var(--brand-600)]"
                  />
                </div>
              </div>

              {/* Selisih */}
              <div className="flex justify-between items-center text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-semibold text-gray-600">Selisih Kas (Variance):</span>
                <span className={`font-mono font-extrabold ${physicalCashCount - activeShift.expectedCashInDrawer === 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {physicalCashCount - activeShift.expectedCashInDrawer === 0 ? 'Rp 0 (Seimbang / Cocok)' : `Rp ${(physicalCashCount - activeShift.expectedCashInDrawer).toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* No Bukti Setor */}
              <div>
                <label className="text-xs font-bold text-[var(--text)] block mb-1">
                  No. Bukti Setor / Catatan Transfer Bank:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SETOR-BCA-20261008-05"
                  value={depositSlipInput}
                  onChange={(e) => setDepositSlipInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl text-xs outline-none focus:border-[var(--brand-600)]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsShiftModalOpen(false)}
                className="flex-1"
              >
                Batal / Kembali
              </Button>

              {activeShift.status === 'OPEN' ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const closedShift = {
                      ...activeShift,
                      closedAt: new Date().toLocaleTimeString('id-ID'),
                      actualCashCount: physicalCashCount,
                      variance: physicalCashCount - activeShift.expectedCashInDrawer,
                      status: 'PENDING_FINANCE_AUDIT' as const,
                      depositRef: depositSlipInput || `SETOR-TUNAI-${Date.now().toString().slice(-4)}`,
                    };
                    dispatch(
                      createEvent(
                        'CashierShiftClosed',
                        'Kasir Outlet',
                        { shift: closedShift },
                        selectedOutletId
                      )
                    );
                    setIsShiftModalOpen(false);
                  }}
                  className="flex-1 font-bold shadow-md"
                >
                  Tutup Shift & Kirim ke ERP
                </Button>
              ) : (
                <div className="flex-1 text-center py-2 text-xs font-bold text-[var(--text-muted)] bg-[var(--surface-muted)] rounded-xl">
                  {activeShift.status === 'VERIFIED' ? 'Sudah Diaudit Finance' : 'Menunggu Approval Finance'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
