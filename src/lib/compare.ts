import { useSyncExternalStore } from "react";

const KEY = "suzuki-compare";
export const MAX_COMPARE = 3;

let ids: string[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) ids = JSON.parse(raw) as string[];
  } catch {
    ids = [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  // Notify once after hydration so the client picks up stored ids.
  queueMicrotask(listener);
  return () => listeners.delete(listener);
}

const emptySnapshot: string[] = [];

export function useCompare() {
  const selected = useSyncExternalStore(
    subscribe,
    () => ids,
    () => emptySnapshot,
  );

  return {
    selected,
    isSelected: (id: string) => selected.includes(id),
    toggle: (id: string) => {
      if (ids.includes(id)) ids = ids.filter((x) => x !== id);
      else if (ids.length < MAX_COMPARE) ids = [...ids, id];
      else return false;
      persist();
      emit();
      return true;
    },
    remove: (id: string) => {
      ids = ids.filter((x) => x !== id);
      persist();
      emit();
    },
    clear: () => {
      ids = [];
      persist();
      emit();
    },
  };
}
