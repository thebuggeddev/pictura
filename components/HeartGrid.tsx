import { useEffect, useMemo, useRef, useState } from "react";
import ImageTile from "./ImageTile";
import {
  getHeartImageCount,
  getHeartRows,
  type HeartViewport,
} from "../lib/heartMath";
import {
  fetchPortraitImages,
  getFallbackPortraitImages,
} from "../lib/unsplash";

const IMAGE_POSITION_OVERRIDES: Record<string, string> = {
  "0-3":
    "https://images.unsplash.com/photo-1623567533471-2c789007ce34?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "1-4":
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&h=900&fit=crop&auto=format",
};

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

export default function HeartGrid() {
  const [viewport, setViewport] = useState<HeartViewport>(() =>
    resolveViewport(),
  );
  const rows = useMemo(() => getHeartRows(viewport), [viewport]);
  const imageCount = useMemo(() => getHeartImageCount(rows), [rows]);
  const [images, setImages] = useState<string[]>(() =>
    getFallbackPortraitImages(imageCount),
  );
  const clusterRef = useRef<HTMLDivElement>(null);

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
    let active = true;
    setImages(getFallbackPortraitImages(imageCount));
    fetchPortraitImages(imageCount).then((response) => {
      if (active && response.length > 0) {
        setImages(response);
      }
    });
    return () => {
      active = false;
    };
  }, [imageCount]);

  return (
    <section className="heart-scroll-trigger relative z-10 mt-1 flex w-full justify-center px-2 sm:mt-2 sm:px-0 lg:mt-3">
      <div
        ref={clusterRef}
        className="heart-cluster relative flex flex-col items-center will-change-transform"
      >
        {rows.map((row, rowIndex) => {
          let rowTileIndex = -1;

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
                    rowTileIndex += 1;
                    const defaultSrc =
                      tile.imageIndex >= 0
                        ? images[tile.imageIndex % images.length]
                        : images[0];
                    const overrideSrc =
                      IMAGE_POSITION_OVERRIDES[`${rowIndex}-${rowTileIndex}`];
                    const tileSrc = overrideSrc ?? defaultSrc;

                    return (
                      <ImageTile
                        key={tile.id}
                        src={tileSrc}
                        pixelHeart={tile.pixelHeart}
                        brightness={tile.brightness}
                        className={`heart-grid-tile ${tile.pixelHeart ? "pixel-heart-tile" : ""}`}
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
    </section>
  );
}
