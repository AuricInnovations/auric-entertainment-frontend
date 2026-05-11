// src/components/TeamSection.tsx

type Member = {
    name: string;
    role: string;
    focus: string;
};

const TEAM: Member[] = [
    {
        name: "Sameera Cristy",
        role: "CEO, Auric Entertainment",
        focus: "Leads overall event vision, key decisions, and stakeholder alignment.",
    },
    {
        name: "Lakshika Sewwandi",
        role: "Finance & Event Strategist",
        focus: "Owns budgeting, ticketing strategy, and financial planning for each event.",
    },
    {
        name: "Bhashitha Ratnayake",
        role: "Marketing, Artist & Operations Lead",
        focus: "Drives branding, marketing campaigns, artist liaison, and show-day operations.",
    },
    {
        name: "Rusiru De Silva",
        role: "IT & Event Specialist",
        focus: "Builds and manages IT, ticketing systems, website, and technical integrations.",
    },
    {
        name: "Thilina Madusanka",
        role: "Partner Alliance Executive",
        focus: "Secures sponsors and partners, and manages key external relationships.",
    },
    {
        name: "Hesara Kavinda",
        role: "Event Executive",
        focus: "Trusted partners for staging, rigging, sound, and lighting.",
    },
];

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
}

export default function TeamSection() {
    return (
        <section>
            <header className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        The <span className="text-yellow-300">team</span> behind the shows
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400 max-w-xl">
                        A core team leading strategy and production, supported by a network
                        of technical specialists and on-ground crew.
                    </p>
                </div>
            </header>

            <div className="grid gap-5 md:grid-cols-3">
                {TEAM.map((m) => (
                    <article
                        key={m.name}
                        className="rounded-2xl border border-yellow-500/25 bg-black/70 px-4 py-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(0,0,0,0.7)]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xs font-bold text-black shadow-[0_0_18px_rgba(250,204,21,0.6)]">
                                {initials(m.name)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-50">{m.name}</p>
                                <p className="text-[11px] text-yellow-200/90 uppercase tracking-[0.15em]">
                                    {m.role}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-300">{m.focus}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
