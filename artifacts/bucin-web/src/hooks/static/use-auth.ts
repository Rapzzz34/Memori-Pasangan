import { useState, useCallback } from "react";
import { OWNER_PASSWORDS } from "@/data/content";

const STORAGE_KEY = "kk_owner_auth";

function readStorage(): { isOwner: boolean; personId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isOwner: false, personId: null };
    return JSON.parse(raw);
  } catch {
    return { isOwner: false, personId: null };
  }
}

export function useAuth() {
  const [auth, setAuth] = useState(() => readStorage());
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = useCallback(
    async ({ data }: { data: { password: string } }) => {
      setIsLoggingIn(true);
      await new Promise((r) => setTimeout(r, 300));

      const { password } = data;
      let matched: { isOwner: boolean; personId: string | null } | null = null;

      if (password === OWNER_PASSWORDS.person1Password) {
        matched = { isOwner: true, personId: "person1" };
      } else if (password === OWNER_PASSWORDS.person2Password) {
        matched = { isOwner: true, personId: "person2" };
      }

      setIsLoggingIn(false);

      if (!matched) {
        throw new Error("Kode salah");
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(matched));
      setAuth(matched);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ isOwner: false, personId: null });
  }, []);

  return {
    isOwner: auth.isOwner,
    personId: auth.personId,
    login,
    logout,
    isLoading: false,
    isLoggingIn,
  };
}
