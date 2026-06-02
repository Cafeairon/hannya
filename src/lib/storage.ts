// Persistência local simples (protótipo). Substituir por Lovable Cloud futuramente.
import { useEffect, useState } from "react";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  relation: string;
  priority: number;
};

export type DeviceComponent = "tracker" | "sos";

export type DeviceState = {
  trackingCode: string | null;
  status: "disconnected" | "searching" | "connected";
  battery: number; // bateria do rastreador 0-100
  sosBattery: number; // bateria do chaveiro SOS 0-100
  solarCharging: boolean;
  lastSync: number | null;
  components: Record<DeviceComponent, boolean>; // pareados
};

export type Settings = {
  silentMode: boolean;
  autoShareLocation: boolean;
  pushNotifications: boolean;
  continuousTracking: boolean;
};

export type LocationPoint = {
  ts: number;
  lat: number;
  lng: number;
  label?: string;
};

export type Incident = {
  id: string;
  createdAt: number;
  type: "assedio" | "perseguicao" | "violencia" | "outro";
  description: string;
  location: { lat: number; lng: number; label?: string } | null;
  aggressor: string;
  notes: string;
};

export type SosEvent = {
  id: string;
  ts: number;
  source: "device" | "app";
  resolved: boolean;
};

const KEYS = {
  device: "safeher.device",
  contacts: "safeher.contacts",
  settings: "safeher.settings",
  locations: "safeher.locations",
  incidents: "safeher.incidents",
  sos: "safeher.sos",
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
    sosBattery: 0,
    solarCharging: false,
    lastSync: null,
    components: { tracker: false, sos: false },
  });

export const useContacts = () => usePersistent<Contact[]>(KEYS.contacts, []);

export const useSettings = () =>
  usePersistent<Settings>(KEYS.settings, {
    silentMode: false,
    autoShareLocation: true,
    pushNotifications: true,
    continuousTracking: true,
  });

export const useLocations = () => usePersistent<LocationPoint[]>(KEYS.locations, []);
export const useIncidents = () => usePersistent<Incident[]>(KEYS.incidents, []);
export const useSosEvents = () => usePersistent<SosEvent[]>(KEYS.sos, []);

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
