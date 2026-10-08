// Realistic Initial Seed Data for Kopi Jodi Ecosystem (PRD Section 10)

import type {
  Outlet,
  Ingredient,
  MenuItem,
  ModifierGroup,
  Recipe,
  Voucher,
  StockLot,
  PurchaseOrder,
  Invoice,
  CentralDebtItem,
  Order,
  CashierShift,
} from '../domain/types';

export const INITIAL_OUTLETS: Outlet[] = [
  {
    id: 'outlet-sudirman',
    name: 'Kopi Jodi - Sudirman',
    type: 'partner',
    ownershipPct: null, // "Belum Diatur"
    pettyCashLimit: 150000,
    address: 'Gedung Menara Sudirman Lt. Dasar, Jl. Jend. Sudirman Kav 24, Jakarta Pusat',
    hours: '07:00 - 22:00 WIB',
    isOpen: true,
  },
  {
    id: 'outlet-senopati',
    name: 'Kopi Jodi - Senopati',
    type: 'own',
    ownershipPct: null,
    pettyCashLimit: 200000,
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    hours: '08:00 - 23:00 WIB',
    isOpen: true,
  },
  {
    id: 'outlet-kemang',
    name: 'Kopi Jodi - Kemang',
    type: 'partner',
    ownershipPct: null,
    pettyCashLimit: 150000,
    address: 'Jl. Kemang Raya No. 12, Mampang Prapatan, Jakarta Selatan',
    hours: '08:00 - 22:00 WIB',
    isOpen: true,
  },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Coffee
  {
    id: 'ing-kopi-blend',
    name: 'Biji Kopi House Blend (70:30)',
    category: 'coffee',
    purchaseUom: 'Kilogram',
    usageUom: 'gram',
    conversionRatio: 1000,
    minStock: 2000, // 2 kg
    lastPrice: 120000, // Rp 120.000 / kg -> Rp 120/gram
    allowExternalPurchase: false,
  },
  {
    id: 'ing-kopi-gayo',
    name: 'Biji Kopi Single Origin Gayo',
    category: 'coffee',
    purchaseUom: 'Kilogram',
    usageUom: 'gram',
    conversionRatio: 1000,
    minStock: 1000,
    lastPrice: 160000,
    allowExternalPurchase: false,
  },
  // Dairy
  {
    id: 'ing-susu-fresh',
    name: 'Susu Fresh Milk Pasteurisasi',
    category: 'dairy',
    purchaseUom: 'Karton (12L)',
    usageUom: 'ml',
    conversionRatio: 12000,
    minStock: 5000, // 5 Liter alert threshold
    lastPrice: 216000, // Rp 18.000 / Liter -> Rp 18/ml
    allowExternalPurchase: true, // allowed for emergency
  },
  {
    id: 'ing-susu-oat',
    name: 'Susu Oatmilk Barista Edition',
    category: 'dairy',
    purchaseUom: 'Karton (10L)',
    usageUom: 'ml',
    conversionRatio: 10000,
    minStock: 3000,
    lastPrice: 380000, // Rp 38.000 / Liter
    allowExternalPurchase: true,
  },
  // Syrups & Sweeteners
  {
    id: 'ing-gula-aren',
    name: 'Gula Aren Cair Alami',
    category: 'syrup',
    purchaseUom: 'Jerigen (5L)',
    usageUom: 'ml',
    conversionRatio: 5000,
    minStock: 1500,
    lastPrice: 110000, // Rp 22.000 / L
    allowExternalPurchase: false,
  },
  {
    id: 'ing-sirup-karamel',
    name: 'Sirup Karamel Gourmet',
    category: 'syrup',
    purchaseUom: 'Botol (750ml)',
    usageUom: 'ml',
    conversionRatio: 750,
    minStock: 250,
    lastPrice: 95000,
    allowExternalPurchase: false,
  },
  {
    id: 'ing-sirup-vanila',
    name: 'Sirup Vanilla French',
    category: 'syrup',
    purchaseUom: 'Botol (750ml)',
    usageUom: 'ml',
    conversionRatio: 750,
    minStock: 250,
    lastPrice: 95000,
    allowExternalPurchase: false,
  },
  {
    id: 'ing-sirup-pandan',
    name: 'Sirup Pandan Wangi Asli',
    category: 'syrup',
    purchaseUom: 'Botol (750ml)',
    usageUom: 'ml',
    conversionRatio: 750,
    minStock: 200,
    lastPrice: 85000,
    allowExternalPurchase: false,
  },
  // Powders
  {
    id: 'ing-bubuk-matcha',
    name: 'Bubuk Matcha Uji Premium',
    category: 'powder',
    purchaseUom: 'Pack (1kg)',
    usageUom: 'gram',
    conversionRatio: 1000,
    minStock: 300,
    lastPrice: 280000,
    allowExternalPurchase: false,
  },
  {
    id: 'ing-bubuk-cokelat',
    name: 'Bubuk Cokelat Java Dark',
    category: 'powder',
    purchaseUom: 'Pack (1kg)',
    usageUom: 'gram',
    conversionRatio: 1000,
    minStock: 500,
    lastPrice: 140000,
    allowExternalPurchase: false,
  },
  // Packaging
  {
    id: 'ing-cup-16oz',
    name: 'Cup Plastik Dingin 16oz',
    category: 'packaging',
    purchaseUom: 'Dus (1000pcs)',
    usageUom: 'pcs',
    conversionRatio: 1000,
    minStock: 200,
    lastPrice: 350000, // Rp 350/pcs
    allowExternalPurchase: true,
  },
  {
    id: 'ing-cup-22oz',
    name: 'Cup Plastik Dingin 22oz',
    category: 'packaging',
    purchaseUom: 'Dus (1000pcs)',
    usageUom: 'pcs',
    conversionRatio: 1000,
    minStock: 150,
    lastPrice: 420000,
    allowExternalPurchase: true,
  },
  {
    id: 'ing-tutup-sedotan',
    name: 'Set Tutup Lid & Sedotan Ramah Lingkungan',
    category: 'packaging',
    purchaseUom: 'Dus (1000pcs)',
    usageUom: 'pcs',
    conversionRatio: 1000,
    minStock: 200,
    lastPrice: 200000,
    allowExternalPurchase: true,
  },
  // Prepared (Bahan Olahan)
  {
    id: 'ing-coldbrew-base',
    name: 'Cold Brew Concentrate Base',
    category: 'coffee',
    purchaseUom: 'Batch (5L)',
    usageUom: 'ml',
    conversionRatio: 5000,
    minStock: 1000,
    lastPrice: 90000,
    allowExternalPurchase: false,
    isPrepared: true,
  },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Signature Coffee
  {
    id: 'menu-kopi-susu',
    name: 'Es Kopi Susu Aren',
    category: 'Signature Coffee',
    basePrice: 20000,
    description: 'Espresso blend mantap dengan susu segar dan legitnya gula aren alami khas Nusantara.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-kopi-creamy',
    name: 'Kopi Susu Creamy Moka',
    category: 'Signature Coffee',
    basePrice: 22000,
    description: 'Sensasi gurih kental kopi susu dengan sentuhan dark chocolate Java.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-kopi-pandan',
    name: 'Es Kopi Pandan Wangi',
    category: 'Signature Coffee',
    basePrice: 24000,
    description: 'Menu lokal khas dengan wangi daun pandan asli berpadu lembutnya susu.',
    scope: 'outlet-sudirman', // Local signature menu for Sudirman outlet
    status: 'active',
  },
  // Espresso Based
  {
    id: 'menu-americano',
    name: 'Americano Dingin',
    category: 'Espresso Based',
    basePrice: 18000,
    description: 'Double shot espresso murni dengan air es segar, aroma bersih dan bodi tegas.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-caffe-latte',
    name: 'Caffe Latte Dingin',
    category: 'Espresso Based',
    basePrice: 24000,
    description: 'Espresso kaya rasa diseimbangkan dengan kelembutan steamed fresh milk.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-cappuccino',
    name: 'Cappuccino Klasik',
    category: 'Espresso Based',
    basePrice: 24000,
    description: 'Keseimbangan espresso, susu, dan foam tebal lembut dengan taburan bubuk kakao.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-caramel-macchiato',
    name: 'Caramel Macchiato',
    category: 'Espresso Based',
    basePrice: 28000,
    description: 'Layer vanilla milk, espresso shot, dan drizzle karamel gourmet.',
    scope: 'global',
    status: 'active',
  },
  // Non-Coffee
  {
    id: 'menu-matcha-latte',
    name: 'Matcha Latte Uji',
    category: 'Non-Coffee',
    basePrice: 26000,
    description: 'Teh hijau asli Kyoto Uji dengan susu segar pilihan, manis pas dan menenangkan.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-cokelat-java',
    name: 'Cokelat Klasik Java',
    category: 'Non-Coffee',
    basePrice: 24000,
    description: 'Kakao khas Jawa Barat dengan cita rasa cokelat pekat yang kaya antioksidan.',
    scope: 'global',
    status: 'active',
  },
  // Pastry
  {
    id: 'menu-croissant',
    name: 'Butter Croissant',
    category: 'Pastry',
    basePrice: 18000,
    description: 'Pastry renyah berlapis dengan aroma mentega Prancis yang harum dan gurih.',
    scope: 'global',
    status: 'active',
  },
  {
    id: 'menu-pain-chocolat',
    name: 'Pain Au Chocolat',
    category: 'Pastry',
    basePrice: 22000,
    description: 'Pastry berlapis mentega dengan isian lelehan cokelat batangan lezat.',
    scope: 'global',
    status: 'active',
  },
];

