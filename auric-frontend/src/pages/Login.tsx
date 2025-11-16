// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../state/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setErr(`Login failed (${res.status}) ${await res.text()}`);
        return;
      }

      const data = await res.json(); // { accessToken, refreshToken, tokenType }
      localStorage.setItem("auric_jwt", data.accessToken);
      if (data.refreshToken) localStorage.setItem("auric_refresh", data.refreshToken);

      await refresh();  // 🔄 triggers /auth/me with Authorization header
      nav("/");         // go back to home
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-neutral-800 p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input className="bg-neutral-900 p-3 rounded" placeholder="Email"
               value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="bg-neutral-900 p-3 rounded" type="password" placeholder="Password"
               value={password} onChange={(e)=>setPassword(e.target.value)} />
        {err && <p className="text-red-400">{err}</p>}
        <button disabled={loading}
          className="bg-yellow-500 text-black font-semibold rounded p-3 disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
