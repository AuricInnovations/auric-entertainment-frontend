// src/hooks/useEvents.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { EventItem } from "../types/Events";

export function useEvents() {
  return useQuery<EventItem[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await apiFetch("/events"); // → GET /api/events
      if (!res.ok) {
        throw new Error(`Failed to load events (${res.status})`);
      }

      const raw = (await res.json()) as any[];

      // Map backend Event → frontend EventItem
      return raw.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        venue: e.venue,
        startTime: e.startTime,
        endTime: e.endTime,
        price: e.price,
        currency: "MYR", // backend has only price; we hard-code for now

        // optional fields – backend doesn’t have them yet, so these will be undefined
        coverImageUrl: e.coverImageUrl,
        city: e.city,
        country: e.country,
        tags: e.tags ?? [],
      })) as EventItem[];
    },
  });
}