export const INITIAL_MODIFIERS: ModifierGroup[] = [
  {
    id: 'mod-size',
    name: 'Ukuran Cup',
    type: 'single',
    options: [
      { id: 'opt-reguler', name: 'Reguler (16oz)', priceDelta: 0 },
      { id: 'opt-large', name: 'Large (22oz)', priceDelta: 4000 },
    ],
  },
  {
    id: 'mod-sugar',
    name: 'Level Gula',
    type: 'single',
    options: [
      { id: 'opt-sugar-normal', name: 'Normal (100%)', priceDelta: 0 },
      { id: 'opt-sugar-less', name: 'Less Sugar (50%)', priceDelta: 0 },
      { id: 'opt-sugar-none', name: 'No Sugar (0%)', priceDelta: 0 },
    ],
  },
  {
    id: 'mod-ice',
    name: 'Level Es',
    type: 'single',
    options: [
      { id: 'opt-ice-normal', name: 'Normal Ice', priceDelta: 0 },
      { id: 'opt-ice-less', name: 'Less Ice', priceDelta: 0 },
    ],
  },
  {
    id: 'mod-dairy',
    name: 'Pilihan Susu',
    type: 'single',
    options: [
      { id: 'opt-dairy-fresh', name: 'Fresh Milk', priceDelta: 0 },
      { id: 'opt-dairy-oat', name: 'Oatmilk (+Rp 6.000)', priceDelta: 6000 },
    ],
  },
  {
    id: 'mod-extra',
    name: 'Tambahan',
    type: 'multiple',
    options: [
      { id: 'opt-extra-espresso', name: 'Extra Espresso Shot', priceDelta: 5000 },
    ],
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    menuItemId: 'menu-kopi-susu',
    items: [
      { ingredientId: 'ing-kopi-blend', qty: 18 }, // 18 gr
      { ingredientId: 'ing-susu-fresh', qty: 120 }, // 120 ml
      { ingredientId: 'ing-gula-aren', qty: 25 }, // 25 ml
      { ingredientId: 'ing-cup-16oz', qty: 1 }, // 1 pcs
      { ingredientId: 'ing-tutup-sedotan', qty: 1 }, // 1 set
    ],
  },
  {
    menuItemId: 'menu-kopi-creamy',
    items: [
      { ingredientId: 'ing-kopi-blend', qty: 18 },
      { ingredientId: 'ing-susu-fresh', qty: 130 },
      { ingredientId: 'ing-gula-aren', qty: 15 },
      { ingredientId: 'ing-bubuk-cokelat', qty: 10 },
      { ingredientId: 'ing-cup-16oz', qty: 1 },
      { ingredientId: 'ing-tutup-sedotan', qty: 1 },
    ],
  },
  {
    menuItemId: 'menu-kopi-pandan',
    items: [
      { ingredientId: 'ing-kopi-blend', qty: 18 },
      { ingredientId: 'ing-susu-fresh', qty: 110 },
      { ingredientId: 'ing-sirup-pandan', qty: 20 },
      { ingredientId: 'ing-cup-16oz', qty: 1 },
      { ingredientId: 'ing-tutup-sedotan', qty: 1 },
    ],
  },
  {
    menuItemId: 'menu-americano',
    items: [
      { ingredientId: 'ing-kopi-blend', qty: 18 },
      { ingredientId: 'ing-cup-16oz', qty: 1 },
      { ingredientId: 'ing-tutup-sedotan', qty: 1 },
    ],
  },
  {
    menuItemId: 'menu-caffe-latte',
    items: [
      { ingredientId: 'ing-kopi-blend', qty: 18 },
      { ingredientId: 'ing-susu-fresh', qty: 160 },
      { ingredientId: 'ing-cup-16oz', qty: 1 },
      { ingredientId: 'ing-tutup-sedotan', qty: 1 },
    ],
  },
  {
    menuItemId: 'menu-matcha-latte',
    items: [
      { ingredientId: 'ing-bubuk-matcha', qty: 15 },
      { ingredientId: 'ing-susu-fresh', qty: 180 },
      { ingredientId: 'ing-cup-16oz', qty: 1 },
      { ingredientId: 'ing-tutup-sedotan', qty: 1 },
    ],
  },
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'vouch-semua',
    code: 'DISKONSEMUA',
    title: 'Diskon 15% Semua Outlet',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 30000,
    maxDiscount: 15000,
    scope: 'global',
    quota: 500,
    usedCount: 84,
    costBearer: 'central',
    validUntil: '2026-12-31',
    isActive: true,
  },
  {
    id: 'vouch-sudirman',
    code: 'SUDIRMANSERU',
    title: 'Potongan Rp 10.000 Spesial Sudirman',
    discountType: 'fixed',
    discountValue: 10000,
    minOrderAmount: 40000,
    scope: 'outlet-sudirman',
    quota: 200,
    usedCount: 38,
    costBearer: 'outlet',
    validUntil: '2026-11-30',
    isActive: true,
  },
  {
    id: 'vouch-hemat',
    code: 'HEMAT10',
    title: 'Voucher Pelanggan Baru Rp 10rb',
    discountType: 'fixed',
    discountValue: 10000,
    minOrderAmount: 25000,
    scope: 'global',
    quota: 1000,
    usedCount: 215,
    costBearer: 'central',
    validUntil: '2026-12-31',
    isActive: true,
  },
];

