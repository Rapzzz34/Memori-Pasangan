import { useState, useCallback } from "react";
import { memoriesStore } from "@/lib/stores";
import { useStoreValue, fileToDataUrl } from "@/lib/local-store";
import type { Memory } from "@/lib/types";

export function useMemories() {
  const memories = useStoreValue(memoriesStore);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createMemory = useCallback(
    async (
      { data }: { data: { title: string; caption?: string; memoryDate?: string; photo: File } },
      opts?: { onSuccess?: () => void },
    ) => {
      setIsCreating(true);
      try {
        const imageUrl = await fileToDataUrl(data.photo);
        const newMemory: Memory = {
          id: Date.now(),
          title: data.title,
          caption: data.caption ?? null,
          imageUrl,
          memoryDate: data.memoryDate ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoriesStore.set([...memoriesStore.get(), newMemory]);
        opts?.onSuccess?.();
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const updateMemory = useCallback(
    (
      { id, data }: { id: number; data: { title?: string; caption?: string; memoryDate?: string | null } },
      opts?: { onSuccess?: () => void },
    ) => {
      setIsUpdating(true);
      memoriesStore.set(
        memoriesStore.get().map((m) =>
          m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m,
        ),
      );
      setIsUpdating(false);
      opts?.onSuccess?.();
    },
    [],
  );

  const deleteMemory = useCallback(({ id }: { id: number }) => {
    setIsDeleting(true);
    memoriesStore.set(memoriesStore.get().filter((m) => m.id !== id));
    setIsDeleting(false);
  }, []);

  return {
    memories,
    isLoading: false,
    createMemory,
    isCreating,
    updateMemory,
    isUpdating,
    deleteMemory,
    isDeleting,
  };
}
