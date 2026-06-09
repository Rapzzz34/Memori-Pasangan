import { useState, useCallback } from "react";
import { songsStore } from "@/lib/stores";
import { useStoreValue, fileToDataUrl } from "@/lib/local-store";
import type { Song } from "@/lib/types";

export function useSongs() {
  const songs = useStoreValue(songsStore);
  const [isCreating, setIsCreating] = useState(false);

  const createSong = useCallback(
    async (
      { data }: { data: { title: string; artist?: string; person?: string; audio?: File } },
      opts?: { onSuccess?: () => void },
    ) => {
      setIsCreating(true);
      try {
        let audioUrl: string | null = null;
        if (data.audio) {
          try {
            audioUrl = await fileToDataUrl(data.audio);
          } catch {
            audioUrl = null;
          }
        }
        const newSong: Song = {
          id: Date.now(),
          title: data.title,
          artist: data.artist ?? null,
          audioUrl,
          person: data.person ?? "both",
          createdAt: new Date().toISOString(),
        };
        songsStore.set([...songsStore.get(), newSong]);
        opts?.onSuccess?.();
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const deleteSong = useCallback(({ id }: { id: number }) => {
    songsStore.set(songsStore.get().filter((s) => s.id !== id));
  }, []);

  return {
    songs,
    isLoading: false,
    createSong,
    isCreating,
    deleteSong,
    isDeleting: false,
  };
}
