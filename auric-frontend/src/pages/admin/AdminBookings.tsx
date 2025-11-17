// src/pages/admin/AdminBookings.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";

type BookingAdmin = {
  id: number;
  eventId: number;
  fullName: string;
  email: string;
  phone: string;
  tickets: number;
};
type BookingPage = {
  content: BookingAdmin[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;
};

export default function AdminBookings() {
  const [eventFilter, setEventFilter] = useState<string>("");

  const { data, isLoading, isError } = useQuery<BookingPage>({
  queryKey: ["admin-bookings", eventFilter],
  queryFn: async () => {
    const params = new URLSearchParams();
    params.set("page", "0");   // first page for now
    params.set("size", "200"); // grab up to 200 bookings

    if (eventFilter && Number(eventFilter)) {
      params.set("eventId", String(Number(eventFilter))); // backend doesn't use this yet, see step 2
    }

    const res = await apiFetch(`/admin/bookings?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to load bookings");
    const json = await res.json();
    return json;
  },
});

 const bookings: BookingAdmin[] = Array.isArray(data?.content)
  ? data!.content
  : [];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-yellow-200">
            Bookings
          </h1>
          <p className="text-xs text-zinc-400">
            View reservations for your events.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Filter by Event ID:</span>
          <input
            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-28 text-xs text-zinc-100"
            placeholder="e.g. 5"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          />
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/60">
        <table className="min-w-full text-xs">
          <thead className="bg-zinc-950/80 text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Event ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Tickets</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-zinc-400">
                  Loading bookings…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-red-400">
                  Failed to load bookings.
                </td>
              </tr>
            )}
            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-zinc-400">
                  No bookings found.
                </td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-zinc-400">{b.id}</td>
                <td className="px-3 py-2 text-zinc-300">{b.eventId}</td>
                <td className="px-3 py-2">{b.fullName}</td>
                <td className="px-3 py-2 text-zinc-300">{b.email}</td>
                <td className="px-3 py-2 text-zinc-300">{b.phone}</td>
                <td className="px-3 py-2 text-yellow-300 font-semibold">
                  {b.tickets}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
