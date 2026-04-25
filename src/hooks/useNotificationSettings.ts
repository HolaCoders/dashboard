import { useEffect, useState, useCallback } from "react";

export interface NotificationSettings {
  newReservation: boolean;
  cancellation: boolean;
  reminder: boolean;
  whatsapp: boolean;
  email: boolean;
}

const DEFAULTS: NotificationSettings = {
  newReservation: true,
  cancellation: true,
  reminder: false,
  whatsapp: true,
  email: false,
};

const STORAGE_KEY = "catedral_notifications";
const EVENT = "catedral-notifications-changed";

function readStorage(): NotificationSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function writeStorage(settings: NotificationSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * Notification preferences backed by localStorage.
 * Swap readStorage/writeStorage for API calls when wiring a real backend.
 */
export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(() => readStorage());

  useEffect(() => {
    const sync = () => setSettings(readStorage());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<NotificationSettings>) => {
    const next = { ...readStorage(), ...patch };
    writeStorage(next);
    setSettings(next);
  }, []);

  const save = useCallback((next: NotificationSettings) => {
    writeStorage(next);
    setSettings(next);
  }, []);

  return { settings, update, save };
}
