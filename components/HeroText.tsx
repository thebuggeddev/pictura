export default function HeroText() {
  return (
    <section className="relative z-20 mt-7 w-full pb-6 sm:mt-8 sm:pb-8 md:absolute md:inset-x-0 md:bottom-6 md:mt-0 md:pb-0">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-end gap-8 px-6 text-center sm:px-8 md:grid-cols-[1fr_auto_1fr] md:gap-0 md:px-10 md:text-left">
        <div className="hero-left order-2 md:order-1 md:justify-self-start">
          <p className="font-serifDisplay text-[clamp(2.9rem,7vw,5.3rem)] leading-[0.88] tracking-[-0.03em] text-white/42">
            Find
          </p>
          <p className="font-serifDisplay text-[clamp(3.2rem,8vw,5.7rem)] leading-[0.88] tracking-[-0.04em] text-white">
            the photo
          </p>
        </div>

        <div className="hero-tagline order-1 flex flex-col items-center gap-4 md:order-2 md:self-end">
          <p className="max-w-[300px] text-center text-[14px] leading-tight text-[#A0A0A0]/88 sm:max-w-[340px]">
            Explore, inspire, create. Discover visuals that bring your vision to life.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-4 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-all duration-500 ease-premium hover:bg-white/90"
          >
            <span>Get Started</span>
            <span className="text-base leading-none">→</span>
          </button>
        </div>

        <div className="hero-right order-3 md:justify-self-end md:text-right">
          <p className="font-serifDisplay text-[clamp(2.9rem,7vw,5.3rem)] leading-[0.88] tracking-[-0.03em] text-white/42">
            that reflects
          </p>
          <p className="font-serifDisplay text-[clamp(3.2rem,8vw,5.7rem)] leading-[0.88] tracking-[-0.04em] text-white">
            your ideas
          </p>
        </div>
      </div>
    </section>
  );
}
