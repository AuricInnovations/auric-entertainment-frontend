// src/pages/admin/AdminGallery.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../../lib/api";
import { useState } from "react";

type GalleryImage = {
  id?: number;
  title?: string;
  description?: string;
  imageUrl: string;
  sortOrder?: number;
  isActive: boolean;
};

const emptyItem: GalleryImage = {
  title: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminGallery() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<GalleryImage | null>(null);

  const { data, isLoading, isError } = useQuery<GalleryImage[]>({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await apiFetch("/admin/gallery");
      if (!res.ok) throw new Error("Failed to load gallery");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: GalleryImage) => {
      const body = JSON.stringify(payload);
      if (payload.id) {
        const res = await apiFetch(`/admin/gallery/${payload.id}`, {
          method: "PUT",
          body,
        });
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      } else {
        const res = await apiFetch("/admin/gallery", {
          method: "POST",
          body,
        });
        if (!res.ok) throw new Error("Create failed");
        return res.json();
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    },
  });

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/80 mb-1">
            Admin
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Image gallery</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage the images used in the public gallery section.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyItem })}
          className="rounded-full bg-yellow-400 text-black text-sm font-semibold px-4 py-2 hover:bg-yellow-300 transition"
        >
          + Add image
        </button>
      </header>

      {isLoading && <p className="text-sm text-zinc-400">Loading images…</p>}
      {isError && (
        <p className="text-sm text-red-300">
          Failed to load images. Check /admin/gallery API.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-black/80 overflow-hidden flex"
            >
              <div className="w-36 h-28 bg-zinc-900">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title || ""}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 px-4 py-3 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-200 line-clamp-1">
                    {item.title || "Untitled"}
                  </p>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Order: {item.sortOrder ?? 0} ·{" "}
                    {item.isActive ? "Active" : "Hidden"}
                  </p>
                </div>
                <div className="flex gap-2 text-xs mt-2">
                  <button
                    onClick={() => setEditing(item)}
                    className="rounded-full border border-yellow-500/50 px-3 py-1 text-yellow-200 hover:bg-yellow-500/10 transition"
                  >
                    Edit
                  </button>
                  {item.id && (
                    <button
                      onClick={() =>
                        window.confirm("Delete this image?") &&
                        deleteMutation.mutate(item.id!)
                      }
                      className="rounded-full border border-red-500/60 px-3 py-1 text-red-300 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <div className="mt-4 rounded-2xl border border-yellow-500/40 bg-black/90 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editing.id ? "Edit image" : "Add image"}
            </h2>
            <button
              className="text-xs text-zinc-400 hover:text-zinc-200"
              onClick={() => setEditing(null)}
            >
              Close
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-300 mb-1">
                Image URL
              </label>
              <input
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm focus:border-yellow-400 outline-none"
                value={editing.imageUrl}
                onChange={(e) =>
                  setEditing({ ...editing, imageUrl: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-300 mb-1">
                Title
              </label>
              <input
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm focus:border-yellow-400 outline-none"
                value={editing.title || ""}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-300 mb-1">
                Sort order
              </label>
              <input
                type="number"
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm focus:border-yellow-400 outline-none"
                value={editing.sortOrder ?? 0}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    sortOrder: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-zinc-300 mb-1">
                Description
              </label>
              <textarea
                className="w-full bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-700 text-sm focus:border-yellow-400 outline-none min-h-[60px]"
                value={editing.description || ""}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 text-xs">
              <input
                id="gallery-active"
                type="checkbox"
                checked={editing.isActive}
                onChange={(e) =>
                  setEditing({ ...editing, isActive: e.target.checked })
                }
              />
              <label htmlFor="gallery-active" className="text-zinc-300">
                Active (visible on public gallery)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 text-sm mt-2">
            <button
              onClick={() => setEditing(null)}
              className="rounded-full border border-zinc-700 px-4 py-1.5 text-zinc-300 hover:border-zinc-500"
            >
              Cancel
            </button>
            <button
              onClick={() => saveMutation.mutate(editing)}
              disabled={!editing.imageUrl || saveMutation.isPending}
              className="rounded-full bg-yellow-400 text-black font-semibold px-4 py-1.5 disabled:opacity-60"
            >
              {saveMutation.isPending
                ? "Saving..."
                : editing.id
                ? "Save changes"
                : "Add image"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
