// Persistência local simples (protótipo). Substituir por Firebase futuramente.
import { useEffect, useState } from "react";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  relation: string; // grau de proximidade
  priority: number; // 1 = primeiro a ser avisado
};

export type DeviceState = {
  trackingCode: string | null;
  status: "disconnected" | "searching" | "connected";
  battery: number; // 0-100
  lastSync: number | null;
};

export type Settings = {
  silentMode: boolean;
  autoShareLocation: boolean;
  pushNotifications: boolean;
};

const KEYS = {
  device: "safeher.device",
  contacts: "safeher.contacts",
  settings: "safeher.settings",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

// React hook utilitário
function usePersistent<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read<T>(key, fallback));
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setValue(read<T>(key, fallback));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = (v: T | ((p: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      write(key, next);
      return next;
    });
  };
  return [value, update];
}

export const useDevice = () =>
  usePersistent<DeviceState>(KEYS.device, {
    trackingCode: null,
    status: "disconnected",
    battery: 0,
    lastSync: null,
  });

export const useContacts = () => usePersistent<Contact[]>(KEYS.contacts, []);

export const useSettings = () =>
  usePersistent<Settings>(KEYS.settings, {
    silentMode: false,
    autoShareLocation: true,
    pushNotifications: true,
  });

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
