import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BackgroundGlow from "../components/BackgroundGlow";
import Header from "../components/Header";
import HeartGrid from "../components/HeartGrid";
import HeroText from "../components/HeroText";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        gsap.set(
          [
            ".glow-fade",
            ".heart-cluster",
            ".heart-row",
            ".heart-tile",
            ".hero-left",
            ".hero-right",
            ".hero-tagline",
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
          },
        );
        return;
      }

      gsap.set(".glow-fade", { opacity: 0 });
      gsap.set(".heart-cluster", { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" });
      gsap.set(".heart-row", { opacity: 0, y: 24 });
      gsap.set(".heart-tile", {
        opacity: 0,
        scale: 0.84,
        y: 44,
        x: (index: number) => {
          const side = index % 2 === 0 ? -1 : 1;
          return side * (16 + (index % 6) * 4);
        },
        rotation: (index: number) => {
          const side = index % 2 === 0 ? -1 : 1;
          return side * (2 + (index % 4));
        },
      });
      gsap.set([".hero-left", ".hero-right", ".hero-tagline"], { opacity: 0 });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        scrollTrigger: {
          trigger: ".heart-scroll-trigger",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .to(".glow-fade", { opacity: 1, duration: 0.45 }, 0)
        .to(".heart-cluster", { opacity: 1, scale: 1, duration: 0.75 }, 0.02)
        .to(
          ".heart-row",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
          },
          0.14,
        )
        .to(
          ".heart-tile",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            rotation: 0,
            duration: 0.78,
            stagger: {
              amount: 0.82,
              from: "center",
            },
          },
          0.2,
        )
        .to(
          ".pixel-heart-tile",
          {
            scale: 1.11,
            boxShadow: "0 0 28px rgba(255,255,255,0.24)",
            duration: 0.35,
            ease: "power2.out",
          },
          0.8,
        )
        .to(
          ".pixel-heart-tile",
          {
            scale: 1,
            duration: 0.35,
            ease: "power2.inOut",
          },
          1.05,
        )
        .fromTo(
          ".hero-left",
          { x: -85 },
          {
            x: 0,
            opacity: 1,
            duration: 0.62,
          },
          0.98,
        )
        .fromTo(
          ".hero-right",
          { x: 85 },
          {
            x: 0,
            opacity: 1,
            duration: 0.62,
          },
          1.02,
        )
        .fromTo(
          ".hero-tagline",
          { y: 18 },
          {
            y: 0,
            opacity: 1,
            duration: 0.56,
          },
          1.16,
        );

      gsap.to(".pixel-heart-tile", {
        boxShadow: "0 0 24px rgba(255,255,255,0.22)",
        repeat: -1,
        yoyo: true,
        duration: 1.15,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: ".heart-scroll-trigger",
          start: "top 65%",
          toggleActions: "play pause resume pause",
        },
      });

      gsap.to(".heart-cluster", {
        y: -22,
        scrollTrigger: {
          trigger: ".heart-scroll-trigger",
          start: "top 62%",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background p-2 sm:p-3 lg:p-4">
      <div
        ref={rootRef}
        className="relative mx-auto min-h-[calc(100vh-1rem)] max-w-[1510px] overflow-hidden rounded-[28px] border border-white/10 bg-background"
      >
        <BackgroundGlow />
        <Header />

        <main className="relative flex min-h-[calc(100vh-90px)] w-full flex-col items-center px-2 pb-6 sm:px-4 sm:pb-8 lg:justify-start lg:pb-12 lg:pt-10">
          <HeartGrid />
          <HeroText />
        </main>
      </div>
    </div>
  );
}
