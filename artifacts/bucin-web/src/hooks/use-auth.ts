import { useQueryClient } from "@tanstack/react-query";
import {
  useGetMe,
  useLogin,
  useLogout,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: me, isLoading } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({
          title: "Welcome back",
          description: "You have successfully logged in.",
        });
      },
      onError: (error) => {
        toast({
          title: "Login failed",
          description: error.error || "Please check your password and try again.",
          variant: "destructive",
        });
      },
    },
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({
          title: "Logged out",
          description: "You have been logged out successfully.",
        });
      },
    },
  });

  return {
    isOwner: me?.isOwner ?? false,
    isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
