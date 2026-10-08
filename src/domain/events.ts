// Domain Event Catalog and Definitions

import type {
  Order,
  PurchaseOrder,
  GoodsReceipt,
  Invoice,
  PettyCashExpense,
  CentralPaymentRecord,
  Voucher,
  LocalMenuProposal,
  BrandThemeId,
  CashierShift,
} from './types';

export type EventType =
  // Sales
  | 'OrderPlaced'
  | 'PaymentCaptured'
  | 'OrderAccepted'
  | 'OrderPrepStarted'
  | 'OrderReady'
  | 'OrderPickedUp'
  | 'OrderCancelled'
  // Inventory
  | 'StockConsumed'
  | 'StockAdjusted'
  | 'LowStockAlert'
  // Procurement
  | 'PORequested'
  | 'POSentToCentral'
  | 'GoodsReceived'
  | 'InvoiceEntered'
  | 'ExternalPurchaseRequested'
  | 'ExternalPurchaseApproved'
  | 'ExternalPurchaseRejected'
  // Finance
  | 'PaymentToCentralRecorded'
  | 'PettyCashSubmitted'
  | 'PettyCashApproved'
  | 'PettyCashRejected'
  | 'HppRecalculated'
  | 'CashierShiftClosed'
  | 'CashierSettlementVerified'
  // Catalog
  | 'LocalMenuProposed'
  | 'LocalMenuApproved'
  | 'LocalMenuRejected'
  | 'ChannelMarkupChanged'
  // Promotion
  | 'VoucherCreated'
  | 'VoucherRedeemed'
  // Platform
  | 'BrandThemeChanged'
  | 'FeatureToggled'
  | 'DemoReset';

export interface BaseDomainEvent<T extends EventType, P = Record<string, unknown>> {
  id: string;
  seq: number;
  ts: number;
  type: T;
  actor: string;
  outletId?: string;
  payload: P;
}

// Event Payload Definitions
export type OrderPlacedEvent = BaseDomainEvent<'OrderPlaced', { order: Order }>;
export type PaymentCapturedEvent = BaseDomainEvent<'PaymentCaptured', { orderId: string; amount: number; method: 'cash' | 'qris' }>;
export type OrderAcceptedEvent = BaseDomainEvent<'OrderAccepted', { orderId: string; estimatedMinutes: number }>;
export type OrderPrepStartedEvent = BaseDomainEvent<'OrderPrepStarted', { orderId: string; ticketNumber: string }>;
export type OrderReadyEvent = BaseDomainEvent<'OrderReady', { orderId: string; ticketNumber: string }>;
export type OrderPickedUpEvent = BaseDomainEvent<'OrderPickedUp', { orderId: string }>;
export type OrderCancelledEvent = BaseDomainEvent<'OrderCancelled', { orderId: string; reason: string }>;

export type StockConsumedEvent = BaseDomainEvent<'StockConsumed', {
  outletId: string;
  orderId: string;
  consumed: { ingredientId: string; qty: number; uom: string }[];
}>;

export type LowStockAlertEvent = BaseDomainEvent<'LowStockAlert', {
  outletId: string;
  ingredientId: string;
  ingredientName: string;
  currentQty: number;
  minStock: number;
  uom: string;
}>;

export type PORequestedEvent = BaseDomainEvent<'PORequested', { po: PurchaseOrder }>;
export type POSentToCentralEvent = BaseDomainEvent<'POSentToCentral', { poId: string }>;
export type GoodsReceivedEvent = BaseDomainEvent<'GoodsReceived', { receipt: GoodsReceipt }>;
export type InvoiceEnteredEvent = BaseDomainEvent<'InvoiceEntered', { invoice: Invoice }>;
export type HppRecalculatedEvent = BaseDomainEvent<'HppRecalculated', {
  outletId: string;
  ingredientId: string;
  oldUnitCost: number;
  newUnitCost: number;
}>;

