'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';

/**
 * The order list ("cart"). The live site has no online checkout, so this is a
 * list the customer builds and then sends on WhatsApp or as a quotation
 * request. Stored in localStorage so it survives visits and works for reorders.
 */
export type OrderUnit = 'carton' | 'unit';
export type OrderItem = { id: number; qty: number; unit: OrderUnit };

const KEY = 'awq-order-list';
const EVENT = 'awq-order-list-change';
const EMPTY = '[]';

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) callback(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(EVENT, callback);
  };
}

const noopSubscribe = () => () => {};

function write(items: OrderItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function parse(raw: string): OrderItem[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((i) => Number.isInteger(i?.id) && i.qty > 0).map((i) => ({ id: i.id, qty: Math.min(Math.round(i.qty), 10000), unit: i.unit === 'carton' ? 'carton' : 'unit' }))
      : [];
  } catch {
    return [];
  }
}

type Toast = { id: number; message: string } | null;

type OrderListContext = {
  /** False during server render and hydration, before the saved list has been read. */
  ready: boolean;
  items: OrderItem[];
  count: number;
  add: (id: number, qty: number, unit: OrderUnit, message?: string) => void;
  update: (id: number, patch: Partial<Omit<OrderItem, 'id'>>) => void;
  remove: (id: number) => void;
  clear: () => void;
  toast: Toast;
  dismissToast: () => void;
};

const Ctx = createContext<OrderListContext | null>(null);

export function OrderListProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const items = useMemo(() => parse(raw), [raw]);
  const [toast, setToast] = useState<Toast>(null);

  const add = useCallback((id: number, qty: number, unit: OrderUnit, message?: string) => {
    const current = parse(read());
    const existing = current.find((i) => i.id === id);
    const next = existing
      ? current.map((i) => (i.id === id ? { ...i, qty: i.unit === unit ? i.qty + qty : qty, unit } : i))
      : [...current, { id, qty, unit }];
    write(next);
    if (message) setToast({ id: Date.now(), message });
  }, []);

  const update = useCallback((id: number, patch: Partial<Omit<OrderItem, 'id'>>) => {
    write(parse(read()).map((i) => (i.id === id ? { ...i, ...patch, qty: Math.max(1, Math.min(10000, Math.round(patch.qty ?? i.qty))) } : i)));
  }, []);

  const remove = useCallback((id: number) => write(parse(read()).filter((i) => i.id !== id)), []);
  const clear = useCallback(() => write([]), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({ ready, items, count: items.length, add, update, remove, clear, toast, dismissToast }),
    [ready, items, add, update, remove, clear, toast, dismissToast],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrderList() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOrderList must be used inside OrderListProvider');
  return ctx;
}
