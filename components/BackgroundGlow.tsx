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

      <div className="glow-core absolute left-1/2 top-[40%] h-[68vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(42,26,74,0.56)_0%,rgba(58,15,28,0.46)_36%,rgba(10,10,10,0)_72%)] blur-[78px]" />

      <div className="glow-orb-left absolute left-[33%] top-[36%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(65,34,122,0.44)_0%,rgba(42,26,74,0)_70%)] blur-[48px]" />
      <div className="glow-orb-right absolute left-[67%] top-[37%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(108,22,47,0.4)_0%,rgba(58,15,28,0)_70%)] blur-[48px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_53%,rgba(255,255,255,0.02),rgba(10,10,10,0.68)_45%,#0A0A0A_75%)]" />
    </div>
  );
}

