import { useEffect, useState, useCallback } from "react";
import { tablesData, RestaurantTable } from "@/data/tables";

const STORAGE_KEY = "catedral_tables";
const EVENT = "catedral-tables-changed";

function readStorage(): RestaurantTable[] {
  if (typeof window === "undefined") return tablesData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return tablesData;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as RestaurantTable[];
    return tablesData;
  } catch {
    return tablesData;
  }
}

function writeStorage(tables: RestaurantTable[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
  window.dispatchEvent(new CustomEvent(EVENT));
}

/**
 * Centralized tables store backed by localStorage.
 * Replace readStorage/writeStorage with API calls when wiring a real backend.
 */
export function useTables() {
  const [tables, setTables] = useState<RestaurantTable[]>(() => readStorage());

  useEffect(() => {
    const sync = () => setTables(readStorage());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const saveTables = useCallback((next: RestaurantTable[]) => {
    writeStorage(next);
    setTables(next);
  }, []);

  const updateTable = useCallback(
    (id: number, patch: Partial<RestaurantTable>) => {
      const next = readStorage().map((t) => (t.id === id ? { ...t, ...patch } : t));
      writeStorage(next);
      setTables(next);
    },
    [],
  );

  const addTable = useCallback((table: Omit<RestaurantTable, "id">) => {
    const current = readStorage();
    const id = Math.max(0, ...current.map((t) => t.id)) + 1;
    const next = [...current, { ...table, id }];
    writeStorage(next);
    setTables(next);
    return id;
  }, []);

  const removeTable = useCallback((id: number) => {
    const next = readStorage().filter((t) => t.id !== id);
    writeStorage(next);
    setTables(next);
  }, []);

  return { tables, saveTables, updateTable, addTable, removeTable };
}
