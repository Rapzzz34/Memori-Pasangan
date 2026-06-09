import { BUCKET_LIST } from "@/data/content";

export function useBucketList() {
  return {
    items: BUCKET_LIST,
    isLoading: false,
    createItem: () => {},
    isCreating: false,
    updateItem: () => {},
    isUpdating: false,
    deleteItem: () => {},
    isDeleting: false,
  };
}
