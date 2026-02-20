export default function Header() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8 lg:px-10">
      <button
        type="button"
        aria-label="Open menu"
        className="group flex h-11 w-14 items-center justify-center rounded-full border border-transparent transition-all duration-500 ease-premium hover:border-white/10 hover:bg-white/[0.03]"
      >
        <span className="relative block h-[14px] w-8">
          <span className="absolute left-0 top-[2px] h-[1.6px] w-full bg-white/45 transition-transform duration-500 ease-premium group-hover:translate-y-[1px]" />
          <span className="absolute left-0 top-[9px] h-[1.6px] w-[72%] bg-white/35 transition-all duration-500 ease-premium group-hover:w-full group-hover:-translate-y-[1px]" />
        </span>
      </button>

      <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 text-[17px] tracking-[0.17em] text-white/85 sm:text-[24px] sm:tracking-[0.16em]">
        <span className="text-[0.95em] text-[#f2ab73] [text-shadow:0_0_12px_rgba(242,171,115,0.6)]">
          ✶
        </span>
        <span className="font-serifDisplay text-[0.85em] leading-none">PICTURA</span>
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-4 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition-all duration-500 ease-premium hover:bg-white/[0.08] hover:text-white sm:px-6 sm:py-2.5"
      >
        <span>Get Started</span>
        <span className="text-base leading-none">→</span>
      </button>
    </header>
  );
}
