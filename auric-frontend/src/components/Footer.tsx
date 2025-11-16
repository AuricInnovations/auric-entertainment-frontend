// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black/90 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-xs text-zinc-400">
          <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300/80">
            Auric Entertainment
          </p>
          <p>
            Live shows, festivals, and brand experiences in Malaysia.
          </p>
          <p className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} Auric Innovations. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 text-xs text-zinc-300 md:items-end">
          <div className="flex gap-3">
            <a
              href="mailto:hello@auric-entertainment.com"
              className="hover:text-yellow-300 transition"
            >
              info@auricentertainment.my
            </a>
            <span className="text-zinc-600">•</span>
            <span>Based in Malaysia</span>
          </div>

          <div className="flex gap-3 text-[11px] text-zinc-400">
            <a href="#events" className="hover:text-yellow-300 transition">
              Events
            </a>
            <a href="#pricing" className="hover:text-yellow-300 transition">
              Pricing
            </a>
            <a href="#contact" className="hover:text-yellow-300 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
