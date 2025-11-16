// src/components/EventCard.tsx
import type { EventItem } from "../types/Events";

type Props = { event: EventItem; onClick?: (id: number) => void };

export default function EventCard({ event, onClick }: Props) {
  const start = event.startTime ? new Date(event.startTime) : undefined;

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl
                 bg-black/70 border border-yellow-500/20
                 shadow-[0_0_30px_rgba(0,0,0,0.7)]
                 hover:border-yellow-400/60 hover:shadow-[0_0_40px_rgba(250,204,21,0.45)]
                 transition cursor-pointer"
      onClick={() => onClick?.(event.id)}
    >
      {/* cover */}
      <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-zinc-500 text-xs">
            Auric Event Visual
          </div>
        )}

        {/* subtle top gold beam */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"
          style={{
            background:
              "linear-gradient(to bottom, rgba(250,204,21,0.55), transparent 55%)",
          }}
        />
      </div>

      {/* body */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-50 tracking-wide">
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-zinc-300">
          {start && (
            <span>
              {start.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              ·{" "}
              {start.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {(event.venue || event.city) && (
            <span className="text-zinc-400">
              {[event.venue, event.city, event.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex flex-wrap gap-1 text-[11px] text-yellow-200/80">
            {event.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                className="rounded-full border border-yellow-700/70 bg-yellow-500/10 px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
          {typeof event.price === "number" && (
            <div className="text-right">
              <span className="block text-[10px] text-zinc-400">From</span>
              <span className="text-sm font-semibold text-yellow-300">
                {event.currency ?? "MYR"} {event.price.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
