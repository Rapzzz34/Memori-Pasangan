export function useAuth() {
  return {
    isOwner: false,
    personId: null as string | null,
    login: () => {},
    logout: () => {},
    isLoading: false,
    isLoggingIn: false,
  };
}
