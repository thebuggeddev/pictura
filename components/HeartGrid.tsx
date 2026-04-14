import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ImageTile from "./ImageTile";
import FullScreenImage from "./FullScreenImage";
import {
  getHeartImageCount,
  getHeartRows,
  type HeartViewport,
} from "../lib/heartMath";
import {
  fetchPortraitImages,
  getFallbackPortraitImages,
} from "../lib/unsplash";
import { getHeartImages } from "../lib/userPhotos";
import PointCloudHover from "./PointCloudHover";

const resolveViewport = (): HeartViewport => {
  if (typeof window === "undefined") {
    return "desktop";
  }
  if (window.matchMedia("(max-width: 767px)").matches) {
    return "mobile";
  }
  if (window.matchMedia("(max-width: 1200px)").matches) {
    return "tablet";
  }
  return "desktop";
};

interface HoverRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface HoverState {
  rect: HoverRect;
  src: string;
  imageElement: HTMLImageElement | null;
}

const toImageKey = (url: string): string => {
  try {
    const parsed = new URL(url);
    const photoMatch = parsed.pathname.match(/\/photo-([^/?]+)/);
    if (photoMatch?.[1]) {
      return photoMatch[1];
    }
    return `${parsed.origin}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
};

const dedupeAndFillImages = (incoming: string[], fallback: string[], count: number) => {
  const seen = new Set<string>();
  const unique: string[] = [];

  const append = (url: string) => {
    if (!url || unique.length >= count) {
      return;
    }
    const key = toImageKey(url);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    unique.push(url);
  };

  incoming.forEach(append);
  fallback.forEach(append);

  if (unique.length < count && fallback.length > 0) {
    for (let index = unique.length; index < count; index += 1) {
      const cycled = fallback[index % fallback.length];
      if (cycled) {
        unique.push(`${cycled}&fill=${index + 1}`);
      }
    }
  }

  return unique.slice(0, count);
};

const getElementRect = (element: HTMLElement): HoverRect => {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

export default function HeartGrid() {
  const [viewport, setViewport] = useState<HeartViewport>(() =>
    resolveViewport(),
  );
  const rows = useMemo(() => getHeartRows(viewport), [viewport]);
  const imageCount = useMemo(() => getHeartImageCount(rows), [rows]);
  const [images, setImages] = useState<string[]>(() =>
    getHeartImages(imageCount),
  );
  const clusterRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<HoverState | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const handlePointCloudEnter = useCallback(
    (
      element: HTMLElement,
      imageElement: HTMLImageElement | null,
      src: string,
    ) => {
      setHoverState({
        src,
        imageElement,
        rect: getElementRect(element),
      });
    },
    [],
  );

  const handlePointCloudMove = useCallback(
    (
      element: HTMLElement,
      imageElement: HTMLImageElement | null,
      src: string,
    ) => {
      setHoverState((previous) => {
        const nextRect = getElementRect(element);
        if (
          previous &&
          previous.src === src &&
          previous.imageElement === imageElement &&
          Math.abs(previous.rect.left - nextRect.left) < 0.5 &&
          Math.abs(previous.rect.top - nextRect.top) < 0.5 &&
          Math.abs(previous.rect.width - nextRect.width) < 0.5 &&
          Math.abs(previous.rect.height - nextRect.height) < 0.5
        ) {
          return previous;
        }
        return {
          src,
          imageElement,
          rect: nextRect,
        };
      });
    },
    [],
  );

  const handlePointCloudLeave = useCallback(() => {
    setHoverState(null);
  }, []);

  const handleDoubleTap = useCallback((src: string) => {
    setExpandedImage(src);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(max-width: 1200px)");
    const onChange = () => {
      setViewport(resolveViewport());
    };
    setViewport(resolveViewport());
    mobileQuery.addEventListener("change", onChange);
    tabletQuery.addEventListener("change", onChange);
    return () => {
      mobileQuery.removeEventListener("change", onChange);
      tabletQuery.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    setImages(getHeartImages(imageCount));
  }, [imageCount]);

  useEffect(() => {
    const clearHover = () => {
      setHoverState(null);
    };
    window.addEventListener("scroll", clearHover, { passive: true });
    window.addEventListener("resize", clearHover);
    return () => {
      window.removeEventListener("scroll", clearHover);
      window.removeEventListener("resize", clearHover);
    };
  }, []);

  return (
    <section className="heart-scroll-trigger relative z-10 mt-1 flex w-full justify-center px-2 sm:mt-2 sm:px-0 lg:mt-3">
      <div
        ref={clusterRef}
        className="heart-cluster relative flex flex-col items-center will-change-transform"
      >
        {rows.map((row, rowIndex) => {
          return (
            <div
              key={row.id}
              className={`heart-row heart-row-${rowIndex} flex items-center justify-center`}
              style={{
                gap: `${row.segmentGap}px`,
                marginBottom: `${row.rowGap}px`,
              }}
            >
              {row.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="flex items-center justify-center"
                  style={{
                    gap: `${row.gap}px`,
                  }}
                >
                  {segment.tiles.map((tile) => {
                    const tileSrc =
                      tile.imageIndex >= 0
                        ? images[tile.imageIndex % images.length]
                        : images[0];

                    return (
                      <ImageTile
                        key={tile.id}
                        src={tileSrc}
                        fallbackIndex={tile.imageIndex}
                        pixelHeart={tile.pixelHeart}
                        brightness={tile.brightness}
                        className={`heart-grid-tile ${tile.pixelHeart ? "pixel-heart-tile" : "point-cloud-source"}`}
                        onPointCloudEnter={
                          tile.pixelHeart ? undefined : handlePointCloudEnter
                        }
                        onPointCloudMove={
                          tile.pixelHeart ? undefined : handlePointCloudMove
                        }
                        onPointCloudLeave={
                          tile.pixelHeart ? undefined : handlePointCloudLeave
                        }
                        onDoubleTap={
                          tile.pixelHeart ? undefined : handleDoubleTap
                        }
                        alt={
                          tile.pixelHeart
                            ? "Decorative pixel heart tile"
                            : `Portrait tile ${tile.imageIndex + 1}`
                        }
                        style={{
                          width: tile.size,
                          height: tile.size,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <PointCloudHover hoverState={hoverState} />
      {expandedImage && (
        <FullScreenImage
          src={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      )}
    </section>
  );
}
