import { MEMORIES } from "@/data/content";

export function useMemories() {
  return {
    memories: MEMORIES,
    isLoading: false,
    createMemory: () => {},
    isCreating: false,
    updateMemory: () => {},
    isUpdating: false,
    deleteMemory: () => {},
    isDeleting: false,
  };
}
