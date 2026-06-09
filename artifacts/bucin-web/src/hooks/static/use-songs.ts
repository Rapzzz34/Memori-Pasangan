import { SONGS } from "@/data/content";

export function useSongs() {
  return {
    songs: SONGS,
    isLoading: false,
    createSong: () => {},
    isCreating: false,
    deleteSong: () => {},
    isDeleting: false,
  };
}
