import { useState, useCallback } from "react";
import { settingsStore, passwordsStore } from "@/lib/stores";
import { useStoreValue } from "@/lib/local-store";

export function useSettings() {
  const settings = useStoreValue(settingsStore);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateSettings = useCallback(
    ({ data }: { data: Record<string, unknown> }) => {
      setIsUpdating(true);

      const current = settingsStore.get();
      const { person1Password, person2Password, ...rest } = data as {
        person1Password?: string;
        person2Password?: string;
        [key: string]: unknown;
      };

      settingsStore.set({
        ...current,
        ...(rest as object),
        updatedAt: new Date().toISOString(),
      });

      if (person1Password?.trim() || person2Password?.trim()) {
        const pw = passwordsStore.get();
        passwordsStore.set({
          p1: person1Password?.trim() || pw.p1,
          p2: person2Password?.trim() || pw.p2,
        });
      }

      setIsUpdating(false);
    },
    [],
  );

  return {
    settings,
    isLoading: false,
    updateSettings,
    isUpdating,
  };
}
