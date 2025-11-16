// src/components/ContactSection.tsx
import { useState } from "react";
import { apiFetch } from "../lib/api";

type FormState = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  city: string;
  date: string;
  budget: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  city: "",
  date: "",
  budget: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);
  setSubmitted(false);

  if (!form.name || !form.email) {
    setError("Name and email are required.");
    return;
  }

  try {
    setSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      eventType: form.eventType || null,
      city: form.city || null,
      preferredDate: form.date || null,  // matches LeadRequest.preferredDate
      budget: form.budget || null,
      message: form.message || null,
    };

    const res = await apiFetch("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Lead submit failed", res.status, text);
      setError("Could not send your enquiry. Please try again.");
      return;
    }

    setSubmitted(true);
    setForm(initialState);
  } catch (err) {
    console.error(err);
    setError("Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <section>
      <header className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Plan your <span className="text-yellow-300">next event</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-xl">
          Share a few details and the Auric team will follow up with a tailored
          proposal for your concert, festival, or brand experience in Malaysia.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-yellow-500/30 bg-black/70 p-5 sm:p-6 shadow-[0_0_35px_rgba(0,0,0,0.75)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Name *
              </label>
              <input
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Phone / WhatsApp
              </label>
              <input
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+60 ..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Event type
              </label>
              <select
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.eventType}
                onChange={(e) => update("eventType", e.target.value)}
              >
                <option value="">Select</option>
                <option>Concert / live show</option>
                <option>Festival</option>
                <option>Corporate / brand event</option>
                <option>Launch / showcase</option>
                <option>Private event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                City / venue
              </label>
              <input
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Kuala Lumpur, Selangor, Penang..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Preferred date
              </label>
              <input
                type="date"
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Budget range
              </label>
              <select
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400"
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
              >
                <option value="">Select</option>
                <option>Under RM 20,000</option>
                <option>RM 20,000 – RM 50,000</option>
                <option>RM 50,000 – RM 100,000</option>
                <option>RM 100,000+</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Event details
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg bg-neutral-900/90 px-3 py-2 text-sm text-zinc-100 border border-neutral-700 focus:outline-none focus:border-yellow-400 resize-none"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Artist ideas, expected audience size, technical requirements, or anything else we should know."
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {submitted && !error && (
            <p className="mt-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 rounded-lg px-3 py-2">
              Thank you — your request has been noted. The Auric team will get
              back to you shortly.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-yellow-400 text-black font-semibold px-6 py-2.5 text-sm disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Submit enquiry"}
          </button>
        </form>

        {/* SIDE INFO */}
        <aside className="space-y-5 text-sm text-zinc-200">
          <div className="rounded-2xl border border-yellow-500/30 bg-black/70 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80 mb-2">
              Auric Entertainment
            </p>
            <p className="text-sm text-zinc-200">
              Based in Malaysia, partnering with venues and brands for concerts,
              festivals, and cultural events.
            </p>
            <p className="mt-3 text-xs text-zinc-400">
              Typical response time: within 1–2 business days.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-700/60 bg-black/60 px-5 py-4 text-xs text-zinc-300">
            <p className="font-semibold text-zinc-100 mb-1">What to expect</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Initial call or WhatsApp to align on scope.</li>
              <li>High-level budget and concept options.</li>
              <li>Detailed proposal for your chosen direction.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
