// src/pages/admin/AdminBookings.tsx
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ApiError,
  BookingResponse,
  adminListBookings,
  adminConfirmBooking,
} from "../../lib/api";

type BookingPage = {
  content: BookingResponse[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (0-based)
  size: number;
};

export default function AdminBookings() {
  const qc = useQueryClient();

  const [eventFilter, setEventFilter] = useState<string>("");
  const [page, setPage] = useState(0);

  const eventIdNumber =
    eventFilter.trim().length > 0 ? Number(eventFilter) || undefined : undefined;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<BookingPage, ApiError>({
    queryKey: ["admin-bookings", { page, eventId: eventIdNumber }],
    queryFn: () =>
      adminListBookings({
        eventId: eventIdNumber,
        page,
        size: 50,
      }),
  });

  const confirmMutation = useMutation<BookingResponse, ApiError, number>({
    mutationFn: (id: number) => adminConfirmBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  const bookings: BookingResponse[] = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-yellow-200">
            Bookings
          </h1>
          <p className="text-xs text-zinc-400">
            View and confirm reservations for your events.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Filter by Event ID:</span>
          <input
            className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 w-28 text-xs text-zinc-100"
            placeholder="e.g. 5"
            value={eventFilter}
            onChange={(e) => {
              setEventFilter(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </header>

      {isLoading && (
        <p className="text-xs text-zinc-400">Loading bookings…</p>
      )}
      {isError && (
        <p className="text-xs text-red-400">
          Failed to load bookings.{" "}
          {error && (
            <span>
              ({error.status}) {error.message}
            </span>
          )}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/60">
        <table className="min-w-full text-xs">
          <thead className="bg-zinc-950/80 text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Event</th>
              <th className="px-3 py-2 text-left">Ticket type</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-right">Tickets</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-zinc-400">
                  No bookings found.
                </td>
              </tr>
            )}

            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-zinc-400">{b.id}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-zinc-100 font-medium">
                      {b.eventTitle}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      ID: {b.eventId}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  {b.ticketTypeName ?? (
                    <span className="text-zinc-500">—</span>
                  )}
                </td>
                <td className="px-3 py-2">{b.fullName}</td>
                <td className="px-3 py-2 text-zinc-300">{b.email}</td>
                <td className="px-3 py-2 text-zinc-300">{b.phone}</td>
                <td className="px-3 py-2 text-right text-yellow-300 font-semibold">
                  {b.tickets}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] " +
                      (b.status === "CONFIRMED"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                        : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40")
                    }
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  {b.status !== "CONFIRMED" && (
                    <button
                      className="text-[11px] px-3 py-1 rounded-full bg-emerald-500 text-black font-semibold disabled:opacity-60"
                      disabled={confirmMutation.isPending}
                      onClick={() => confirmMutation.mutate(b.id)}
                    >
                      {confirmMutation.isPending ? "Confirming…" : "Confirm"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 text-xs text-zinc-300">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1 rounded-full border border-neutral-700 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() =>
              setPage((p) =>
                totalPages ? Math.min(totalPages - 1, p + 1) : p + 1
              )
            }
            className="px-3 py-1 rounded-full border border-neutral-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}