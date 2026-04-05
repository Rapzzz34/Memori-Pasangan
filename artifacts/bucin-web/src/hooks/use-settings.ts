import { useQueryClient } from "@tanstack/react-query";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useGetSettings({
    query: {
      queryKey: getGetSettingsQueryKey(),
    },
  });

  const updateMutation = useUpdateSettings({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetSettingsQueryKey(), data);
        toast({
          title: "Settings updated",
          description: "Your site settings have been saved.",
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to update settings",
          description: error.error || "An error occurred.",
          variant: "destructive",
        });
      },
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
