// src/pages/admin/AdminEvents.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";

type AdminEvent = {
  id?: number;
  title: string;
  venue?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  price?: number;
  description?: string;
  published?: boolean;
  coverImageUrl?: string; // 👈 poster URL
};

export default function AdminEvents() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<AdminEvent | null>(null);

  // load all events for admin table
  const { data, isLoading, isError } = useQuery<AdminEvent[]>({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const res = await apiFetch("/admin/events");
      if (!res.ok) throw new Error("Failed to load events");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: AdminEvent) => {
      const body = JSON.stringify(payload);
      if (payload.id) {
        const res = await apiFetch(`/admin/events/${payload.id}`, {
          method: "PUT",
          body,
        });
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      } else {
        const res = await apiFetch("/admin/events", {
          method: "POST",
          body,
        });
        if (!res.ok) throw new Error("Create failed");
        return res.json();
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["events"] }); // refresh public list
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/admin/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });

  function startCreate() {
    setEditing({
      title: "",
      venue: "",
      description: "",
      price: 0,
      capacity: undefined,
      startTime: "",
      endTime: "",
      published: true,
      coverImageUrl: "",
    });
  }

  function startEdit(e: AdminEvent) {
    setEditing({
      ...e,
      // make sure undefined instead of null so inputs behave
      venue: e.venue ?? "",
      description: e.description ?? "",
      coverImageUrl: e.coverImageUrl ?? "",
    });
  }

  function onChangeField<K extends keyof AdminEvent>(field: K, value: AdminEvent[K]) {
    setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    saveMutation.mutate(editing);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-yellow-200">Events</h1>
          <p className="text-xs text-zinc-400">
            Create and manage events shown on the public site.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="rounded-full bg-yellow-500/90 px-4 py-2 text-xs font-semibold text-black hover:bg-yellow-400"
        >
          + New event
        </button>
      </header>

      {/* table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/60">
        <table className="min-w-full text-xs">
          <thead className="bg-zinc-950/80 text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Venue</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">Price</th>
              <th className="px-3 py-2 text-left">Published</th>
              <th className="px-3 py-2 text-left">Cover</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-zinc-400">
                  Loading…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-red-400">
                  Failed to load events.
                </td>
              </tr>
            )}
            {!isLoading && !isError && data && data.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-zinc-400">
                  No events yet.
                </td>
              </tr>
            )}
            {data?.map((e) => (
              <tr key={e.id} className="border-t border-zinc-800">
                <td className="px-3 py-2 text-zinc-400">{e.id}</td>
                <td className="px-3 py-2">{e.title}</td>
                <td className="px-3 py-2 text-zinc-400">{e.venue}</td>
                <td className="px-3 py-2 text-zinc-400 text-[11px]">
                  {e.startTime}
                </td>
                <td className="px-3 py-2 text-zinc-200">
                  {typeof e.price === "number" ? `MYR ${e.price.toFixed(0)}` : "-"}
                </td>
                <td className="px-3 py-2">
                  {e.published ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                      Yes
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-700/40 px-2 py-0.5 text-[10px] text-zinc-300">
                      No
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-[10px] text-zinc-500 max-w-[160px] truncate">
                  {e.coverImageUrl || "-"}
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    onClick={() => startEdit(e)}
                    className="rounded-full border border-zinc-600 px-3 py-1 text-[11px] text-zinc-200 hover:border-yellow-400 hover:text-yellow-200"
                  >
                    Edit
                  </button>
                  {e.id && (
                    <button
                      onClick={() => deleteMutation.mutate(e.id!)}
                      className="rounded-full border border-red-500/60 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* side panel / inline form */}
      {editing && (
        <form
          onSubmit={onSubmit}
          className="mt-4 grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-xs"
        >
          <h2 className="text-sm font-semibold text-yellow-200 mb-1">
            {editing.id ? "Edit event" : "Create event"}
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Title</label>
              <input
                className="bg-neutral-900 p-2 rounded text-sm w-full"
                value={editing.title}
                onChange={(e) => onChangeField("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Venue</label>
              <input
                className="bg-neutral-900 p-2 rounded text-sm w-full"
                value={editing.venue ?? ""}
                onChange={(e) => onChangeField("venue", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Start time (ISO or datetime-local)</label>
              <input
                className="bg-neutral-900 p-2 rounded text-sm w-full"
                placeholder="2025-05-02T20:00:00+08:00"
                value={editing.startTime ?? ""}
                onChange={(e) => onChangeField("startTime", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">End time</label>
              <input
                className="bg-neutral-900 p-2 rounded text-sm w-full"
                value={editing.endTime ?? ""}
                onChange={(e) => onChangeField("endTime", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Capacity</label>
              <input
                type="number"
                className="bg-neutral-900 p-2 rounded text-sm w-full"
                value={editing.capacity ?? ""}
                onChange={(e) =>
                  onChangeField("capacity", e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400">Price (MYR)</label>
              <input
                type="number"
                className="bg-neutral-900 p-2 rounded text-sm w-full"
                value={editing.price ?? ""}
                onChange={(e) =>
                  onChangeField("price", e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Description</label>
            <textarea
              className="bg-neutral-900 p-2 rounded text-sm w-full min-h-[80px]"
              value={editing.description ?? ""}
              onChange={(e) => onChangeField("description", e.target.value)}
            />
          </div>

          {/* 👇 THIS is the field you asked about */}
          <div className="space-y-1">
            <label className="text-[11px] text-zinc-400">Cover image URL (poster)</label>
            <input
              className="bg-neutral-900 p-2 rounded text-sm w-full"
              placeholder="https://cdn.auric.my/events/hadagasma-main.jpg"
              value={editing.coverImageUrl ?? ""}
              onChange={(e) => onChangeField("coverImageUrl", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[11px] text-zinc-400">
              <input
                type="checkbox"
                checked={editing.published ?? true}
                onChange={(e) => onChangeField("published", e.target.checked)}
              />
              Published
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-full border border-zinc-700 px-4 py-2 text-[11px] text-zinc-200 hover:border-zinc-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-full bg-yellow-500 px-5 py-2 text-[11px] font-semibold text-black hover:bg-yellow-400 disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
