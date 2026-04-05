import { useQueryClient } from "@tanstack/react-query";
import {
  useListBucketList,
  useCreateBucketListItem,
  useUpdateBucketListItem,
  useDeleteBucketListItem,
  getListBucketListQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useBucketList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const listQuery = useListBucketList({
    query: { queryKey: getListBucketListQueryKey() },
  });

  const createMutation = useCreateBucketListItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBucketListQueryKey() });
      },
      onError: () => toast({ title: "Gagal menambah impian", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateBucketListItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBucketListQueryKey() });
      },
      onError: () => toast({ title: "Gagal mengubah impian", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteBucketListItem({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBucketListQueryKey() });
      },
      onError: () => toast({ title: "Gagal menghapus impian", variant: "destructive" }),
    },
  });

  return {
    items: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    createItem: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateItem: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
