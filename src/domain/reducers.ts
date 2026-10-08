// Pure Domain Reducer implementing Event Sourcing & Business Rules (BR-01 to BR-17)

import type { DomainEvent } from './events';
import type {
  Outlet,
  Ingredient,
  MenuItem,
  Recipe,
  StockLot,
  Order,
  PurchaseOrder,
  Invoice,
  PettyCashExpense,
  CentralDebtItem,
  Voucher,
  LocalMenuProposal,
  BrandThemeId,
  CashierShift,
} from './types';
import {
  INITIAL_OUTLETS,
  INITIAL_INGREDIENTS,
  INITIAL_MENU_ITEMS,
  INITIAL_RECIPES,
  INITIAL_STOCK_LOTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_INVOICES,
  INITIAL_CENTRAL_DEBTS,
  INITIAL_ORDERS,
  INITIAL_VOUCHERS,
  INITIAL_CASHIER_SHIFTS,
} from '../seed/initialData';

export interface EcosystemState {
  brandId: BrandThemeId;
  channelMarkupPct: number; // default 15%
  featureToggles: Record<string, boolean>;
  outlets: Outlet[];
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  recipes: Recipe[];
  stockLots: StockLot[];
  orders: Order[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  centralDebts: CentralDebtItem[];
  pettyCashExpenses: PettyCashExpense[];
  vouchers: Voucher[];
  localProposals: LocalMenuProposal[];
  cashierShifts: CashierShift[];
}

export const INITIAL_STATE: EcosystemState = {
  brandId: 'jodi',
  channelMarkupPct: 15,
  featureToggles: {
    MODULE_CRM_PROMO: true,
    MODULE_PARTNER_PORTAL: true,
    FEATURE_EXTERNAL_PURCHASE: true,
    FEATURE_LOCAL_MENU: true,
    FEATURE_APP_MARKUP: true,
  },
  outlets: INITIAL_OUTLETS,
  ingredients: INITIAL_INGREDIENTS,
  menuItems: INITIAL_MENU_ITEMS,
  recipes: INITIAL_RECIPES,
  stockLots: INITIAL_STOCK_LOTS,
  orders: INITIAL_ORDERS,
  purchaseOrders: INITIAL_PURCHASE_ORDERS,
  invoices: INITIAL_INVOICES,
  centralDebts: INITIAL_CENTRAL_DEBTS,
  pettyCashExpenses: [],
  vouchers: INITIAL_VOUCHERS,
  localProposals: [],
  cashierShifts: INITIAL_CASHIER_SHIFTS,
};

export function domainReducer(state: EcosystemState, event: DomainEvent): EcosystemState {
  switch (event.type) {
    case 'OrderPlaced': {
      const order = event.payload.order;
      const existing = state.orders.find((o) => o.id === order.id);
      if (existing) return state;

      let updatedShifts = state.cashierShifts;
      if (order.channel === 'pos') {
        const isCash = order.paymentMethod === 'cash';
        updatedShifts = state.cashierShifts.map((s) => {
          if (s.outletId === order.outletId && s.status === 'OPEN') {
            const addedCash = isCash ? order.total : 0;
            const addedQris = !isCash ? order.total : 0;
            const newCash = s.totalCashSales + addedCash;
            const newQris = s.totalQrisSales + addedQris;
            return {
              ...s,
              totalCashSales: newCash,
              totalQrisSales: newQris,
              totalTransactions: s.totalTransactions + 1,
              expectedCashInDrawer: s.startingFloat + newCash,
            };
          }
          return s;
        });
      }

      return {
        ...state,
        orders: [order, ...state.orders],
        cashierShifts: updatedShifts,
      };
    }

    case 'OrderAccepted': {
      const { orderId } = event.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'ACCEPTED', updatedAt: new Date().toISOString() } : o
        ),
      };
    }

    case 'OrderPrepStarted': {
      const { orderId } = event.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'IN_PROGRESS', updatedAt: new Date().toISOString() } : o
        ),
      };
    }

    case 'OrderReady': {
      const { orderId } = event.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'READY', updatedAt: new Date().toISOString() } : o
        ),
      };
    }

    case 'OrderPickedUp': {
      const { orderId } = event.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'PICKED_UP', updatedAt: new Date().toISOString() } : o
        ),
      };
    }

    case 'OrderCancelled': {
      const { orderId } = event.payload;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status: 'CANCELLED', updatedAt: new Date().toISOString() } : o
        ),
      };
    }

    case 'StockConsumed': {
      const { outletId, consumed } = event.payload;
      // Deduct inventory quantities from matching lots
      const updatedLots = state.stockLots.map((lot) => {
        if (lot.outletId !== outletId) return lot;
        const itemToDeduct = consumed.find((c) => c.ingredientId === lot.ingredientId);
        if (!itemToDeduct) return lot;
        const newQty = Math.max(0, lot.qty - itemToDeduct.qty);
        return { ...lot, qty: newQty };
      });
      return {
        ...state,
        stockLots: updatedLots,
      };
    }

    case 'PORequested': {
      const po = event.payload.po;
      const existing = state.purchaseOrders.find((p) => p.id === po.id);
      if (existing) return state;
      return {
        ...state,
        purchaseOrders: [po, ...state.purchaseOrders],
      };
    }

    case 'POSentToCentral': {
      const { poId } = event.payload;
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.map((p) =>
          p.id === poId ? { ...p, status: 'SENT' } : p
        ),
      };
    }

    case 'GoodsReceived': {
      const { receipt } = event.payload;
      const po = state.purchaseOrders.find((p) => p.id === receipt.poId);
      if (!po) return state;

      // Increase physical stock with status 'awaiting_invoice' (BR-05)
      const newLots: StockLot[] = receipt.items.map((item, idx) => {
        const ingredient = state.ingredients.find((i) => i.id === item.ingredientId);
        const lastUnitPrice = ingredient ? ingredient.lastPrice / ingredient.conversionRatio : 18;
        return {
          id: `lot_rec_${Date.now()}_${idx}`,
          outletId: receipt.outletId,
          ingredientId: item.ingredientId,
          qty: item.qtyReceived,
          unitCost: lastUnitPrice,
          status: 'awaiting_invoice',
          poId: receipt.poId,
          receivedAt: receipt.receivedAt,
        };
      });

      return {
        ...state,
        stockLots: [...state.stockLots, ...newLots],
        purchaseOrders: state.purchaseOrders.map((p) =>
          p.id === receipt.poId ? { ...p, status: 'AWAITING_INVOICE' } : p
        ),
      };
    }

    case 'InvoiceEntered': {
      const { invoice } = event.payload;
      // 1. Confirm lots from this PO and true-up unit cost (BR-06)
      const updatedLots = state.stockLots.map((lot) => {
        if (lot.poId === invoice.poId) {
          const invItem = invoice.items.find((i) => i.ingredientId === lot.ingredientId);
          const ingredient = state.ingredients.find((ing) => ing.id === lot.ingredientId);
          const actualUnitCost = invItem && ingredient ? invItem.actualPricePerUom / ingredient.conversionRatio : lot.unitCost;
          return {
            ...lot,
            unitCost: actualUnitCost,
            status: 'confirmed' as const,
          };
        }
        return lot;
      });

      // 2. Add to central debts
      const newDebt: CentralDebtItem = {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        outletId: invoice.outletId,
        amount: invoice.totalAmount,
        paidAmount: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      };

      return {
        ...state,
        invoices: [invoice, ...state.invoices],
        stockLots: updatedLots,
        centralDebts: [newDebt, ...state.centralDebts],
        purchaseOrders: state.purchaseOrders.map((p) =>
          p.id === invoice.poId ? { ...p, status: 'COMPLETED' } : p
        ),
      };
    }

    case 'PettyCashSubmitted': {
      const expense = event.payload.expense;
      const outlet = state.outlets.find((o) => o.id === expense.outletId);
      const isAutoApproved = outlet ? expense.amount <= outlet.pettyCashLimit : false;
      const processedExpense: PettyCashExpense = {
        ...expense,
        status: isAutoApproved ? 'APPROVED' : 'AWAITING_APPROVAL',
      };
      return {
        ...state,
        pettyCashExpenses: [processedExpense, ...state.pettyCashExpenses],
      };
    }

    case 'PettyCashApproved': {
      const { expenseId, approvedBy } = event.payload;
      return {
        ...state,
        pettyCashExpenses: state.pettyCashExpenses.map((e) =>
          e.id === expenseId ? { ...e, status: 'APPROVED', approvedBy } : e
        ),
      };
    }

    case 'LocalMenuProposed': {
      const { proposal } = event.payload;
      return {
        ...state,
        localProposals: [proposal, ...state.localProposals],
      };
    }

    case 'LocalMenuApproved': {
      const { proposalId } = event.payload;
      const proposal = state.localProposals.find((p) => p.id === proposalId);
      if (!proposal) return state;

      // Add as local menu item restricted to this outlet (BR-09)
      const newLocalMenu: MenuItem = {
        id: `menu-local-${proposal.id}`,
        name: proposal.menuName,
        category: proposal.category,
        basePrice: proposal.proposedPrice,
        description: `Menu lokal racikan khas ${proposal.outletId}`,
        scope: proposal.outletId,
        status: 'active',
      };

      const newRecipe: Recipe = {
        menuItemId: newLocalMenu.id,
        items: proposal.recipe,
      };

      return {
        ...state,
        menuItems: [...state.menuItems, newLocalMenu],
        recipes: [...state.recipes, newRecipe],
        localProposals: state.localProposals.map((p) =>
          p.id === proposalId ? { ...p, status: 'APPROVED' } : p
        ),
      };
    }

    case 'BrandThemeChanged': {
      const { brandId } = event.payload;
      return {
        ...state,
        brandId,
      };
    }

    case 'FeatureToggled': {
      const { featureKey, isEnabled } = event.payload;
      return {
        ...state,
        featureToggles: {
          ...state.featureToggles,
          [featureKey]: isEnabled,
        },
      };
    }

    case 'ChannelMarkupChanged': {
      return {
        ...state,
        channelMarkupPct: event.payload.newMarkupPct,
      };
    }

    case 'CashierShiftClosed': {
      const { shift } = event.payload;
      const exists = state.cashierShifts.some((s) => s.id === shift.id);
      return {
        ...state,
        cashierShifts: exists
          ? state.cashierShifts.map((s) => (s.id === shift.id ? shift : s))
          : [shift, ...state.cashierShifts],
      };
    }

    case 'CashierSettlementVerified': {
      const { shiftId, verifiedBy, depositRef } = event.payload;
      return {
        ...state,
        cashierShifts: state.cashierShifts.map((s) =>
          s.id === shiftId
            ? {
                ...s,
                status: 'VERIFIED',
                verifiedBy,
                verifiedAt: new Date().toLocaleTimeString('id-ID'),
                depositRef: depositRef || s.depositRef,
              }
            : s
        ),
      };
    }

    case 'DemoReset': {
      return {
        ...INITIAL_STATE,
        brandId: state.brandId, // keep active theme if selected
      };
    }

    default:
      return state;
  }
}
