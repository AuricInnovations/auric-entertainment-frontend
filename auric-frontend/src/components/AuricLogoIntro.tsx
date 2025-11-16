// src/components/AuricLogoIntro.tsx
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
type Props = {
  src: string;                       // big logo image
  finalSrc?: string;                 // small header logo (optional)
  grid?: { cols: number; rows: number };
  finalSize?: { w: number; h: number };
  stageSize?: { w: number; h: number };
  holdMs?: number;                   // how long to show full logo before shatter
  dockSelector?: string;             // CSS selector for the top-left dock container
  onDone?: () => void;               // callback after animation completes
};

export default function AuricLogoIntro({
  src,
  finalSrc,
  grid = { cols: 18, rows: 10 },
  finalSize = { w: 140, h: 40 },
  stageSize = { w: 520, h: 150 },
  holdMs = 700,
  dockSelector,
  onDone,
}: Props) {
  const finalSrcResolved = finalSrc ?? src;
  const stageRef = useRef<HTMLDivElement>(null);
  const internalDockRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => {
    const arr: { x: number; y: number; w: number; h: number; bgX: number; bgY: number }[] = [];
    const tw = stageSize.w / grid.cols;
    const th = stageSize.h / grid.rows;
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        arr.push({
          x: c * tw,
          y: r * th,
          w: tw,
          h: th,
          bgX: -c * tw,
          bgY: -r * th,
        });
      }
    }
    return arr;
  }, [grid.cols, grid.rows, stageSize.w, stageSize.h]);

  useLayoutEffect(() => {
    if (!stageRef.current || !tilesRef.current || !overlayRef.current) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tileEls = gsap.utils.toArray<HTMLDivElement>(".auric-tile");

      // Reset positions off-screen
      gsap.set(tileEls, {
        x: () => gsap.utils.random(-window.innerWidth * 0.5, window.innerWidth * 0.5),
        y: () => gsap.utils.random(-window.innerHeight * 0.5, window.innerHeight * 0.5),
        rotation: () => gsap.utils.random(-90, 90),
        opacity: 0,
        scale: 0.6,
      });
      gsap.set(overlayRef.current, { opacity: 0, scale: 0.92 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },

      });
// Gentle breathing pulse on the gold glow
const glow = stageRef.current?.querySelector("div.pointer-events-none");
if (glow) {
  gsap.to(glow, {
    opacity: 0.8,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
      // Assemble to center
      tl.to(tileEls, {
        x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1.1,
        stagger: { each: 0.003, from: "random" },
      });

      // Fade in solid overlay (full logo look), hold, then shatter
      tl.to(overlayRef.current, { opacity: 1, scale: 1, duration: 0.35 }, "-=0.4");
      tl.to({}, { duration: holdMs / 1000 });
      tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, "<");
      tl.to(tileEls, {
        x: () => gsap.utils.random(-36, 36),
        y: () => gsap.utils.random(-28, 28),
        rotation: () => gsap.utils.random(-18, 18),
        scale: 0.96,
        duration: 0.42,
        ease: "power2.inOut",
        stagger: { each: 0.0015, from: "random" },
      }, "<");

      // Regroup perfectly before flying
      tl.to(tileEls, {
        x: 0, y: 0, rotation: 0, scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Smooth flight to the top-left dock using container-only FLIP
      tl.add(() => {
        const dock =
          (dockSelector ? document.querySelector(dockSelector) : null) ??
          internalDockRef.current;
        if (!dock || !tilesRef.current) return;

        const el = tilesRef.current;

        // 1) Measure current on-screen rects
        const srcRect = el.getBoundingClientRect();
        const dstRect = (dock as HTMLElement).getBoundingClientRect();

        // 2) Promote the container to an overlay at the exact visible position
        //    Using fixed avoids any parent transforms/flex centering shenanigans.
        Object.assign(el.style, {
          position: "fixed",
          left: `${srcRect.left}px`,
          top: `${srcRect.top}px`,
          width: `${srcRect.width}px`,
          height: `${srcRect.height}px`,
          margin: "0",
          transform: "translate(0px, 0px) scale(1, 1)",
          transformOrigin: "left top",
          zIndex: "9999",
          willChange: "transform",
        } as CSSStyleDeclaration);

        // 3) Compute the flight deltas & scaling
        const dx = dstRect.left - srcRect.left;
        const dy = dstRect.top - srcRect.top;
        const scaleX = dstRect.width / srcRect.width;
        const scaleY = dstRect.height / srcRect.height;

        // 4) Smooth flight
        gsap.to(el, {
          x: dx,
          y: dy,
          scaleX,
          scaleY,
          duration: 1.15,
          ease: "power3.inOut",
          onComplete: () => {
            // 5) Dock it: reparent, normalize, and swap to crisp SVG
            (dock as HTMLElement).appendChild(el);

            Object.assign(el.style, {
              position: "absolute",
              left: "0px",
              top: "0px",
              width: "100%",
              height: "100%",
              transform: "translate(0px, 0px) scale(1, 1)",
              zIndex: "auto",
              willChange: "auto",
            } as CSSStyleDeclaration);

            el.style.opacity = "0"; // hide mosaic

            const img = document.createElement("img");
            img.src = finalSrcResolved;
            img.alt = "Auric header logo";
            img.style.position = "absolute";
            img.style.inset = "0";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            // no filter here
            dock.appendChild(img);

            onDone && onDone();
          },
        });
      });


    }, stageRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = prevOverflow;
    };
  }, [tiles, finalSize.w, finalSize.h, dockSelector, holdMs, finalSrcResolved, onDone]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Built-in dock (used if dockSelector not provided) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div
          ref={internalDockRef}
          className="relative"
          style={{ width: finalSize.w, height: finalSize.h }}
        >
          <div className="auric-final-frame absolute inset-0" />
        </div>
      </div>

      {/* Center stage */}
      <div ref={stageRef} className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: stageSize.w, height: stageSize.h }}>
          {/* Solid overlay full logo */}
          <div ref={overlayRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0 }}>
            <img
              src={src}
              alt="Auric full logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center center",
                filter: "brightness(1.15) drop-shadow(0 0 6px rgba(255,255,255,0.18))",
              }}
            />
          </div>
          {/* Soft spotlight behind the logo to lift blacks off the background */}
          {/* <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 25%, rgba(0,0,0,0) 60%)",
              filter: "blur(2px)",
            }}
          /> */}
          {/* Golden spotlight behind the logo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,215,0,0.25) 0%, rgba(255,191,0,0.15) 25%, rgba(0,0,0,0) 65%)",
              filter: "blur(6px)",
            }}
          />
          {/* Particle tiles */}
          <div ref={tilesRef} className="absolute left-0 top-0" style={{ width: stageSize.w, height: stageSize.h }}>
            {tiles.map((t, idx) => (
              <div
                key={idx}
                className="auric-tile absolute will-change-transform"
                style={{
                  left: t.x,
                  top: t.y,
                  width: t.w,
                  height: t.h,
                  backgroundImage: `url(${src})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `${t.bgX}px ${t.bgY}px`,
                  backgroundSize: `${stageSize.w}px ${stageSize.h}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
