// Cross-tab and Cross-iframe Event Bus using BroadcastChannel API with Storage fallback

import type { DomainEvent } from '../domain/events';

type EventListener = (event: DomainEvent) => void;

class EventBus {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<EventListener> = new Set();
  private channelName = 'kopi_jodi_event_bus';

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (messageEvent) => {
          const domainEvent = messageEvent.data as DomainEvent;
          this.notifyLocalListeners(domainEvent);
        };
      } catch (err) {
        console.warn('BroadcastChannel failed, fallback to storage events', err);
        this.setupStorageFallback();
      }
    } else if (typeof window !== 'undefined') {
      this.setupStorageFallback();
    }
  }

  private setupStorageFallback() {
    window.addEventListener('storage', (storageEvent) => {
      if (storageEvent.key === this.channelName && storageEvent.newValue) {
        try {
          const domainEvent = JSON.parse(storageEvent.newValue) as DomainEvent;
          this.notifyLocalListeners(domainEvent);
        } catch (e) {
          console.error('Failed to parse storage event payload', e);
        }
      }
    });
  }

  private notifyLocalListeners(event: DomainEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in event bus listener', err);
      }
    });
  }

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public publish(event: DomainEvent): void {
    // 1. Notify local listeners in current window
    this.notifyLocalListeners(event);

    // 2. Broadcast to other windows / iframes
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.error('Failed to postMessage on BroadcastChannel', err);
      }
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(this.channelName, JSON.stringify(event));
      } catch (err) {
        console.error('Failed to write to localStorage fallback', err);
      }
    }
  }
}

export const eventBus = new EventBus();
