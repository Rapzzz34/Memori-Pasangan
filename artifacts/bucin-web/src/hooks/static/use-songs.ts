import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Song } from "@/lib/types";

function mapRow(row: Record<string, unknown>): Song {
  return {
    id: row.id as number,
    title: (row.title as string) ?? "",
    artist: (row.artist as string | null) ?? null,
    audioUrl: (row.audio_url as string | null) ?? null,
    person: (row.person as string) ?? "both",
    createdAt: (row.created_at as string) ?? "",
  };
}

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.from("songs").select("*").order("created_at", { ascending: true });
      if (mounted) { setSongs((data ?? []).map(mapRow)); setIsLoading(false); }
    };
    load();

    const channel = supabase
      .channel("songs_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "songs" }, async () => {
        const { data } = await supabase.from("songs").select("*").order("created_at", { ascending: true });
        if (mounted) setSongs((data ?? []).map(mapRow));
      })
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(channel); };
  }, []);

  const createSong = useCallback(async (
    { data }: { data: { title: string; artist?: string; person?: string; audio?: File } },
    opts?: { onSuccess?: () => void },
  ) => {
    setIsCreating(true);
    try {
      let audioUrl: string | null = null;
      if (data.audio) {
        const ext = data.audio.name.split(".").pop();
        const path = `audio/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, data.audio);
        if (!upErr) {
          audioUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
        }
      }

      const { error } = await supabase.from("songs").insert({
        title: data.title,
        artist: data.artist || null,
        audio_url: audioUrl,
        person: data.person ?? "both",
      });
      if (error) throw error;
      opts?.onSuccess?.();
    } finally {
      setIsCreating(false);
    }
  }, []);

  const deleteSong = useCallback(async ({ id }: { id: number }) => {
    await supabase.from("songs").delete().eq("id", id);
  }, []);

  return { songs, isLoading, createSong, isCreating, deleteSong, isDeleting: false };
}
