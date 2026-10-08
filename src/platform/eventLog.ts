// IndexedDB Event Log for Persistent Event Sourcing

import { openDB, type IDBPDatabase } from 'idb';
import type { DomainEvent } from '../domain/events';

const DB_NAME = 'kopi_jodi_db';
const DB_VERSION = 1;
const STORE_EVENTS = 'events';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_EVENTS)) {
          const store = db.createObjectStore(STORE_EVENTS, { keyPath: 'id' });
          store.createIndex('by_seq', 'seq');
          store.createIndex('by_type', 'type');
          store.createIndex('by_outlet', 'outletId');
        }
      },
    });
  }
  return dbPromise;
}

export async function logEvent(event: DomainEvent): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE_EVENTS, event);
  } catch (err) {
    console.error('Failed to append event to IndexedDB', err);
  }
}

export async function getEventHistory(): Promise<DomainEvent[]> {
  try {
    const db = await getDb();
    const events = await db.getAllFromIndex(STORE_EVENTS, 'by_seq');
    return events;
  } catch (err) {
    console.error('Failed to load event history from IndexedDB', err);
    return [];
  }
}

export async function clearEventLog(): Promise<void> {
  try {
    const db = await getDb();
    await db.clear(STORE_EVENTS);
  } catch (err) {
    console.error('Failed to clear event log in IndexedDB', err);
  }
}
