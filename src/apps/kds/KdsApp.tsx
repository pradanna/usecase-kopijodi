import React, { useState, useEffect } from 'react';
import { useEcosystemStore } from '../../store/useEcosystemStore';
import { createEvent } from '../../domain/events';
import type { Order, RecipeItem } from '../../domain/types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import {
  Coffee,
  Clock,
  CheckCircle2,
  Play,
  Check,
  AlertTriangle,
  Info,
  X,
  Volume2,
} from 'lucide-react';

export const KdsApp: React.FC = () => {
  const {
    outlets,
    orders,
    recipes,
    ingredients,
    stockLots,
    dispatch,
  } = useEcosystemStore();

  const [selectedOutletId, setSelectedOutletId] = useState<string>('outlet-sudirman');
  const [activeRecipeModal, setActiveRecipeModal] = useState<{
    menuName: string;
    items: { name: string; qty: number; uom: string }[];
  } | null>(null);

  // Timer ticker every second for elapsed time
  const [, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // Filter orders for this outlet
  const outletOrders = orders.filter(
    (o) => o.outletId === selectedOutletId && o.status !== 'PICKED_UP' && o.status !== 'CANCELLED'
  );

  const newOrders = outletOrders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PLACED');
  const inProgressOrders = outletOrders.filter((o) => o.status === 'IN_PROGRESS');
  const readyOrders = outletOrders.filter((o) => o.status === 'READY');

  // Barista Actions
  const handleStartPrep = (order: Order) => {
    dispatch(
      createEvent(
        'OrderPrepStarted',
        'Barista KDS',
        { orderId: order.id, ticketNumber: order.ticketNumber },
        selectedOutletId
      )
    );
  };

  const handleMarkReady = (order: Order) => {
    // 1. Emit OrderReady
    dispatch(
      createEvent(
        'OrderReady',
        'Barista KDS',
        { orderId: order.id, ticketNumber: order.ticketNumber },
        selectedOutletId
      )
    );

    // 2. Consume Stock based on recipe (BR-08)
    const consumedList: { ingredientId: string; qty: number; uom: string }[] = [];

    order.items.forEach((item) => {
      const recipe = recipes.find((r) => r.menuItemId === item.menuItemId);
      if (recipe) {
        recipe.items.forEach((rItem) => {
          const ing = ingredients.find((i) => i.id === rItem.ingredientId);
          const totalQty = rItem.qty * item.qty;
          consumedList.push({
            ingredientId: rItem.ingredientId,
            qty: totalQty,
            uom: ing ? ing.usageUom : 'gram',
          });
        });
      }
    });

    if (consumedList.length > 0) {
      dispatch(
        createEvent(
          'StockConsumed',
          'Barista KDS (Recipe Engine)',
          { outletId: selectedOutletId, orderId: order.id, consumed: consumedList },
          selectedOutletId
        )
      );

      // Check if stock crosses safety threshold to emit LowStockAlert
      consumedList.forEach((c) => {
        const lot = stockLots.find(
          (l) => l.outletId === selectedOutletId && l.ingredientId === c.ingredientId
        );
        const ing = ingredients.find((i) => i.id === c.ingredientId);
        if (lot && ing) {
          const remainingQty = lot.qty - c.qty;
          if (remainingQty <= ing.minStock) {
            dispatch(
              createEvent(
                'LowStockAlert',
                'System Inventory Guard',
                {
                  outletId: selectedOutletId,
                  ingredientId: ing.id,
                  ingredientName: ing.name,
                  currentQty: Math.max(0, remainingQty),
                  minStock: ing.minStock,
                  uom: ing.usageUom,
                },
                selectedOutletId
              )
            );
          }
        }
      });
    }
  };

  const handleMarkPickedUp = (order: Order) => {
    dispatch(
      createEvent(
        'OrderPickedUp',
        'Barista Counter',
        { orderId: order.id },
        selectedOutletId
      )
    );
  };

  const handleOpenRecipe = (menuItemId: string, menuName: string) => {
    const recipe = recipes.find((r) => r.menuItemId === menuItemId);
    if (!recipe) return;

    const items = recipe.items.map((it) => {
      const ing = ingredients.find((i) => i.id === it.ingredientId);
      return {
        name: ing ? ing.name : it.ingredientId,
        qty: it.qty,
        uom: ing ? ing.usageUom : '',
      };
    });

    setActiveRecipeModal({ menuName, items });
  };

  return (
    <div className="flex flex-col h-full bg-[#14181F] text-white select-none overflow-hidden font-sans">
      {/* Top Bar for KDS Monitor */}
      <div className="h-14 bg-[#1C2029] border-b border-gray-800 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-600)] flex items-center justify-center font-bold text-white">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-gray-400">KDS BARISTA MONITOR</div>
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="text-xs font-bold text-amber-400 bg-transparent outline-none cursor-pointer"
            >
              {outlets.map((o) => (
                <option key={o.id} value={o.id} className="bg-gray-900 text-white">
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audio Alert: On</span>
          </div>
          <div className="bg-gray-800/80 px-3 py-1 rounded-lg text-gray-300 font-bold">
            Total Antrean: {outletOrders.length} Pesanan
          </div>
        </div>
      </div>

      {/* 3 Columns Layout: Baru (New) | Dibuat (In Progress) | Siap (Ready) */}
      <div className="flex-1 p-4 grid grid-cols-3 gap-4 overflow-hidden">
        {/* COLUMN 1: BARU */}
        <div className="flex flex-col bg-[#1A1E27] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="h-11 bg-blue-900/40 border-b border-blue-800/40 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="font-bold text-xs text-blue-300 tracking-wider uppercase">
                1. Antrean Baru ({newOrders.length})
              </span>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {newOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#242A36] border border-blue-500/30 rounded-xl p-3 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-extrabold text-xl text-blue-400">
                      {order.ticketNumber}
                    </span>
                    <Badge variant={order.channel === 'app' ? 'info' : 'neutral'} className="text-[10px]">
                      {order.channel === 'app' ? 'Online App' : 'Kasir Walk-in'}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-400 mb-2 font-medium">
                    Atas nama: <span className="text-white font-bold">{order.customerName}</span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 border-t border-gray-700/60 pt-2 text-xs">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{it.qty}x</span>
                            <span>{it.menuName}</span>
                            <button
                              onClick={() => handleOpenRecipe(it.menuItemId, it.menuName)}
                              className="text-gray-400 hover:text-amber-400 p-0.5"
                              title="Lihat Takaran Resep"
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          </div>
                          {it.selectedModifiers.length > 0 && (
                            <div className="text-[10px] text-amber-300 pl-4">
                              {it.selectedModifiers.map((m) => m.optionName).join(', ')}
                            </div>
                          )}
                          {it.notes && (
                            <div className="text-[10px] text-gray-400 italic pl-4">
                              Catatan: "{it.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-700/60">
                  <button
                    onClick={() => handleStartPrep(order)}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Mulai Buat Minuman
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: DIBUAT (IN PROGRESS) */}
        <div className="flex flex-col bg-[#1A1E27] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="h-11 bg-amber-900/30 border-b border-amber-800/40 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold text-xs text-amber-300 tracking-wider uppercase">
                2. Sedang Diracik ({inProgressOrders.length})
              </span>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {inProgressOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#242A36] border-2 border-amber-500/50 rounded-xl p-3 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-extrabold text-xl text-amber-400">
                      {order.ticketNumber}
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      Sedang Dibuat
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-400 mb-2 font-medium">
                    Atas nama: <span className="text-white font-bold">{order.customerName}</span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 border-t border-gray-700/60 pt-2 text-xs">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{it.qty}x</span>
                            <span>{it.menuName}</span>
                            <button
                              onClick={() => handleOpenRecipe(it.menuItemId, it.menuName)}
                              className="text-gray-400 hover:text-amber-400 p-0.5"
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          </div>
                          {it.selectedModifiers.length > 0 && (
                            <div className="text-[10px] text-amber-300 pl-4">
                              {it.selectedModifiers.map((m) => m.optionName).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-700/60">
                  <button
                    onClick={() => handleMarkReady(order)}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Siap (Otomatis Potong Stok)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: SIAP DI COUNTER */}
        <div className="flex flex-col bg-[#1A1E27] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="h-11 bg-emerald-900/30 border-b border-emerald-800/40 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-bold text-xs text-emerald-300 tracking-wider uppercase">
                3. Siap di Counter ({readyOrders.length})
              </span>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#242A36] border border-emerald-500/40 rounded-xl p-3 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-extrabold text-xl text-emerald-400">
                      {order.ticketNumber}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      Siap Ambil
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-300 font-bold mb-2">
                    {order.customerName}
                  </div>

                  <div className="text-xs text-gray-400 space-y-1 border-t border-gray-700/60 pt-2">
                    {order.items.map((it, i) => (
                      <div key={i}>
                        {it.qty}x {it.menuName}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-700/60">
                  <button
                    onClick={() => handleMarkPickedUp(order)}
                    className="w-full h-11 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Selesai / Diserahkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Popup Helper */}
      {activeRecipeModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1F2430] border border-gray-700 rounded-2xl w-80 p-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
              <span className="font-bold text-amber-400">Takaran Resep SOP</span>
              <button
                onClick={() => setActiveRecipeModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="font-bold text-sm text-white my-2">
              {activeRecipeModal.menuName}
            </div>
            <div className="space-y-1.5 py-2">
              {activeRecipeModal.items.map((it, i) => (
                <div key={i} className="flex justify-between text-gray-300">
                  <span>{it.name}</span>
                  <span className="font-mono font-bold text-amber-300">
                    {it.qty} {it.uom}
                  </span>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setActiveRecipeModal(null)}
              className="w-full mt-3"
            >
              Tutup Panduan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
