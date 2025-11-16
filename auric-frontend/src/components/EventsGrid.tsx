// src/components/EventsGrid.tsx
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { useEvents } from "../hooks/useEvents";
import { useGsapStagger } from "../hooks/useGsapReveal";
import type { EventItem } from "../types/Events";
import { useNavigate } from "react-router-dom";

export default function EventsGrid() {
  const revealRef = useGsapStagger<HTMLDivElement>();
  const { data, isLoading, isError } = useEvents();
  const navigate = useNavigate();

  const events: EventItem[] = data ?? [];

  return (
    <section className="mx-auto max-w-6xl px-0 sm:px-0 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Upcoming <span className="text-yellow-300">Events</span>
        </h2>
        <p className="text-neutral-400 mt-2">
          Curated shows and festivals by Auric Entertainment.
        </p>
      </header>

      {isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 mb-6">
          Failed to load events from the server.
        </div>
      )}

      <div
        ref={revealRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
        ) : events.length === 0 ? (
          <div className="col-span-full text-sm text-neutral-400">
            No upcoming events are published yet.
          </div>
        ) : (
          // 🔥 IMPORTANT: no .slice(0, 3) – show everything
          events.map((ev: EventItem) => (
            <div key={ev.id} data-reveal>
              <EventCard
                event={ev}
                onClick={(id) => navigate(`/events/${id}`)}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
