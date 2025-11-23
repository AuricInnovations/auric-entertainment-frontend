// src/pages/admin/AdminEventTickets.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminGetTicketTypes,
  adminCreateTicketType,
  adminUpdateTicketType,
  adminDeleteTicketType,
  type TicketTypeResponse,
  type UpsertTicketTypeRequest,
  apiFetch,
} from "../../lib/api";

type AdminEventSummary = {
  id: number;
  title: string;
  venue?: string;
};

export default function AdminEventTickets() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const idNum = Number(eventId);

  // Get event header
  const { data: event } = useQuery<AdminEventSummary>({
    queryKey: ["admin-event", idNum],
    queryFn: async () => {
      const res = await apiFetch(`/admin/events/${idNum}`);
      if (!res.ok) throw new Error("Failed to load event");
      return res.json();
    },
    enabled: Number.isFinite(idNum),
  });

  // Get ticket types
  const {
    data: ticketTypes,
    isLoading,
    isError,
  } = useQuery<TicketTypeResponse[]>({
    queryKey: ["admin-ticket-types", idNum],
    queryFn: () => adminGetTicketTypes(idNum),
    enabled: Number.isFinite(idNum),
  });

  const [editing, setEditing] = useState<TicketTypeResponse | null>(null);
  const [form, setForm] = useState<UpsertTicketTypeRequest>({
    name: "",
    description: "",
    price: 0,
    capacity: 0,
    unitSize: 1,
    sortOrder: 0,
    isActive: true,
  });

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: 0,
      capacity: 0,
      unitSize: 1,
      sortOrder: (ticketTypes?.length ?? 0) + 1,
      isActive: true,
    });
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: UpsertTicketTypeRequest) => {
      if (editing) {
        return adminUpdateTicketType(idNum, editing.id, payload);
      }
      return adminCreateTicketType(idNum, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ticket-types", idNum] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (ttId: number) => adminDeleteTicketType(idNum, ttId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-ticket-types", idNum] });
    },
  });

  function startEdit(tt: TicketTypeResponse) {
    setEditing(tt);
    setForm({
      name: tt.name,
      description: tt.description ?? "",
      price: tt.price,
      capacity: tt.capacity,
      unitSize: tt.unitSize ?? 1,
      sortOrder: tt.sortOrder ?? 0,
      isActive: tt.isActive ?? true,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.capacity <= 0) return;
    if (form.price < 0) return;
    saveMutation.mutate(form);
  }

  return (
    <div className="px-6 py-6 text-zinc-100">
      <button
        onClick={() => navigate("/admin/events")}
        className="mb-3 text-xs text-yellow-300 hover:text-yellow-200"
      >
        ← Back to events
      </button>

      <h1 className="text-2xl font-semibold text-yellow-300 mb-1">
        Ticket categories
      </h1>
      {event && (
        <p className="text-sm text-zinc-300 mb-5">
          Event: <span className="font-medium">{event.title}</span>
          {event.venue && <> · {event.venue}</>}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
        {/* List */}
        <div>
          <h2 className="text-sm font-semibold mb-2 text-zinc-200">
            Existing categories
          </h2>
          <div className="rounded-2xl border border-zinc-800 bg-black/70 overflow-hidden">
            {isLoading && (
              <div className="px-4 py-4 text-sm text-zinc-400">
                Loading ticket types…
              </div>
            )}
            {isError && (
              <div className="px-4 py-4 text-sm text-red-400">
                Failed to load ticket types.
              </div>
            )}
            {!isLoading && !isError && (
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-right">Price (RM)</th>
                    <th className="px-4 py-2 text-right">Capacity</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {ticketTypes && ticketTypes.length > 0 ? (
                    ticketTypes.map((tt) => (
                      <tr
                        key={tt.id}
                        className="border-t border-zinc-800 hover:bg-zinc-900/70"
                      >
                        <td className="px-4 py-2 align-top">
                          <div className="font-medium text-zinc-100">
                            {tt.name}
                          </div>
                          {tt.description && (
                            <div className="text-xs text-zinc-400 mt-1">
                              {tt.description}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right text-yellow-300 align-top">
                          {tt.price.toLocaleString("en-MY", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-2 text-right text-zinc-100 align-top">
                          {tt.capacity}
                          {tt.unitSize && tt.unitSize > 1 && (
                            <span className="text-[11px] text-zinc-400 ml-1">
                              (x{tt.unitSize})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center align-top">
                          {tt.isActive ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-zinc-800 text-zinc-400 border border-zinc-700">
                              Hidden
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right align-top space-x-2">
                          <button
                            onClick={() => startEdit(tt)}
                            className="text-xs px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete category "${tt.name}"? Existing bookings stay in DB.`
                                )
                              ) {
                                deleteMutation.mutate(tt.id);
                              }
                            }}
                            className="text-xs px-3 py-1 rounded-full bg-red-900/60 hover:bg-red-800 text-red-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-4 text-center text-sm text-zinc-400"
                      >
                        No ticket categories yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-black/80 p-4 space-y-3 text-sm"
        >
          <h2 className="text-sm font-semibold text-zinc-100 mb-1">
            {editing ? "Edit category" : "Add category"}
          </h2>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Name</label>
            <input
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VIP Boxes, Premium Balcony..."
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Description (optional)
            </label>
            <textarea
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400 min-h-[60px]"
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Price (RM)
              </label>
              <input
                type="number"
                min={0}
                step="1"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Capacity (seats)
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                value={form.capacity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, capacity: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Unit size
              </label>
              <input
                type="number"
                min={1}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                value={form.unitSize ?? 1}
                onChange={(e) =>
                  setForm((f) => ({ ...f, unitSize: Number(e.target.value) }))
                }
              />
              <p className="mt-1 text-[11px] text-zinc-500">
                For VIP Boxes: total capacity 80, unitSize 10 (price per box).
              </p>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Sort order
              </label>
              <input
                type="number"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-yellow-400"
                value={form.sortOrder ?? 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={form.isActive ?? true}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
              className="rounded border-zinc-700 bg-zinc-950"
            />
            Visible for booking
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 bg-yellow-400 text-black font-semibold rounded-full py-2 text-sm disabled:opacity-60"
            >
              {saveMutation.isPending
                ? "Saving..."
                : editing
                ? "Save changes"
                : "Add category"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-2 text-sm rounded-full border border-zinc-700 text-zinc-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
