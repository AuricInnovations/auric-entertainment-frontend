// src/pages/MyBookings.tsx
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useAuth } from "../state/AuthContext";

type Booking = {
  id: number;
  eventId: number;
  fullName: string;
  email: string;
  phone: string;
  tickets: number;
};

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth();

  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery<Booking[]>({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      // adjust the path if your endpoint is different
      const res = await apiFetch("/bookings/me");
      if (!res.ok) throw new Error("Failed to load bookings");
      return res.json();
    },
    enabled: !!user && !authLoading,
  });

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-200">
        Checking session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-200">
        <h1 className="text-2xl font-semibold mb-3">My bookings</h1>
        <p className="text-sm text-zinc-400">
          You need to be logged in to view your bookings.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-200">
        <h1 className="text-2xl font-semibold mb-4">My bookings</h1>
        <p className="text-sm text-zinc-400">Loading your bookings…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-200">
        <h1 className="text-2xl font-semibold mb-4">My bookings</h1>
        <p className="text-sm text-red-300">
          Could not load your bookings. Please try again later.
        </p>
      </div>
    );
  }

  const list = bookings ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-100">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/80 mb-1">
            Account
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My bookings
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Overview of shows you’ve reserved tickets for.
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-400">
          You don’t have any bookings yet. Browse the{" "}
          <a
            href="/"
            className="text-yellow-300 hover:text-yellow-200 underline"
          >
            events
          </a>{" "}
          and reserve your first seats.
        </p>
      ) : (
        <div className="space-y-4 mt-4">
          {list.map((b) => (
            <article
              key={b.id}
              className="rounded-2xl border border-yellow-500/30 bg-black/70 px-4 py-4 shadow-[0_0_35px_rgba(0,0,0,0.85)] flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-yellow-200">
                  Event #{b.eventId}
                </p>
                <p className="text-xs text-zinc-300">
                  Name: {b.fullName}
                </p>
                <p className="text-xs text-zinc-400">
                  {b.email} · {b.phone}
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2 text-xs text-zinc-300">
                <span className="rounded-full border border-yellow-500/40 px-3 py-1">
                  {b.tickets} ticket{b.tickets > 1 ? "s" : ""}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
