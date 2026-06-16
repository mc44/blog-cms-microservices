"use client";

import { useCallback, useEffect } from "react";

export function useUnsavedGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const confirmLeave = useCallback(
    (message = "You have unsaved changes. Leave anyway?") => {
      if (!isDirty) return true;
      return window.confirm(message);
    },
    [isDirty]
  );

  return { confirmLeave };
}
