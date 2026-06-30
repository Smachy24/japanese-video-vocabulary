import { useState } from "react";
import { JlptLevel } from "../types/token";

export type JlptFilter = JlptLevel | null;

const STORAGE_KEY = "jlpt-filter";

function readFromStorage(): JlptFilter {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (stored as JlptLevel) : null;
}

export function useJlptFilter(): { filter: JlptFilter; setFilter: (level: JlptFilter) => void } {
  const [filter, setFilterState] = useState<JlptFilter>(readFromStorage);

  const setFilter = (level: JlptFilter): void => {
    setFilterState(level);
    if (level === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, level);
    }
  };

  return { filter, setFilter };
}