// Initial Stock setup for Sudirman outlet: Milk is near threshold (4.8L vs 5.0L min) to trigger alert easily
export const INITIAL_STOCK_LOTS: StockLot[] = [
  // Sudirman
  {
    id: 'lot-sudirman-kopi',
    outletId: 'outlet-sudirman',
    ingredientId: 'ing-kopi-blend',
    qty: 4500, // 4.5 kg
    unitCost: 120, // Rp 120/gr
    status: 'confirmed',
    receivedAt: '2026-10-01',
  },
  {
    id: 'lot-sudirman-susu',
    outletId: 'outlet-sudirman',
    ingredientId: 'ing-susu-fresh',
    qty: 5120, // 5.12 Liter (just above 5L threshold, will trigger alert after 1-2 orders!)
    unitCost: 18, // Rp 18/ml
    status: 'confirmed',
    receivedAt: '2026-10-05',
  },
  {
    id: 'lot-sudirman-aren',
    outletId: 'outlet-sudirman',
    ingredientId: 'ing-gula-aren',
    qty: 3500,
    unitCost: 22,
    status: 'confirmed',
    receivedAt: '2026-10-04',
  },
  {
    id: 'lot-sudirman-cup',
    outletId: 'outlet-sudirman',
    ingredientId: 'ing-cup-16oz',
    qty: 650,
    unitCost: 350,
    status: 'confirmed',
    receivedAt: '2026-10-02',
  },
  {
    id: 'lot-sudirman-tutup',
    outletId: 'outlet-sudirman',
    ingredientId: 'ing-tutup-sedotan',
    qty: 700,
    unitCost: 200,
    status: 'confirmed',
    receivedAt: '2026-10-02',
  },
  {
    id: 'lot-sudirman-pandan',
    outletId: 'outlet-sudirman',
    ingredientId: 'ing-sirup-pandan',
    qty: 600,
    unitCost: 113,
    status: 'confirmed',
    receivedAt: '2026-10-03',
  },
  // Senopati
  {
    id: 'lot-senopati-kopi',
    outletId: 'outlet-senopati',
    ingredientId: 'ing-kopi-blend',
    qty: 8000,
    unitCost: 120,
    status: 'confirmed',
    receivedAt: '2026-10-02',
  },
  {
    id: 'lot-senopati-susu',
    outletId: 'outlet-senopati',
    ingredientId: 'ing-susu-fresh',
    qty: 18000,
    unitCost: 18,
    status: 'confirmed',
    receivedAt: '2026-10-04',
  },
  // Kemang
  {
    id: 'lot-kemang-kopi',
    outletId: 'outlet-kemang',
    ingredientId: 'ing-kopi-blend',
    qty: 6000,
    unitCost: 120,
    status: 'confirmed',
    receivedAt: '2026-10-03',
  },
  {
    id: 'lot-kemang-susu',
    outletId: 'outlet-kemang',
    ingredientId: 'ing-susu-fresh',
    qty: 12000,
    unitCost: 18,
    status: 'confirmed',
    receivedAt: '2026-10-04',
  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    outletId: 'outlet-sudirman',
    supplierType: 'central',
    items: [
      { ingredientId: 'ing-kopi-blend', ingredientName: 'Biji Kopi House Blend', qty: 5, uom: 'Kilogram' },
      { ingredientId: 'ing-cup-16oz', ingredientName: 'Cup Plastik Dingin 16oz', qty: 1, uom: 'Dus (1000pcs)' },
    ],
    status: 'COMPLETED',
    createdAt: '2026-10-01 09:30',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-PST-2026-089',
    poId: 'po-101',
    outletId: 'outlet-sudirman',
    items: [
      { ingredientId: 'ing-kopi-blend', qtyReceived: 5, actualPricePerUom: 120000 },
      { ingredientId: 'ing-cup-16oz', qtyReceived: 1, actualPricePerUom: 350000 },
    ],
    totalAmount: 950000,
    verifiedAt: '2026-10-02 14:00',
  },
];

