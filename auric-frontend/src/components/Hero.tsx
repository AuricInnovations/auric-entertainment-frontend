import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";


// src/components/Hero.tsx
type Props = { play?: boolean };

export default function Hero({ play }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-yellow-500/20 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
      {/* subtle inner glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(250,204,21,0.28) 0, transparent 45%), radial-gradient(circle at 100% 100%, rgba(253,224,71,0.18) 0, transparent 55%)",
        }}
      />

      <div className="relative grid gap-10 px-8 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT – text */}
        <div className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.32em] text-yellow-300/80">
            AURIC ENTERTAINMENT
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
            <span className="text-yellow-300">Premium shows.</span>{" "}
            <span className="text-zinc-100">Bold experiences.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base text-zinc-300">
            Concerts, festivals, and immersive moments for Malaysia’s most
            vibrant crowds. Curated line-ups, world-class production, and
            seamless guest journeys from ticket to encore.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              href="#events"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 text-black font-semibold px-5 py-2.5 text-sm shadow-[0_0_25px_rgba(250,204,21,0.4)] hover:bg-yellow-300 transition"
            >
              Get Tickets
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-yellow-400/50 px-5 py-2.5 text-sm text-yellow-200 hover:bg-yellow-500/10 transition"
            >
              Explore Packages
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-400">
            <div>
              <p className="font-semibold text-zinc-200">Kuala Lumpur · Selangor</p>
              <p>Indoor arenas, outdoor festivals, and bespoke brand events.</p>
            </div>
            <div className="h-10 w-px bg-zinc-700/70 hidden sm:block" />
            <div>
              <p className="font-semibold text-zinc-200">Full-service production</p>
              <p>Artists, staging, sound, lighting, and guest experience.</p>
            </div>
          </div>
        </div>

        {/* RIGHT – abstract “stage” card */}
        <div className="relative flex items-center justify-center">
          <div className="relative h-56 w-full max-w-sm rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-yellow-500/30 shadow-[0_0_45px_rgba(250,204,21,0.25)]">
            {/* stage light beams */}
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "conic-gradient(from 230deg at 50% 0%, rgba(250,204,21,0.35), transparent 32%, rgba(129,140,248,0.32), transparent 70%, rgba(250,204,21,0.35))",
                maskImage:
                  "radial-gradient(circle at 50% 0%, black 0, transparent 60%)",
              }}
            />
            {/* “crowd” representation */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end justify-center gap-1 px-5 pb-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 rounded-full bg-yellow-300/70"
                  style={{
                    height: `${40 + Math.random() * 40}%`,
                    opacity: 0.45 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
            {/* label */}
            <div className="absolute top-4 left-4 rounded-full border border-yellow-400/50 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-yellow-200/90">
              Next: Hadagasma Live
            </div>
            <div className="absolute bottom-3 right-4 text-right text-[11px] text-zinc-300">
              <p className="font-semibold text-yellow-200">Signature Events</p>
              <p>Auric-level staging &amp; sound.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
