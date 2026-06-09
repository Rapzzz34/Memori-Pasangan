import { DIARY_ENTRIES } from "@/data/content";

export function useDiary() {
  return {
    entries: DIARY_ENTRIES,
    isLoading: false,
    createEntry: () => {},
    isCreating: false,
    updateEntry: () => {},
    isUpdating: false,
    deleteEntry: () => {},
    isDeleting: false,
  };
}
