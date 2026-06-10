import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { BucketListItem } from "@/lib/types";

function mapRow(row: Record<string, unknown>): BucketListItem {
  return {
    id: row.id as number,
    text: (row.text as string) ?? "",
    completed: (row.completed as boolean) ?? false,
    createdAt: (row.created_at as string) ?? "",
  };
}

export function useBucketList() {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.from("bucket_list").select("*").order("created_at", { ascending: true });
      if (mounted) { setItems((data ?? []).map(mapRow)); setIsLoading(false); }
    };
    load();

    const channel = supabase
      .channel("bucket_list_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bucket_list" }, async () => {
        const { data } = await supabase.from("bucket_list").select("*").order("created_at", { ascending: true });
        if (mounted) setItems((data ?? []).map(mapRow));
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  const createItem = useCallback(async (
    { data }: { data: { text: string } },
    opts?: { onSuccess?: () => void },
  ) => {
    setIsCreating(true);
    try {
      const { error } = await supabase.from("bucket_list").insert({ text: data.text, completed: false });
      if (error) throw error;
      opts?.onSuccess?.();
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateItem = useCallback(async (
    { id, data }: { id: number; data: { text?: string; completed?: boolean } },
  ) => {
    await supabase.from("bucket_list").update(data).eq("id", id);
  }, []);

  const deleteItem = useCallback(async ({ id }: { id: number }) => {
    await supabase.from("bucket_list").delete().eq("id", id);
  }, []);

  return { items, isLoading, createItem, isCreating, updateItem, isUpdating: false, deleteItem, isDeleting: false };
}
