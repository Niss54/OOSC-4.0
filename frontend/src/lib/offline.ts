const DB_NAME = "adhikaar-db";
const DB_VERSION = 1;

const STORES = {
  profile: "profile",
  schemes: "schemes",
  syncQueue: "sync-queue",
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.profile)) {
        db.createObjectStore(STORES.profile, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.schemes)) {
        db.createObjectStore(STORES.schemes, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.syncQueue)) {
        db.createObjectStore(STORES.syncQueue, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProfile(profile: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.profile, "readwrite");
    const store = tx.objectStore(STORES.profile);
    store.put({ id: "current-user", ...profile });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getProfile(): Promise<Record<string, unknown> | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.profile, "readonly");
    const store = tx.objectStore(STORES.profile);
    const request = store.get("current-user");
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function cacheSchemes(schemes: unknown[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.schemes, "readwrite");
    const store = tx.objectStore(STORES.schemes);
    store.clear();
    for (const scheme of schemes) {
      store.put(scheme);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCachedSchemes(): Promise<unknown[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.schemes, "readonly");
    const store = tx.objectStore(STORES.schemes);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
}

export async function queueFormSubmission(data: Record<string, unknown>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.syncQueue, "readwrite");
    const store = tx.objectStore(STORES.syncQueue);
    store.add({
      ...data,
      queuedAt: new Date().toISOString(),
      status: "pending",
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getSyncQueue(): Promise<Record<string, unknown>[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.syncQueue, "readonly");
    const store = tx.objectStore(STORES.syncQueue);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
}
