// Domain Types for Kopi Ecosystem

export type BrandThemeId = 'jodi' | 'teras';

export interface Brand {
  id: BrandThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  lightColor: string;
  logoUrl?: string;
}

export interface Outlet {
  id: string;
  name: string;
  type: 'own' | 'partner';
  ownershipPct: number | null; // null represents "Belum Diatur"
  pettyCashLimit: number; // e.g. 150000
  address: string;
  hours: string;
  isOpen: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'coffee' | 'dairy' | 'syrup' | 'powder' | 'packaging' | 'other';
  purchaseUom: string; // e.g. 'Karton'
  usageUom: string; // e.g. 'ml', 'gram', 'pcs'
  conversionRatio: number; // e.g. 1 Karton = 12000 ml
  minStock: number; // safety stock threshold
  lastPrice: number; // per purchase UOM
  allowExternalPurchase: boolean;
  isPrepared?: boolean; // bahan olahan semi-finished
}

export interface StockLot {
  id: string;
  outletId: string;
  ingredientId: string;
  qty: number; // in usageUom
  unitCost: number; // cost per usageUom
  status: 'confirmed' | 'awaiting_invoice';
  poId?: string;
  receivedAt: string;
}

export interface OutletStockItem {
  ingredientId: string;
  ingredientName: string;
  category: string;
  usageUom: string;
  currentQty: number;
  awaitingInvoiceQty: number;
  minStock: number;
  lastUnitPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Signature Coffee' | 'Espresso Based' | 'Non-Coffee' | 'Tea' | 'Pastry';
  basePrice: number; // Walk-in price in Rupiah
  description: string;
  imageUrl?: string;
  scope: 'global' | string; // 'global' or outletId for local menu
  status: 'active' | 'inactive';
}

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number;
  ingredientDeltas?: { ingredientId: string; qtyDelta: number }[];
}

export interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  options: ModifierOption[];
}

export interface RecipeItem {
  ingredientId: string;
  qty: number; // in usageUom
}

export interface Recipe {
  menuItemId: string;
  items: RecipeItem[];
}

export interface OrderLineItem {
  menuItemId: string;
  menuName: string;
  qty: number;
  unitPrice: number;
  selectedModifiers: {
    groupId: string;
    groupName: string;
    optionId: string;
    optionName: string;
    priceDelta: number;
  }[];
  notes?: string;
  subtotal: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'READY'
  | 'PICKED_UP'
  | 'CANCELLED';

export interface Order {
  id: string;
  ticketNumber: string; // e.g. '#A-101'
  outletId: string;
  channel: 'pos' | 'app';
  customerName: string;
  items: OrderLineItem[];
  subtotal: number;
  appMarkupAmount: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'qris';
  paymentStatus: 'PAID' | 'PENDING';
  voucherCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  ingredientId: string;
  ingredientName: string;
  qty: number; // in purchaseUom
  uom: string;
}

export type POStatus =
  | 'REQUESTED'
  | 'SENT'
  | 'RECEIVED'
  | 'AWAITING_INVOICE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface PurchaseOrder {
  id: string;
  outletId: string;
  supplierType: 'central' | 'external';
  vendorName?: string;
  items: PurchaseOrderItem[]; // without price column (BR-04)
  status: POStatus;
  notes?: string;
  createdAt: string;
}

export interface GoodsReceipt {
  id: string;
  poId: string;
  outletId: string;
  items: { ingredientId: string; qtyReceived: number }[];
  photoUrl?: string;
  receivedAt: string;
}

export interface InvoiceItem {
  ingredientId: string;
  qtyReceived: number;
  actualPricePerUom: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  outletId: string;
  items: InvoiceItem[];
  totalAmount: number;
  verifiedAt: string;
}

export interface PettyCashExpense {
  id: string;
  outletId: string;
  amount: number;
  category: string;
  description: string;
  receiptPhotoUrl?: string;
  status: 'APPROVED' | 'AWAITING_APPROVAL' | 'REJECTED';
  approvedBy?: string;
  createdAt: string;
}

export interface CentralDebtItem {
  invoiceId: string;
  invoiceNumber: string;
  outletId: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
}

export interface CentralPaymentRecord {
  id: string;
  outletId: string;
  amount: number;
  bankAccount: string;
  proofUrl?: string;
  allocatedInvoiceIds: string[];
  paidAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 20 (percent) or 10000 (Rupiah)
  minOrderAmount: number;
  maxDiscount?: number;
  scope: 'global' | string; // 'global' or outletId
  quota: number;
  usedCount: number;
  costBearer: 'central' | 'outlet';
  validUntil: string;
  isActive: boolean;
}

export interface LocalMenuProposal {
  id: string;
  outletId: string;
  menuName: string;
  proposedPrice: number;
  category: MenuItem['category'];
  recipe: RecipeItem[];
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface CashierShift {
  id: string;
  outletId: string;
  cashierName: string;
  shiftNumber: number;
  openedAt: string;
  closedAt?: string;
  startingFloat: number; // e.g. Rp 200.000 modal awal laci
  totalCashSales: number;
  totalQrisSales: number;
  totalTransactions: number;
  expectedCashInDrawer: number;
  actualCashCount?: number;
  variance?: number; // actualCashCount - expectedCashInDrawer
  status: 'OPEN' | 'PENDING_FINANCE_AUDIT' | 'VERIFIED';
  verifiedBy?: string;
  verifiedAt?: string;
  depositRef?: string;
}