export const INITIAL_CENTRAL_DEBTS: CentralDebtItem[] = [
  {
    invoiceId: 'inv-101',
    invoiceNumber: 'INV-PST-2026-089',
    outletId: 'outlet-sudirman',
    amount: 950000,
    paidAmount: 500000,
    dueDate: '2026-10-25',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-hist-1',
    ticketNumber: '#A-098',
    outletId: 'outlet-sudirman',
    channel: 'pos',
    customerName: 'Budi Santoso',
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
    status: 'PICKED_UP',
    paymentMethod: 'cash',
    paymentStatus: 'PAID',
    createdAt: '2026-10-08 08:30:00',
    updatedAt: '2026-10-08 08:35:00',
  },
  {
    id: 'ord-hist-2',
    ticketNumber: '#A-099',
    outletId: 'outlet-sudirman',
    channel: 'app',
    customerName: 'Siti Rahma',
    items: [
      {
        menuItemId: 'menu-matcha-latte',
        menuName: 'Matcha Latte Uji',
        qty: 1,
        unitPrice: 29900,
        selectedModifiers: [
          { groupId: 'mod-size', groupName: 'Ukuran Cup', optionId: 'opt-large', optionName: 'Large (22oz)', priceDelta: 4000 },
        ],
        subtotal: 33900,
      },
    ],
    subtotal: 33900,
    appMarkupAmount: 3900,
    discountAmount: 10000,
    taxAmount: 0,
    total: 23900,
    status: 'PICKED_UP',
    paymentMethod: 'qris',
    paymentStatus: 'PAID',
    voucherCode: 'SUDIRMANSERU',
    createdAt: '2026-10-08 09:15:00',
    updatedAt: '2026-10-08 09:22:00',
  },
];

