import { useState, useCallback, useEffect } from "react";
import { authStore, passwordsStore } from "@/lib/stores";

export function useAuth() {
  const [, setTick] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => authStore.subscribe(() => setTick((t) => t + 1)), []);

  const login = useCallback(
    async ({ data }: { data: { password: string } }) => {
      setIsLoggingIn(true);
      await new Promise((r) => setTimeout(r, 250));

      const passwords = passwordsStore.get();
      const { password } = data;
      let personId: number | null = null;

      if (password === passwords.p1) personId = 1;
      else if (password === passwords.p2) personId = 2;

      setIsLoggingIn(false);

      if (personId === null) throw new Error("Kode salah");

      authStore.set({ isOwner: true, personId });
    },
    [],
  );

  const logout = useCallback(() => {
    authStore.set({ isOwner: false, personId: null });
  }, []);

  const auth = authStore.get();
  return {
    isOwner: auth.isOwner,
    personId: auth.personId,
    login,
    logout,
    isLoading: false,
    isLoggingIn,
  };
}
