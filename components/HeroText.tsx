export default function HeroText() {
  return (
    <section className="relative z-20 mt-7 w-full pb-6 sm:mt-8 sm:pb-8 lg:absolute lg:inset-x-0 lg:bottom-6 lg:mt-0 lg:pb-0">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-end gap-8 px-6 text-center sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-0 lg:px-10 lg:text-left">
        <div className="hero-left order-2 lg:order-1 lg:justify-self-start">
          <p className="font-serifDisplay text-[clamp(2.9rem,7vw,5.3rem)] leading-[0.88] tracking-[-0.03em] text-white/42">
            I
          </p>
          <p className="font-serifDisplay text-[clamp(3.2rem,8vw,5.7rem)] leading-[0.88] tracking-[-0.04em] text-white">
            love
          </p>
        </div>

        <div className="hero-tagline order-1 flex flex-col items-center gap-4 lg:order-2 lg:self-end">
          <p className="max-w-[300px] text-center text-[14px] leading-tight text-[#A0A0A0]/88 sm:max-w-[340px]">
            To a beautiful year together and many more to come.
          </p>
        </div>

        <div className="hero-right order-3 lg:justify-self-end lg:text-right">
          <p className="font-serifDisplay text-[clamp(2.9rem,7vw,5.3rem)] leading-[0.88] tracking-[-0.03em] text-white/42">
            you
          </p>
          <p className="font-serifDisplay text-[clamp(3.2rem,8vw,5.7rem)] leading-[0.88] tracking-[-0.04em] text-white">
            Ishku
          </p>
        </div>
      </div>
    </section>
  );
}
