// src/components/GallerySection.tsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { apiFetch } from "../lib/api";

type GalleryApiImage = {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  sortOrder?: number;
  isActive: boolean;
};

// The "slide" shape the UI will use
type Slide = {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
};

// Fallback slides in case API returns nothing or fails
const FALLBACK_SLIDES: Slide[] = [
  {
    id: 1,
    title: "Electronic nights",
    subtitle: "Club + brand events",
    tag: "Gallery",
    imageUrl:
      "https://images.pexels.com/photos/167472/pexels-photo-167472.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 2,
    title: "Arena production",
    subtitle: "Full-scale concert rigs",
    tag: "Arena",
    imageUrl:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 3,
    title: "Festival glow",
    subtitle: "Outdoor festivals & food",
    tag: "Festival",
    imageUrl:
      "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export default function GallerySection() {
  // 1) Load images from backend
  const { data, isLoading, isError } = useQuery<GalleryApiImage[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await apiFetch("/gallery");
      if (!res.ok) throw new Error("Failed to load gallery");
      return res.json();
    },
  });

  // 2) Map API images → slides
  const apiSlides: Slide[] =
    data && data.length > 0
      ? data
          .filter((g) => g.isActive)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((g) => ({
            id: g.id,
            title: g.title || "Auric event visual",
            subtitle: g.description || "",
            tag: "Gallery",
            imageUrl: g.imageUrl,
          }))
      : [];

  const slides = apiSlides.length > 0 ? apiSlides : FALLBACK_SLIDES;

  // 3) Slider state + GSAP
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset index if slide count changes
  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 8000);
    return () => clearInterval(id);
  }, [slides.length]);

  // Simple fade/slide transition with GSAP whenever `index` changes
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const img = containerRef.current!.querySelector(".auric-gallery-img");
      const text = containerRef.current!.querySelector(".auric-gallery-text");

      if (img) {
        gsap.fromTo(
          img,
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }
        );
      }
      if (text) {
        gsap.fromTo(
          text,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [index, slides]);

  const active = slides[index];

  function goTo(i: number) {
    if (i === index) return;
    setIndex(i);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  return (
    <section id="gallery" className="max-w-7xl mx-auto px-4 mt-24">
      <header className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/80">
            Visual highlights
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Visual <span className="text-yellow-300">highlights</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            A rotating look at the atmosphere, crowds, and production from
            Auric-style shows.
          </p>
        </div>
        <p className="text-xs text-zinc-500">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </p>
      </header>

      <div
        ref={containerRef}
        className="relative mt-4 rounded-[32px] border border-yellow-500/35 bg-gradient-to-br from-yellow-500/10 via-black/80 to-black/95 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
      >
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <img
            key={active.id}
            src={active.imageUrl}
            alt={active.title}
            className="auric-gallery-img h-full w-full object-cover"
          />

          {/* overlay content */}
          <div className="auric-gallery-text absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-yellow-300">
                {active.tag}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-yellow-100">
              {active.title}
            </h3>
            {active.subtitle && (
              <p className="mt-1 text-xs md:text-sm text-zinc-300 max-w-xl">
                {active.subtitle}
              </p>
            )}
          </div>

          {/* Controls */}
          {slides.length > 1 && (
            <>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={prev}
                  className="h-8 w-8 rounded-full bg-black/80 text-yellow-200 text-xs flex items-center justify-center hover:bg-yellow-500/20"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="h-8 w-8 rounded-full bg-black/80 text-yellow-200 text-xs flex items-center justify-center hover:bg-yellow-500/20"
                >
                  ›
                </button>
              </div>

              <div className="absolute bottom-4 right-6 flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={`h-2 w-2 rounded-full transition ${
                      i === index
                        ? "bg-yellow-400"
                        : "bg-zinc-500 hover:bg-yellow-300"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading && (
        <p className="mt-3 text-xs text-zinc-500">Loading gallery…</p>
      )}
      {isError && apiSlides.length === 0 && (
        <p className="mt-3 text-xs text-red-400">
          Failed to load gallery. Showing sample images.
        </p>
      )}
    </section>
  );
}
