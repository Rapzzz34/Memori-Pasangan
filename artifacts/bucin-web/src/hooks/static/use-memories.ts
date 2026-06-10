import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Memory {
  return {
    id: row.id as number,
    title: (row.title as string) ?? "",
    caption: (row.caption as string | null) ?? null,
    imageUrl: (row.image_url as string) ?? "",
    memoryDate: (row.memory_date as string | null) ?? null,
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
  };
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
      if (mounted) { setMemories((data ?? []).map(mapRow)); setIsLoading(false); }
    };
    load();

    const channel = supabase
      .channel("memories_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "memories" }, async () => {
        const { data } = await supabase.from("memories").select("*").order("created_at", { ascending: false });
        if (mounted) setMemories((data ?? []).map(mapRow));
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  const createMemory = useCallback(async (
    { data }: { data: { title: string; caption?: string; memoryDate?: string; photo: File } },
    opts?: { onSuccess?: () => void },
  ) => {
    setIsCreating(true);
    try {
      const ext = data.photo.name.split(".").pop();
      const path = `memories/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, data.photo);
      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);

      const { error } = await supabase.from("memories").insert({
        title: data.title,
        caption: data.caption ?? null,
        image_url: publicUrl,
        memory_date: data.memoryDate ?? null,
      });
      if (error) throw error;
      opts?.onSuccess?.();
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateMemory = useCallback(async (
    { id, data }: { id: number; data: { title?: string; caption?: string; memoryDate?: string | null } },
    opts?: { onSuccess?: () => void },
  ) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.from("memories").update({
        title: data.title,
        caption: data.caption ?? null,
        memory_date: data.memoryDate ?? null,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      if (error) throw error;
      opts?.onSuccess?.();
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteMemory = useCallback(async ({ id }: { id: number }) => {
    setIsDeleting(true);
    try {
      await supabase.from("memories").delete().eq("id", id);
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { memories, isLoading, createMemory, isCreating, updateMemory, isUpdating, deleteMemory, isDeleting };
}
