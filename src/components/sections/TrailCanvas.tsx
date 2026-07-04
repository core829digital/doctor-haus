"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TrailCanvas() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1,
      ease: "none",
    });

    const colorStart = [232, 130, 59];
    const colorEnd = [107, 143, 78];

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const color = colorStart.map((c, i) =>
          Math.round(c + (colorEnd[i] - c) * Math.min(1, Math.max(0, (progress - 0.3) / 0.4)))
        );
        path.setAttribute("stroke", `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden lg:block fixed left-8 top-0 h-full w-8 pointer-events-none z-40"
      aria-hidden="true"
    >
      <svg
        width="32"
        height="100%"
        viewBox="0 0 32 2000"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          ref={pathRef}
          d="M16,0 C16,200 4,300 16,400 C28,500 16,600 16,700 C16,800 28,900 16,1000 C4,1100 16,1200 16,1300 C16,1400 28,1500 16,1600 C4,1700 16,1800 16,2000"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          stroke="rgb(232, 130, 59)"
        />
      </svg>
    </div>
  );
}
