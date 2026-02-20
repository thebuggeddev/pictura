export default function HeroText() {
  return (
    <section className="relative z-20 mt-7 w-full pb-6 sm:mt-8 sm:pb-8 lg:absolute lg:inset-x-0 lg:bottom-6 lg:mt-0 lg:pb-0">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-end gap-8 px-6 text-center sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-0 lg:px-10 lg:text-left">
        <div className="hero-left order-2 lg:order-1 lg:justify-self-start">
          <p className="font-serifDisplay text-[clamp(2.9rem,7vw,5.3rem)] leading-[0.88] tracking-[-0.03em] text-white/42">
            Find
          </p>
          <p className="font-serifDisplay text-[clamp(3.2rem,8vw,5.7rem)] leading-[0.88] tracking-[-0.04em] text-white">
            the photo
          </p>
        </div>

        <div className="hero-tagline order-1 flex flex-col items-center gap-4 lg:order-2 lg:self-end">
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

        <div className="hero-right order-3 lg:justify-self-end lg:text-right">
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
