import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function BackgroundGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.to(".glow-orb-left", {
        x: -14,
        y: 10,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".glow-orb-right", {
        x: 12,
        y: -8,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".glow-core", {
        rotation: 6,
        scale: 1.03,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });
    }, glowRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={glowRef} className="glow-fade pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]" />

      {/* Main core: Romantic pink/rose glow */}
      <div className="glow-core absolute left-1/2 top-[40%] h-[68vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(80,20,40,0.5)_0%,rgba(60,10,30,0.4)_36%,rgba(10,10,10,0)_72%)] blur-[88px]" />

      {/* Orbs: Deep magenta and soft rose */}
      <div className="glow-orb-left absolute left-[30%] top-[30%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(100,30,60,0.35)_0%,rgba(60,10,30,0)_70%)] blur-[58px]" />
      <div className="glow-orb-right absolute left-[70%] top-[40%] h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,40,80,0.3)_0%,rgba(80,20,50,0)_70%)] blur-[58px]" />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_53%,rgba(255,250,252,0.015),rgba(15,10,12,0.7)_45%,#0A0A0A_75%)]" />
    </div>
  );
}

