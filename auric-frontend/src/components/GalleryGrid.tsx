// src/components/GalleryGrid.tsx
import { useState } from "react";

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  label: string;
  meta?: string;
};

// Replace these URLs with your own photos later.
// For now they can be remote images.
const ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&w=1200",
    alt: "Arena concert lights",
    label: "Arena highlights",
    meta: "Large-scale productions",
  },
  {
    id: 2,
    src: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&w=1200",
    alt: "Festival crowd at night",
    label: "Festival energy",
    meta: "Outdoor experiences",
  },
  {
    id: 3,
    src: "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&w=1200",
    alt: "DJ and lights",
    label: "Electronic nights",
    meta: "Club + brand events",
  },
  {
    id: 4,
    src: "https://images.pexels.com/photos/167404/pexels-photo-167404.jpeg?auto=compress&w=1200",
    alt: "Stage spotlights",
    label: "Stage design",
    meta: "Lighting & visuals",
  },
  {
    id: 5,
    src: "https://images.pexels.com/photos/1938359/pexels-photo-1938359.jpeg?auto=compress&w=1200",
    alt: "Crowd cheering",
    label: "Crowd moments",
    meta: "Audience experience",
  },
  {
    id: 6,
    src: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&w=1200",
    alt: "Band on stage",
    label: "Live acts",
    meta: "Artists & bands",
  },
];

function GalleryCard({ item }: { item: GalleryItem }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-black/60 border border-yellow-500/20
                 shadow-[0_0_30px_rgba(0,0,0,0.65)]"
    >
      <div className="relative h-52 sm:h-56 overflow-hidden">
        {/* image with lazy loading */}
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700
                      ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        {/* subtle gold overlay on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                     transition-opacity duration-500 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at center, rgba(250,204,21,0.45), transparent 60%)",
          }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-xs">
        <div>
          <p className="font-semibold text-zinc-50">{item.label}</p>
          {item.meta && <p className="text-zinc-400 mt-0.5">{item.meta}</p>}
        </div>
        <span className="rounded-full border border-yellow-500/40 px-2 py-0.5 text-[10px] text-yellow-200/90 uppercase tracking-[0.18em]">
          Auric
        </span>
      </div>
    </article>
  );
}

export default function GalleryGrid() {
  return (
    <section>
      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Visual <span className="text-yellow-300">Highlights</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          A glimpse into the shows, crowds, and moments crafted by Auric
          Entertainment.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ITEMS.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
