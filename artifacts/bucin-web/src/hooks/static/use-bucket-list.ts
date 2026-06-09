import { useState, useCallback } from "react";
import { bucketStore } from "@/lib/stores";
import { useStoreValue } from "@/lib/local-store";
import type { BucketListItem } from "@/lib/types";

export function useBucketList() {
  const items = useStoreValue(bucketStore);
  const [isCreating, setIsCreating] = useState(false);

  const createItem = useCallback(
    ({ data }: { data: { text: string } }, opts?: { onSuccess?: () => void }) => {
      setIsCreating(true);
      const newItem: BucketListItem = {
        id: Date.now(),
        text: data.text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      bucketStore.set([...bucketStore.get(), newItem]);
      setIsCreating(false);
      opts?.onSuccess?.();
    },
    [],
  );

  const updateItem = useCallback(
    ({ id, data }: { id: number; data: { text?: string; completed?: boolean } }) => {
      bucketStore.set(
        bucketStore.get().map((item) => (item.id === id ? { ...item, ...data } : item)),
      );
    },
    [],
  );

  const deleteItem = useCallback(({ id }: { id: number }) => {
    bucketStore.set(bucketStore.get().filter((item) => item.id !== id));
  }, []);

  return {
    items,
    isLoading: false,
    createItem,
    isCreating,
    updateItem,
    isUpdating: false,
    deleteItem,
    isDeleting: false,
  };
}
