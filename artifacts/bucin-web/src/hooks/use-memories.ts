import { useQueryClient } from "@tanstack/react-query";
import {
  useListMemories,
  useCreateMemory,
  useUpdateMemory,
  useDeleteMemory,
  getListMemoriesQueryKey,
  getGetMemoryQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useMemories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const listQuery = useListMemories({
    query: {
      queryKey: getListMemoriesQueryKey(),
    },
  });

  const createMutation = useCreateMemory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
        toast({
          title: "Memory created",
          description: "Your new memory has been saved.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to create memory",
          description: error.error || "An error occurred.",
          variant: "destructive",
        });
      },
    },
  });

  const updateMutation = useUpdateMemory({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
        queryClient.setQueryData(getGetMemoryQueryKey(data.id), data);
        toast({
          title: "Memory updated",
          description: "Your changes have been saved.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to update memory",
          description: error.error || "An error occurred.",
          variant: "destructive",
        });
      },
    },
  });

  const deleteMutation = useDeleteMemory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
        toast({
          title: "Memory deleted",
          description: "The memory has been removed.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to delete memory",
          description: error.error || "An error occurred.",
          variant: "destructive",
        });
      },
    },
  });

  return {
    memories: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    createMemory: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateMemory: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteMemory: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
