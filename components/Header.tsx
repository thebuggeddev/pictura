export default function Header() {
  return (
    <header className="relative z-30 mx-auto flex w-full max-w-[1400px] items-center justify-center px-6 pt-6 sm:px-8 sm:pt-8 lg:px-10">
      <div className="pointer-events-none flex items-center gap-2.5 text-[17px] tracking-[0.17em] text-white/85 sm:text-[24px] sm:tracking-[0.16em]">
        <span className="text-[0.95em] text-[#f2ab73] [text-shadow:0_0_12px_rgba(242,171,115,0.6)]">
          ✶
        </span>
        <span className="font-serifDisplay text-[0.85em] leading-none">Happy One Year to us</span>
      </div>
    </header>
  );
}
