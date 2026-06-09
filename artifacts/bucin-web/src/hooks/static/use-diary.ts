import { useState, useCallback } from "react";
import { diaryStore } from "@/lib/stores";
import { useStoreValue, fileToDataUrl } from "@/lib/local-store";
import type { DiaryEntry } from "@/lib/types";

export function useDiary() {
  const entries = useStoreValue(diaryStore);
  const [isCreating, setIsCreating] = useState(false);

  const createEntry = useCallback(
    async (
      { data }: { data: { content?: string; image?: File } },
      opts?: { onSuccess?: () => void },
    ) => {
      setIsCreating(true);
      try {
        let imageUrl: string | null = null;
        if (data.image) {
          try {
            imageUrl = await fileToDataUrl(data.image);
          } catch {
            imageUrl = null;
          }
        }
        const newEntry: DiaryEntry = {
          id: Date.now(),
          content: data.content ?? "",
          imageUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        diaryStore.set([...diaryStore.get(), newEntry]);
        opts?.onSuccess?.();
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const updateEntry = useCallback(
    ({ id, data }: { id: number; data: { content?: string } }, opts?: { onSuccess?: () => void }) => {
      diaryStore.set(
        diaryStore.get().map((e) =>
          e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e,
        ),
      );
      opts?.onSuccess?.();
    },
    [],
  );

  const deleteEntry = useCallback(({ id }: { id: number }) => {
    diaryStore.set(diaryStore.get().filter((e) => e.id !== id));
  }, []);

  return {
    entries,
    isLoading: false,
    createEntry,
    isCreating,
    updateEntry,
    isUpdating: false,
    deleteEntry,
    isDeleting: false,
  };
}
