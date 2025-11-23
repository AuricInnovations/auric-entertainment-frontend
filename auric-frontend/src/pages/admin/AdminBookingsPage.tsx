// src/pages/AdminBookingsPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListBookings,
  adminConfirmBooking,
  BookingResponse,
  ApiError,
} from "../../lib/api";
import { useState } from "react";

export default function AdminBookingsPage() {
  const qc = useQueryClient();
  const [eventFilter, setEventFilter] = useState<number | undefined>(undefined);

  const { data, isLoading, isError, error } = useQuery<
    { content: BookingResponse[]; totalElements: number; number: number },
    ApiError
  >({
    queryKey: ["admin-bookings", eventFilter],
    queryFn: () => adminListBookings({ eventId: eventFilter }),
  });

  const confirmMutation = useMutation<BookingResponse, ApiError, number>({
    mutationFn: (id) => adminConfirmBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-zinc-100">
      <h1 className="text-2xl font-semibold mb-4">Bookings</h1>

      <div className="mb-4 flex gap-3 items-center text-sm">
        <label className="text-zinc-300">
          Filter by event ID:
          <input
            type="number"
            className="ml-2 bg-neutral-900 border border-neutral-700 rounded px-2 py-1"
            value={eventFilter ?? ""}
            onChange={(e) =>
              setEventFilter(
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </label>
      </div>

      {isLoading && <p>Loading bookings...</p>}

      {isError && (
        <p className="text-red-400 text-sm">
          Failed to load bookings: {error.message}
        </p>
      )}

      {data && (
        <div className="overflow-x-auto border border-neutral-800 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/80">
              <tr className="text-left text-zinc-300">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Ticket</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((b) => (
                <tr key={b.id} className="border-t border-neutral-800">
                  <td className="px-3 py-2">{b.id}</td>
                  <td className="px-3 py-2">
                    {b.eventTitle} (#{b.eventId})
                  </td>
                  <td className="px-3 py-2">
                    {b.ticketTypeName ?? "-"}{" "}
                    {b.ticketTypeId ? `(#${b.ticketTypeId})` : ""}
                  </td>
                  <td className="px-3 py-2">{b.fullName}</td>
                  <td className="px-3 py-2">{b.email}</td>
                  <td className="px-3 py-2">{b.tickets}</td>
                  <td className="px-3 py-2">{b.status}</td>
                  <td className="px-3 py-2">
                    {b.status === "PENDING_PAYMENT" ? (
                      <button
                        className="px-3 py-1 rounded-full text-xs bg-emerald-500 text-black disabled:opacity-50"
                        disabled={confirmMutation.isPending}
                        onClick={() => confirmMutation.mutate(b.id)}
                      >
                        {confirmMutation.isPending ? "Confirming..." : "Confirm"}
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmMutation.isError && (
        <p className="mt-3 text-xs text-red-400">
          Confirm failed: {confirmMutation.error?.message}
        </p>
      )}
    </div>
  );
}
