import type { CSSProperties } from "react";

const IMAGE_FALLBACK_URL =
  "https://images.unsplash.com/photo-1770034285769-4a5a3f410346?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

interface ImageTileProps {
  src: string;
  brightness: number;
  style: CSSProperties;
  alt: string;
  pixelHeart?: boolean;
}

const PIXEL_HEART_PATTERN = [
  "001111100",
  "011111110",
  "111111111",
  "111111111",
  "011111110",
  "001111100",
  "000111000",
  "000010000",
];

export default function ImageTile({
  src,
  brightness,
  style,
  alt,
  pixelHeart = false,
}: ImageTileProps) {
  const tileStyle = {
    ...style,
    "--tile-brightness": brightness.toFixed(2),
  } as CSSProperties;

  if (pixelHeart) {
    return (
      <figure
        className="heart-tile group relative flex shrink-0 items-center justify-center overflow-hidden bg-[#131313]"
        style={tileStyle}
      >
        <div className="grid grid-cols-9 gap-[1px] sm:gap-[1.5px]">
          {PIXEL_HEART_PATTERN.join("").split("").map((cell, index) => (
            <span
              key={`pixel-heart-cell-${index}`}
              className={`h-[2px] w-[2px] rounded-[1px] sm:h-[2.5px] sm:w-[2.5px] md:h-[3px] md:w-[3px] ${
                cell === "1"
                  ? "bg-[#f3f3f3] shadow-[0_0_4px_rgba(255,255,255,0.55)]"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </figure>
    );
  }

  return (
    <figure
      className="heart-tile group relative shrink-0 overflow-hidden"
      style={tileStyle}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          const target = event.currentTarget;
          target.onerror = null;
          target.src = IMAGE_FALLBACK_URL;
        }}
        className="h-full w-full object-cover [filter:brightness(var(--tile-brightness))_saturate(1.12)] transition-all duration-500 ease-premium group-hover:scale-[1.05] group-hover:[filter:brightness(calc(var(--tile-brightness)+0.12))_saturate(1.18)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/25 transition-all duration-500 ease-premium group-hover:shadow-tileGlow" />
    </figure>
  );
}
