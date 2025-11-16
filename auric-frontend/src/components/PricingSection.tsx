// src/components/PricingSection.tsx

const PLANS = [
  {
    id: "vip",
    name: "Signature Arena",
    label: "Full-scale concert package",
    price: "From RM 80,000",
    highlight: true,
    features: [
      "Artist booking / coordination",
      "Arena or large hall production",
      "Full stage, sound, and lighting design",
      "Ticketing strategy + box office support",
      "On-ground show-calling & crew",
    ],
  },
  {
    id: "premium",
    name: "Premier Showcase",
    label: "Mid-size venues & theatres",
    price: "From RM 40,000",
    highlight: false,
    features: [
      "Venue & technical coordination",
      "Stage / lighting / sound package",
      "Basic ticketing & registration",
      "Event day operations team",
    ],
  },
  {
    id: "standard",
    name: "Intimate Session",
    label: "Showcases, launches, showcases",
    price: "From RM 18,000",
    highlight: false,
    features: [
      "Compact sound & lighting",
      "Basic staging & backdrop",
      "Artist or talent coordination",
      "Lightweight guest management",
    ],
  },
  {
    id: "brand",
    name: "Brand Experience",
    label: "Custom concepts for brands",
    price: "Custom proposal",
    highlight: false,
    features: [
      "Concept & creative development",
      "Multi-day festivals or roadshows",
      "Sponsorship packaging support",
      "Content capture / social assets",
    ],
  },
];

export default function PricingSection() {
  return (
    <section>
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Event <span className="text-yellow-300">Packages</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl">
          Transparent starting points for concerts, festivals, and branded
          experiences. Every show is scoped and tailored to your venue, artist,
          and technical needs.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border bg-black/70
              shadow-[0_0_30px_rgba(0,0,0,0.7)]
              ${
                plan.highlight
                  ? "border-yellow-400/70 shadow-[0_0_50px_rgba(250,204,21,0.45)] lg:col-span-2"
                  : "border-yellow-500/25"
              }`}
          >
            {plan.highlight && (
              <div className="absolute right-4 top-4 rounded-full border border-yellow-500/70 bg-yellow-500/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-yellow-200">
                Most requested
              </div>
            )}

            <div className="p-5 pb-4">
              <h3 className="text-lg font-semibold text-zinc-50">
                {plan.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400">{plan.label}</p>
              <p className="mt-4 text-sm font-semibold text-yellow-300">
                {plan.price}
              </p>
            </div>

            <div className="px-5 pb-5 flex-1">
              <ul className="space-y-2 text-xs text-zinc-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-yellow-500/20 px-5 py-3 text-xs flex items-center justify-between">
              <span className="text-zinc-400">
                Ideal for{" "}
                <span className="text-zinc-200">
                  {plan.highlight ? "headline shows" : "selected events"}
                </span>
              </span>
              <button
                type="button"
                className="rounded-full border border-yellow-500/60 px-3 py-1 text-[11px] text-yellow-200 hover:bg-yellow-500/15 transition"
                onClick={() => {
                  const contact = document.getElementById("contact");
                  contact?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Request quote
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-zinc-500">
        Final budgets are confirmed after venue inspection, artist selection,
        and technical requirements are locked.
      </p>
    </section>
  );
}
