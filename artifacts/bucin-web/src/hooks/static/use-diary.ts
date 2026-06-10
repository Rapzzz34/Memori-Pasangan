import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { DiaryEntry } from "@/lib/types";

function mapRow(row: Record<string, unknown>): DiaryEntry {
  return {
    id: row.id as number,
    content: (row.content as string) ?? "",
    imageUrl: (row.image_url as string | null) ?? null,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.from("diary_entries").select("*").order("created_at", { ascending: false });
      if (mounted) { setEntries((data ?? []).map(mapRow)); setIsLoading(false); }
    };
    load();

    const channel = supabase
      .channel("diary_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "diary_entries" }, async () => {
        const { data } = await supabase.from("diary_entries").select("*").order("created_at", { ascending: false });
        if (mounted) setEntries((data ?? []).map(mapRow));
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  const createEntry = useCallback(async (
    { data }: { data: { content?: string; image?: File } },
    opts?: { onSuccess?: () => void },
  ) => {
    setIsCreating(true);
    try {
      let imageUrl: string | null = null;
      if (data.image) {
        const ext = data.image.name.split(".").pop();
        const path = `diary/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, data.image);
        if (!upErr) {
          imageUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
        }
      }

      const { error } = await supabase.from("diary_entries").insert({
        content: data.content ?? "",
        image_url: imageUrl,
      });
      if (error) throw error;
      opts?.onSuccess?.();
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateEntry = useCallback(async (
    { id, data }: { id: number; data: { content?: string } },
    opts?: { onSuccess?: () => void },
  ) => {
    await supabase.from("diary_entries").update({
      ...data,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    opts?.onSuccess?.();
  }, []);

  const deleteEntry = useCallback(async ({ id }: { id: number }) => {
    await supabase.from("diary_entries").delete().eq("id", id);
  }, []);

  return { entries, isLoading, createEntry, isCreating, updateEntry, isUpdating: false, deleteEntry, isDeleting: false };
}
