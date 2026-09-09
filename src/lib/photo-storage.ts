import type { Consult, Photo } from "./types";

const DB_NAME = "aura-clinic-media";
const STORE = "images";

type PersistBlob = {
  state?: {
    photos?: Photo[];
    consults?: Consult[];
  };
};

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function mediaPut(key: string, dataUrl: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(dataUrl, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function mediaGetAll(): Promise<Record<string, string>> {
  const db = await openDb();
  if (!db) return {};
  return new Promise((resolve) => {
    const out: Record<string, string> = {};
    try {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          if (typeof cursor.value === "string") out[String(cursor.key)] = cursor.value;
          cursor.continue();
        } else {
          resolve(out);
        }
      };
      req.onerror = () => resolve(out);
    } catch {
      resolve(out);
    }
  });
}

function slimUrl(id: string, url?: string): string {
  if (!url) return "";
  if (url.startsWith("data:")) return `idb:${id}`;
  if (url.startsWith("blob:")) return "";
  return url;
}

function restoreUrl(id: string, url: string | undefined, blobs: Record<string, string>): string {
  if (url === "/gallery/sujin-before.jpg") url = "/gallery/sujin-before.svg";
  if (url?.startsWith("idb:")) return blobs[url.slice(4)] ?? blobs[id] ?? "";
  if (!url || url.startsWith("blob:")) return blobs[id] ?? "";
  if (url.startsWith("data:")) return blobs[id] ?? url;
  return url;
}

/** Move data-URL photos out of localStorage so the v6 key stays under quota. */
export async function inflatePersisted(raw: string): Promise<string> {
  let parsed: PersistBlob;
  try {
    parsed = JSON.parse(raw) as PersistBlob;
  } catch {
    return raw;
  }
  const state = parsed.state;
  if (!state) return raw;
  const blobs = await mediaGetAll();
  if (Array.isArray(state.photos)) {
    state.photos = state.photos.map((ph) => ({
      ...ph,
      url: restoreUrl(ph.id, ph.url, blobs),
    }));
  }
  if (Array.isArray(state.consults)) {
    state.consults = state.consults.map((c) => ({
      ...c,
      photoUrls: (c.photoUrls ?? []).map((url, i) => restoreUrl(`${c.id}:${i}`, url, blobs)),
    }));
  }
  return JSON.stringify(parsed);
}

async function mediaHas(key: string): Promise<boolean> {
  const blobs = await mediaGetAll();
  return Boolean(blobs[key]);
}

export async function deflatePersisted(raw: string): Promise<string> {
  let parsed: PersistBlob;
  try {
    parsed = JSON.parse(raw) as PersistBlob;
  } catch {
    return raw;
  }
  const state = parsed.state;
  if (!state) return raw;
  if (Array.isArray(state.photos)) {
    const next: Photo[] = [];
    for (const ph of state.photos) {
      if (ph.url?.startsWith("data:")) {
        await mediaPut(ph.id, ph.url);
        const ok = await mediaHas(ph.id);
        next.push({ ...ph, url: ok ? slimUrl(ph.id, ph.url) : ph.url });
      } else {
        next.push({ ...ph, url: slimUrl(ph.id, ph.url) });
      }
    }
    state.photos = next;
  }
  if (Array.isArray(state.consults)) {
    for (const c of state.consults) {
      const urls = c.photoUrls ?? [];
      const next: string[] = [];
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const key = `${c.id}:${i}`;
        if (url?.startsWith("data:")) {
          await mediaPut(key, url);
          const ok = await mediaHas(key);
          next.push(ok ? slimUrl(key, url) : url);
        } else {
          next.push(slimUrl(key, url));
        }
      }
      c.photoUrls = next;
    }
  }
  return JSON.stringify(parsed);
}

export const clinicPersistStorage = {
  getItem: async (name: string) => {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    return inflatePersisted(raw);
  },
  setItem: async (name: string, value: string) => {
    if (typeof localStorage === "undefined") return;
    const slim = await deflatePersisted(value);
    try {
      localStorage.setItem(name, slim);
    } catch {
      /* quota: images already in IndexedDB; keep previous localStorage */
    }
  },
  removeItem: async (name: string) => {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(name);
  },
};