export type ExternalPurchaseRequestedEvent = BaseDomainEvent<'ExternalPurchaseRequested', { po: PurchaseOrder }>;
export type ExternalPurchaseApprovedEvent = BaseDomainEvent<'ExternalPurchaseApproved', { poId: string; approvedBy: string }>;
export type ExternalPurchaseRejectedEvent = BaseDomainEvent<'ExternalPurchaseRejected', { poId: string; reason: string }>;

export type PettyCashSubmittedEvent = BaseDomainEvent<'PettyCashSubmitted', { expense: PettyCashExpense }>;
export type PettyCashApprovedEvent = BaseDomainEvent<'PettyCashApproved', { expenseId: string; approvedBy: string }>;
export type PettyCashRejectedEvent = BaseDomainEvent<'PettyCashRejected', { expenseId: string; reason: string }>;
export type PaymentToCentralRecordedEvent = BaseDomainEvent<'PaymentToCentralRecorded', { payment: CentralPaymentRecord }>;

export type CashierShiftClosedEvent = BaseDomainEvent<'CashierShiftClosed', { shift: CashierShift }>;
export type CashierSettlementVerifiedEvent = BaseDomainEvent<'CashierSettlementVerified', { shiftId: string; verifiedBy: string; depositRef: string }>;

export type LocalMenuProposedEvent = BaseDomainEvent<'LocalMenuProposed', { proposal: LocalMenuProposal }>;
export type LocalMenuApprovedEvent = BaseDomainEvent<'LocalMenuApproved', { proposalId: string; approvedMenuId: string }>;
export type LocalMenuRejectedEvent = BaseDomainEvent<'LocalMenuRejected', { proposalId: string; reason: string }>;

export type ChannelMarkupChangedEvent = BaseDomainEvent<'ChannelMarkupChanged', { newMarkupPct: number }>;
export type VoucherCreatedEvent = BaseDomainEvent<'VoucherCreated', { voucher: Voucher }>;
export type VoucherRedeemedEvent = BaseDomainEvent<'VoucherRedeemed', { voucherCode: string; orderId: string }>;

export type BrandThemeChangedEvent = BaseDomainEvent<'BrandThemeChanged', { brandId: BrandThemeId }>;
export type FeatureToggledEvent = BaseDomainEvent<'FeatureToggled', { featureKey: string; isEnabled: boolean }>;
export type DemoResetEvent = BaseDomainEvent<'DemoReset', { resetAt: number }>;

export type DomainEvent =
  | OrderPlacedEvent
  | PaymentCapturedEvent
  | OrderAcceptedEvent
  | OrderPrepStartedEvent
  | OrderReadyEvent
  | OrderPickedUpEvent
  | OrderCancelledEvent
  | StockConsumedEvent
  | LowStockAlertEvent
  | PORequestedEvent
  | POSentToCentralEvent
  | GoodsReceivedEvent
  | InvoiceEnteredEvent
  | HppRecalculatedEvent
  | ExternalPurchaseRequestedEvent
  | ExternalPurchaseApprovedEvent
  | ExternalPurchaseRejectedEvent
  | PettyCashSubmittedEvent
  | PettyCashApprovedEvent
  | PettyCashRejectedEvent
  | PaymentToCentralRecordedEvent
  | CashierShiftClosedEvent
  | CashierSettlementVerifiedEvent
  | LocalMenuProposedEvent
  | LocalMenuApprovedEvent
  | LocalMenuRejectedEvent
  | ChannelMarkupChangedEvent
  | VoucherCreatedEvent
  | VoucherRedeemedEvent
  | BrandThemeChangedEvent
  | FeatureToggledEvent
  | DemoResetEvent;

export function createEvent<T extends EventType, P>(
  type: T,
  actor: string,
  payload: P,
  outletId?: string
): BaseDomainEvent<T, P> {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    seq: Date.now(),
    ts: Date.now(),
    type,
    actor,
    outletId,
    payload,
  };
}
