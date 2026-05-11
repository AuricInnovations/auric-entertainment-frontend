// src/state/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../lib/api";

type User = { id: string; name: string; email: string; authorities?: string[] } | null;
type AuthCtx = {
  user: User;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch("/auth/me");
      if (res.ok) setUser(await res.json());
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function logout() {
    // For JWT stateless logout, just remove tokens locally
    localStorage.removeItem("auric_jwt");
    localStorage.removeItem("auric_refresh");
    await refresh(); // set user=null
  }

  return (
    <Ctx.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
