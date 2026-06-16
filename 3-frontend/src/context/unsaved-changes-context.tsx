"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface UnsavedChangesContextValue {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  confirmIfDirty: () => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);

  const confirmIfDirty = useCallback(() => {
    if (!isDirty) return true;
    return window.confirm("You have unsaved changes. Leave anyway?");
  }, [isDirty]);

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty, confirmIfDirty }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) {
    throw new Error("useUnsavedChanges must be used within UnsavedChangesProvider");
  }
  return ctx;
}

export function useOptionalUnsavedChanges() {
  return useContext(UnsavedChangesContext);
}
