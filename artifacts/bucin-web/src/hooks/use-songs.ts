import { useQueryClient } from "@tanstack/react-query";
import {
  useListSongs,
  useCreateSong,
  useDeleteSong,
  getListSongsQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useSongs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const listQuery = useListSongs({
    query: { queryKey: getListSongsQueryKey() },
  });

  const createMutation = useCreateSong({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSongsQueryKey() });
        toast({ title: "Lagu ditambahkan" });
      },
      onError: () => toast({ title: "Gagal menambah lagu", variant: "destructive" }),
    },
  });

  const deleteMutation = useDeleteSong({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListSongsQueryKey() });
      },
      onError: () => toast({ title: "Gagal menghapus lagu", variant: "destructive" }),
    },
  });

  return {
    songs: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    createSong: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteSong: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
