import { useQueryClient } from "@tanstack/react-query";
import {
  useListDiary,
  useCreateDiaryEntry,
  useUpdateDiaryEntry,
  useDeleteDiaryEntry,
  getListDiaryQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useDiary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const listQuery = useListDiary({
    query: { queryKey: getListDiaryQueryKey() },
  });

  const createMutation = useCreateDiaryEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDiaryQueryKey() });
        toast({ title: "Entri diary disimpan" });
      },
      onError: () => toast({ title: "Gagal menyimpan diary", variant: "destructive" }),
    },
  });

  const updateMutation = useUpdateDiaryEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDiaryQueryKey() });
        toast({ title: "Diary diperbarui" });
      },
      onError: () => toast({ title: "Gagal memperbarui diary", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteDiaryEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDiaryQueryKey() });
      },
      onError: () => toast({ title: "Gagal menghapus entri", variant: "destructive" }),
    },
  });

  return {
    entries: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    createEntry: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateEntry: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteEntry: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
