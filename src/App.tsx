import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import BackgroundGlow from "../components/BackgroundGlow";
import Header from "../components/Header";
import HeartGrid from "../components/HeartGrid";
import HeroText from "../components/HeroText";

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.set(".glow-fade", { opacity: 0 });
      gsap.set(".heart-tile", { opacity: 0, scale: 0.8, y: 40 });
      gsap.set([".hero-left", ".hero-right", ".hero-tagline"], { opacity: 0 });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(".glow-fade", { opacity: 1, duration: 1.15 })
        .to(
          ".heart-tile",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.95,
            stagger: {
              amount: 0.9,
              from: "center",
            },
          },
          "-=0.55",
        )
        .fromTo(
          ".hero-left",
          { x: -95 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
          },
          "-=0.35",
        )
        .fromTo(
          ".hero-right",
          { x: 95 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
          },
          "<",
        )
        .fromTo(
          ".hero-tagline",
          { y: 22 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
          },
          "-=0.3",
        );
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

        <main className="relative flex min-h-[calc(100vh-90px)] w-full flex-col items-center px-2 pb-6 sm:px-4 sm:pb-8 md:justify-start md:pb-12 md:pt-8 lg:pt-10">
          <HeartGrid />
          <HeroText />
        </main>
      </div>
    </div>
  );
}
