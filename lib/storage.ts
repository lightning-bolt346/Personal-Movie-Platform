export interface VoidStorage {
  history: any[];
  watchlist: any[];
  favorites: any[];
  notifications: any[];
  searchHistory: string[];
  settings: {
    lastSourceId?: string;
    autoPlayNext?: boolean;
  };
  preferences?: any;
}

const STORAGE_KEY = 'voidstream_app_state_v2'; // versioned schema migration

const defaultState: VoidStorage = {
  history: [],
  watchlist: [],
  favorites: [],
  notifications: [],
  searchHistory: [],
  settings: {
    autoPlayNext: true
  }
};

let cachedState: VoidStorage | null = null;

export const storage = {
  get: (): VoidStorage => {
    if (typeof window === 'undefined') return defaultState;
    if (cachedState) return cachedState;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        cachedState = JSON.parse(data);
        return cachedState!;
      }
    } catch (e) {
      console.warn('Failed to parse local storage, resetting to default', e);
    }
    cachedState = defaultState;
    return defaultState;
  },
  set: (data: Partial<VoidStorage>) => {
    if (typeof window === 'undefined') return;
    try {
      const current = storage.get();
      const updated = { ...current, ...data };
      cachedState = updated; // Update memory cache
      
      // Safe stringify to handle unexpected circular references just in case
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (_key: string, value: any) => {
          if (typeof value === "object" && value !== null) {
            try {
              if (value instanceof Element || ('nodeType' in value && typeof value.nodeType === 'number') || value instanceof Event) return "[DOM Node/Event]";
            } catch (_) { /* ignore */ }
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, getCircularReplacer()));
    } catch (e) {
      console.warn('Failed to save to local storage', e);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    cachedState = null; // Reset memory cache
    localStorage.removeItem(STORAGE_KEY);
  }
};
