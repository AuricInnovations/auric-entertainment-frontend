// src/components/AboutSection.tsx

export default function AboutSection() {
  return (
    <section>
      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          About <span className="text-yellow-300">Auric Entertainment</span>
        </h2>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] items-start">
        {/* LEFT – story */}
        <div className="space-y-4 text-sm text-zinc-200">
          <p className="text-neutral-300">
            Auric Entertainment designs and delivers premium live experiences
            for audiences across Malaysia – from arena concerts and festivals to
            intimate showcases and branded events.
          </p>
          <p className="text-neutral-300">
            We combine technical production, artist management, and guest
            experience into one team, so every show feels seamless from first
            announcement to final encore.
          </p>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-yellow-500/30 bg-black/70 px-4 py-3">
              <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                Experience
              </p>
              <p className="text-lg font-semibold text-yellow-300">+ X years</p>
              <p className="mt-1 text-zinc-400">
                Live events, concerts, and brand activations.
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/60 px-4 py-3">
              <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                Focus
              </p>
              <p className="text-lg font-semibold text-yellow-300">
                End-to-end
              </p>
              <p className="mt-1 text-zinc-400">
                Concept, production, operations, and talent.
              </p>
            </div>
            <div className="rounded-2xl border border-yellow-500/20 bg-black/60 px-4 py-3">
              <p className="text-[11px] text-zinc-400 uppercase tracking-[0.2em] mb-1">
                Region
              </p>
              <p className="text-lg font-semibold text-yellow-300">
                Malaysia
              </p>
              <p className="mt-1 text-zinc-400">
                Kuala Lumpur, Selangor & key cities.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT – bullets */}
        <div className="rounded-2xl border border-zinc-700/60 bg-black/70 px-5 py-4 text-xs text-zinc-200">
          <p className="font-semibold text-zinc-100 mb-2">
            What we care about
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>Clear communication with artists, venues, and partners.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>Audience-first design for sound, sightlines, and flow.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>Reliable budgets and timelines — no last-minute surprises.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <span>Building long-term partnerships with venues and brands.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