export const INITIAL_CASHIER_SHIFTS: CashierShift[] = [
  {
    id: 'shift_sudirman_01',
    outletId: 'outlet-sudirman',
    cashierName: 'Rian Pratama (Kasir 1)',
    shiftNumber: 1,
    openedAt: '07:00 WIB',
    closedAt: '15:00 WIB',
    startingFloat: 200000,
    totalCashSales: 450000,
    totalQrisSales: 780000,
    totalTransactions: 38,
    expectedCashInDrawer: 650000, // startingFloat + totalCashSales
    actualCashCount: 650000,
    variance: 0,
    status: 'PENDING_FINANCE_AUDIT',
    depositRef: 'SETOR-BCA-20261008-01',
  },
  {
    id: 'shift_senopati_01',
    outletId: 'outlet-senopati',
    cashierName: 'Dinda Ayu (Kasir 1)',
    shiftNumber: 1,
    openedAt: '08:00 WIB',
    closedAt: '16:00 WIB',
    startingFloat: 200000,
    totalCashSales: 520000,
    totalQrisSales: 940000,
    totalTransactions: 44,
    expectedCashInDrawer: 720000,
    actualCashCount: 720000,
    variance: 0,
    status: 'VERIFIED',
    verifiedBy: 'Finance Pusat (Mega)',
    verifiedAt: '16:30 WIB',
    depositRef: 'SETOR-MANDIRI-20261008-04',
  },
  {
    id: 'shift_kemang_01',
    outletId: 'outlet-kemang',
    cashierName: 'Bima Sakti (Kasir 1)',
    shiftNumber: 1,
    openedAt: '08:00 WIB',
    startingFloat: 200000,
    totalCashSales: 180000,
    totalQrisSales: 350000,
    totalTransactions: 19,
    expectedCashInDrawer: 380000,
    status: 'OPEN',
  },
];

