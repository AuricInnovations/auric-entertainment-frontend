import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useAuth } from "../state/AuthContext";

export default function Register() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        setErr(`Registration failed (${res.status}) ${await res.text()}`);
        return;
      }

      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("auric_jwt", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("auric_refresh", data.refreshToken);
      }

      await refresh();
      nav("/");
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-neutral-900 p-6 rounded-2xl shadow-lg border border-zinc-800">
      <h1 className="text-2xl font-bold mb-1 text-yellow-200">Create account</h1>
      <p className="text-xs text-zinc-400 mb-4">
        One account to book shows and manage your bookings.
      </p>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input
          className="bg-neutral-950 p-3 rounded border border-zinc-700 text-sm"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="bg-neutral-950 p-3 rounded border border-zinc-700 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-neutral-950 p-3 rounded border border-zinc-700 text-sm"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <button
          disabled={loading}
          className="bg-yellow-400 text-black font-semibold rounded p-3 disabled:opacity-60 text-sm"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-xs text-zinc-400">
        Already have an account?{" "}
        <a href="/login" className="text-yellow-300 hover:text-yellow-200">
          Login
        </a>
      </p>
    </div>
  );
}
