// src/pages/Home.tsx
import EventsGrid from "../components/EventsGrid";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 space-y-24 py-10">
      <section id="events">
        <EventsGrid />
      </section>
    </main>
  );
}
