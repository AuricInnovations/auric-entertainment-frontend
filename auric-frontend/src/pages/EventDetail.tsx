// src/pages/EventDetail.tsx
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  apiFetch,
  ApiError,
  publicGetTicketTypes,
  TicketTypeResponse,
  getEventAvailability,
  TicketAvailabilityResponse,
} from "../lib/api";
import { useAuth } from "../state/AuthContext";
import { useState, useMemo } from "react";
import { WhatsAppService } from "../lib/WhatsAppService";

type EventDetailType = {
  id: number;
  title: string;
  description?: string;
  venue?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  price?: number | null;
};

function formatDateTime(start?: string, end?: string) {
  if (!start) return "";
  try {
    const s = new Date(start);
    const e = end ? new Date(end) : undefined;

    const date = s.toLocaleDateString("en-MY", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = s.toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let res = `${date} · ${time}`;
    if (e) {
      const endTime = e.toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
      });
      res += ` – ${endTime}`;
    }
    return res;
  } catch {
    return "";
  }
}

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  // ===== Event itself =====
  const {
    data: event,
    isLoading: eventLoading,
    isError: eventIsError,
    error: eventError,
  } = useQuery<EventDetailType, ApiError>({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await apiFetch(`/events/${id}`);
      return res.json();
    },
    enabled: !!id,
  });

  // ===== Ticket categories for this event =====

  const {
    data: ticketTypes,
    isLoading: ticketsLoading,
    isError: ticketsIsError,
    error: ticketsError,
  } = useQuery<TicketTypeResponse[], ApiError>({
    queryKey: ["event", id, "ticket-types"],
    queryFn: async () => {
      if (!id) throw new ApiError(400, "Missing event id");
      return publicGetTicketTypes(Number(id));
    },
    enabled: !!id,
  });
  const [lastBooking, setLastBooking] = useState<any | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    tickets: 1,
    ticketTypeId: 0,
  });

  // Pick default ticket type once data arrives
  const effectiveTicketTypeId = useMemo(() => {
    if (form.ticketTypeId) return form.ticketTypeId;
    const first = ticketTypes?.[0];
    return first ? first.id : 0;
  }, [form.ticketTypeId, ticketTypes]);

  const selectedTicketType = useMemo(
    () => ticketTypes?.find((t) => t.id === effectiveTicketTypeId),
    [ticketTypes, effectiveTicketTypeId]
  );

  // ===== Booking mutation =====
  const createBooking = useMutation<any, ApiError>({
    mutationFn: async () => {
      if (!id) throw new ApiError(400, "Missing event id");
      if (!effectiveTicketTypeId)
        throw new ApiError(400, "Please select a ticket category");

      const res = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          eventId: Number(id),
          ticketTypeId: effectiveTicketTypeId,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          tickets: form.tickets,
        }),
      });

      return res.json();
    },
  });

  const loading = eventLoading || ticketsLoading;
  const dateLabel = formatDateTime(event?.startTime, event?.endTime);
  const disabled = !user || createBooking.isPending || !ticketTypes?.length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-zinc-200">
        Loading event…
      </div>
    );
  }

  if (eventIsError || !event) {
    const err = eventError as ApiError | undefined;
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-red-300">
        <p className="font-semibold mb-1">Event not found.</p>
        {err && (
          <p className="text-xs text-red-400">
            ({err.status}) {err.message}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-100">
      {/* Back link */}
      <button
        className="mb-6 text-xs text-yellow-300 hover:text-yellow-200"
        onClick={() => window.history.back()}
      >
        ← Back to events
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1.1fr] items-start">
        {/* LEFT: event info */}
        <div className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/80 mb-2">
              Auric event
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-yellow-300">
              {event.title}
            </h1>
          </div>

          {dateLabel && (
            <p className="text-sm text-zinc-300 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-yellow-500/40 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-yellow-100">
                {dateLabel}
              </span>
            </p>
          )}

          {event.venue && (
            <p className="text-sm text-zinc-300">
              Venue: <span className="text-zinc-100">{event.venue}</span>
            </p>
          )}

          <div className="h-px w-full bg-gradient-to-r from-yellow-500/60 via-yellow-500/10 to-transparent my-2" />

          {event.description && (
            <p className="text-sm leading-relaxed text-zinc-200">
              {event.description}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-3 text-xs text-zinc-300">
            <div className="rounded-2xl border border-yellow-500/30 bg-black/70 px-4 py-3">
              <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                From
              </p>
              <p className="text-lg font-semibold text-yellow-300">
                {selectedTicketType
                  ? `RM ${selectedTicketType.price.toFixed(2)}`
                  : event.price != null
                    ? `RM ${event.price.toFixed(2)}`
                    : "TBA"}
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/60 px-4 py-3">
              <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                Capacity
              </p>
              <p className="text-lg font-semibold text-yellow-300">
                {event.capacity ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/60 px-4 py-3">
              <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                Booking
              </p>
              <p className="text-sm text-zinc-200">
                {user
                  ? "Signed in — you can book now."
                  : "Login required before booking."}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: booking card */}
        <div className="rounded-2xl border border-yellow-500/35 bg-black/75 p-5 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <h3 className="text-lg font-semibold mb-1">Book tickets</h3>
          <p className="text-[11px] text-zinc-400 mb-4">
            Choose a ticket category and reserve seats for this event.
          </p>

          {!user && (
            <p className="mb-3 text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/40 rounded-lg px-3 py-2">
              You must be logged in to complete a booking.
            </p>
          )}

          {ticketsIsError && (
            <p className="mb-3 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              Failed to load ticket categories.{" "}
              {ticketsError && (
                <span>
                  ({ticketsError.status}) {ticketsError.message}
                </span>
              )}
            </p>
          )}

          {/* Ticket category selector */}
          <div className="mb-3">
            <label className="block text-xs text-zinc-300 mb-1">
              Ticket category
            </label>
            <select
              className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
              value={effectiveTicketTypeId || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  ticketTypeId: Number(e.target.value) || 0,
                })
              }
              disabled={!ticketTypes || ticketTypes.length === 0}
            >
              {!ticketTypes?.length && (
                <option value="">No categories configured</option>
              )}
              {ticketTypes?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — RM {t.price.toFixed(2)}
                </option>
              ))}
            </select>
            {selectedTicketType?.description && (
              <p className="mt-1 text-[11px] text-zinc-400">
                {selectedTicketType.description}
              </p>
            )}
          </div>

          <div className="grid gap-3 text-sm">
            <div>
              <label className="block text-xs text-zinc-300 mb-1">
                Full name
              </label>
              <input
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                placeholder="Your name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-300 mb-1">
                Email
              </label>
              <input
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-300 mb-1">
                Phone / WhatsApp
              </label>
              <input
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                placeholder="+60 ..."
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-300 mb-1">
                Tickets
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                value={form.tickets}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tickets: Math.max(1, Number(e.target.value) || 1),
                  })
                }
              />
            </div>

            <button
              disabled={disabled}
              onClick={() => createBooking.mutate()}
              className="mt-2 bg-yellow-400 text-black font-semibold rounded-full py-2.5 text-sm disabled:opacity-60"
            >
              {createBooking.isPending
                ? "Booking..."
                : user
                  ? "Confirm booking"
                  : "Login to book"}
            </button>

            {createBooking.isSuccess && (
              <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
                Booking created successfully.
              </p>
            )}
            {createBooking.isError && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
                {createBooking.error?.message ||
                  "Failed to book. Please try again."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
