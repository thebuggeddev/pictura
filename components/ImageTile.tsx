import { useMemo, useRef, type CSSProperties } from "react";
import { CURATED_IMAGE_URLS } from "../lib/unsplash";

const FALLBACK_IMAGE_URLS = CURATED_IMAGE_URLS;

interface ImageTileProps {
  src: string;
  brightness: number;
  style: CSSProperties;
  alt: string;
  fallbackIndex?: number;
  pixelHeart?: boolean;
  className?: string;
  onPointCloudEnter?: (
    element: HTMLElement,
    imageElement: HTMLImageElement | null,
    src: string,
  ) => void;
  onPointCloudMove?: (
    element: HTMLElement,
    imageElement: HTMLImageElement | null,
    src: string,
  ) => void;
  onPointCloudLeave?: () => void;
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
  fallbackIndex = 0,
  pixelHeart = false,
  className = "",
  onPointCloudEnter,
  onPointCloudMove,
  onPointCloudLeave,
}: ImageTileProps) {
  const tileRef = useRef<HTMLElement | null>(null);
  const fallbackBaseIndex = useMemo(() => {
    return Math.abs(fallbackIndex) % FALLBACK_IMAGE_URLS.length;
  }, [fallbackIndex]);
  const imageCrossOrigin =
    src.includes("images.unsplash.com") || src.includes("source.unsplash.com")
    ? "anonymous"
    : undefined;
  const tileStyle = {
    ...style,
    "--tile-brightness": brightness.toFixed(2),
  } as CSSProperties;

  const getPointCloudSource = () => {
    if (!tileRef.current) {
      return src;
    }
    const imageElement = tileRef.current.querySelector("img");
    return imageElement?.currentSrc || imageElement?.src || src;
  };

  const getImageElement = () => {
    if (!tileRef.current) {
      return null;
    }
    return tileRef.current.querySelector<HTMLImageElement>("img");
  };

  const triggerPointCloud = (
    callback:
      | ((
          element: HTMLElement,
          imageElement: HTMLImageElement | null,
          source: string,
        ) => void)
      | undefined,
  ) => {
    if (!tileRef.current || !callback) {
      return;
    }
    const imageElement = getImageElement();
    const source = getPointCloudSource();
    if (imageElement && imageElement.complete && imageElement.naturalWidth > 0) {
      callback(tileRef.current, imageElement, source);
      return;
    }
    if (imageElement) {
      const handleLoad = () => {
        if (tileRef.current) {
          callback(
            tileRef.current,
            imageElement,
            imageElement.currentSrc || imageElement.src || source,
          );
        }
      };
      imageElement.addEventListener("load", handleLoad, { once: true });
      return;
    }
    callback(tileRef.current, null, source);
  };

  if (pixelHeart) {
    return (
      <figure
        className={`heart-tile group relative flex shrink-0 items-center justify-center overflow-hidden bg-transparent ${className}`}
        style={tileStyle}
      >
        <div className="pixel-heart-grid grid h-full w-full grid-cols-9 grid-rows-8 gap-[1px] sm:gap-[1.5px]">
          {PIXEL_HEART_PATTERN.join("").split("").map((cell, index) => (
            <span
              key={`pixel-heart-cell-${index}`}
              data-active={cell === "1" ? "1" : "0"}
              className="pixel-heart-dot h-full w-full"
            />
          ))}
        </div>
      </figure>
    );
  }

  return (
    <figure
      ref={tileRef}
      className={`heart-tile group relative shrink-0 overflow-hidden ${className}`}
      style={tileStyle}
      onMouseEnter={() => {
        triggerPointCloud(onPointCloudEnter);
      }}
      onMouseMove={() => {
        triggerPointCloud(onPointCloudMove);
      }}
      onMouseLeave={() => {
        onPointCloudLeave?.();
      }}
    >
      <img
        src={src}
        alt={alt}
        crossOrigin={imageCrossOrigin}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          const target = event.currentTarget;
          const step = Number(target.dataset.fallbackStep || "0");
          const nextIndex = (fallbackBaseIndex + step * 5) % FALLBACK_IMAGE_URLS.length;
          const nextUrl = FALLBACK_IMAGE_URLS[nextIndex];

          if (step < FALLBACK_IMAGE_URLS.length && target.src !== nextUrl) {
            target.dataset.fallbackStep = String(step + 1);
            target.src = nextUrl;
            return;
          }

          target.onerror = null;
        }}
        className="h-full w-full object-cover [filter:brightness(var(--tile-brightness))_saturate(1.12)] transition-all duration-500 ease-premium group-hover:scale-[1.05] group-hover:[filter:brightness(calc(var(--tile-brightness)+0.12))_saturate(1.18)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-black/25 transition-all duration-500 ease-premium group-hover:shadow-tileGlow" />
    </figure>
  );
}
