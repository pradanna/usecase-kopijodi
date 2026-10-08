// Global Reactive Zustand Store synced with BroadcastChannel EventBus & IndexedDB

import { create } from 'zustand';
import type { DomainEvent } from '../domain/events';
import { domainReducer, INITIAL_STATE, type EcosystemState } from '../domain/reducers';
import { eventBus } from '../platform/bus';
import { logEvent, clearEventLog } from '../platform/eventLog';

interface EcosystemStore extends EcosystemState {
  isInitialized: boolean;
  initStore: () => void;
  dispatch: (event: DomainEvent) => void;
}

export const useEcosystemStore = create<EcosystemStore>((set, get) => ({
  ...INITIAL_STATE,
  isInitialized: false,

  initStore: () => {
    if (get().isInitialized) return;

    // Listen to events coming from other iframes / tabs
    eventBus.subscribe((event: DomainEvent) => {
      set((state) => domainReducer(state, event));

      // Reflect theme changes on DOM root immediately
      if (event.type === 'BrandThemeChanged') {
        document.documentElement.setAttribute(
          'data-theme',
          event.payload.brandId === 'teras' ? 'teras-kopi' : ''
        );
      }
    });

    set({ isInitialized: true });
  },

  dispatch: (event: DomainEvent) => {
    // 1. Log to IndexedDB asynchronously
    logEvent(event);

    // 2. Broadcast to other iframes / tabs and notify local eventBus listeners
    eventBus.publish(event);

    // 3. If reset event, clear IndexedDB
    if (event.type === 'DemoReset') {
      clearEventLog();
    }
  },
}));
