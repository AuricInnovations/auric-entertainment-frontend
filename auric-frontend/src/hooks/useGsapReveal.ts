// src/hooks/useGsapReveal.ts
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapStagger<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const items = el.querySelectorAll("[data-reveal]");

    const ctx = gsap.context(() => {
      gsap.set(items, { y: 24, opacity: 0 });

      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// NEW: generic fade/slide-in for whole sections
export function useSectionReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
