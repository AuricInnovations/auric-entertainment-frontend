// src/App.tsx
import { useState } from "react";
import AuricLogoIntro from "./components/AuricLogoIntro";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import auricLogo from "./assets/auriclogo.svg";
import EventsGrid from "./components/EventsGrid";
import { useSectionReveal } from "./hooks/useGsapReveal";
import GalleryCarousel from "./components/GalleryCarousel";
import PricingSection from "./components/PricingSection";
import ContactSection from "./components/ContactSection";
import AboutSection from "./components/AboutSection";
import TeamSection from "./components/TeamSection";
import Footer from "./components/Footer";
import AdsterraBanner from "./components/AdsterraBanner";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const heroRef = useSectionReveal<HTMLElement>();
  const eventsRef = useSectionReveal<HTMLElement>();
  const galleryRef = useSectionReveal<HTMLElement>();
  const pricingRef = useSectionReveal<HTMLElement>();
  const contactRef = useSectionReveal<HTMLElement>();
  const aboutRef = useSectionReveal<HTMLElement>();
  const teamRef = useSectionReveal<HTMLElement>();

  return (
    <div className="min-h-screen text-zinc-100 bg-[#02010a]">
      {/* background gradients ... */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top, rgba(255,215,0,0.16) 0, transparent 55%), radial-gradient(circle at bottom, rgba(252,211,77,0.10) 0, transparent 60%)",
        }}
      />

      <NavBar visible={!showIntro} finalSize={{ w: 160, h: 48 }} />

      {showIntro && (
        <AuricLogoIntro
          src={auricLogo}
          finalSrc={auricLogo}
          grid={{ cols: 28, rows: 16 }}
          stageSize={{ w: 720, h: 405 }}
          finalSize={{ w: 160, h: 48 }}
          holdMs={900}
          dockSelector="#auric-dock"
          onDone={() => setShowIntro(false)}
        />
      )}

      <main className="space-y-12">
        {/* HERO */}
        <section
          id="hero"
          ref={heroRef}
          className="
      min-h-[calc(100vh-56px)]
      flex items-start
      pt-16 lg:pt-24
      px-4
    "
        >
          <div className="w-full max-w-6xl mx-auto">
            <Hero play={!showIntro} />
          </div>
        </section>
        
        {/* Adsterra Banner */}
        <AdsterraBanner />

        {/* EVENTS */}
        <section id="events" ref={eventsRef} className="px-4 pb-24">
          <div className="w-full max-w-6xl mx-auto">
            <EventsGrid />
          </div>
        </section>

        {/* GALLERY placeholder */}
        <section
          id="gallery"
          ref={galleryRef}
          className="px-4 min-h-[60vh] flex items-center pb-24"
        >
          <div className="w-full max-w-6xl mx-auto">
            <GalleryCarousel />
          </div>
        </section>
        
        {/* PRICING placeholder */}
        <section
          id="pricing"
          ref={pricingRef}
          className="px-4 min-h-[60vh] flex items-center pb-24"
        >
          <div className="w-full max-w-6xl mx-auto">
            <PricingSection />
          </div>
        </section>
        <section
          id="contact"
          ref={contactRef}
          className="px-4 py-16 lg:py-20"
        >
          <div className="w-full max-w-6xl mx-auto">
            <ContactSection />
          </div>
        </section>
        <section
          id="team"
          ref={teamRef}
          className="px-4 py-16 lg:py-20"
        >
          <div className="w-full max-w-6xl mx-auto">
            <TeamSection />
          </div>
        </section>
        <section
          id="about"
          ref={aboutRef}
          className="px-4 pb-20"
        >
          <div className="w-full max-w-6xl mx-auto">
            <AboutSection />
          </div>
        </section>


      </main>
      <Footer/>

    </div>
  );
}
