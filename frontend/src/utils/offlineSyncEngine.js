const DB_NAME = 'KarunaOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'sos_outbox';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineTicket(ticketData) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = {
        ...ticketData,
        savedOfflineAt: Date.now(),
        syncStatus: 'PENDING_OUTBOX'
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB fails
    const existing = JSON.parse(localStorage.getItem('karuna_outbox') || '[]');
    existing.push(ticketData);
    localStorage.setItem('karuna_outbox', JSON.stringify(existing));
    return ticketData;
  }
}

export async function getOfflineOutbox() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    return JSON.parse(localStorage.getItem('karuna_outbox') || '[]');
  }
}

export async function clearSyncedTicket(ticketId) {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(ticketId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    const existing = JSON.parse(localStorage.getItem('karuna_outbox') || '[]');
    const updated = existing.filter((item) => item.id !== ticketId);
    localStorage.setItem('karuna_outbox', JSON.stringify(updated));
    return true;
  }
}

export function registerOnlineSyncListener(onSyncReadyCallback) {
  window.addEventListener('online', async () => {
    const pendingTickets = await getOfflineOutbox();
    if (pendingTickets.length > 0 && typeof onSyncReadyCallback === 'function') {
      onSyncReadyCallback(pendingTickets);
    }
  });
}