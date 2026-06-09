import { useState, useEffect } from "react";

type Listener = () => void;

export interface Store<T> {
  get: () => T;
  set: (val: T) => void;
  subscribe: (fn: Listener) => () => void;
}

export function createStore<T>(key: string, getDefault: () => T): Store<T> {
  let state: T;
  const listeners = new Set<Listener>();

  try {
    const raw = localStorage.getItem(key);
    state = raw !== null ? (JSON.parse(raw) as T) : getDefault();
  } catch {
    state = getDefault();
  }

  return {
    get: () => state,
    set: (val: T) => {
      state = val;
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {
      }
      listeners.forEach((fn) => fn());
    },
    subscribe: (fn: Listener) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export function useStoreValue<T>(store: Store<T>): T {
  const [, setTick] = useState(0);
  useEffect(() => store.subscribe(() => setTick((t) => t + 1)), [store]);
  return store.get();
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
