import { useEffect, useMemo, useRef, useState } from "react";
import ImageTile from "./ImageTile";
import { getHeartImageCount, getHeartRows } from "../lib/heartMath";
import { fetchPortraitImages, getFallbackPortraitImages } from "../lib/unsplash";

export default function HeartGrid() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 767px)").matches;
  });
  const rows = useMemo(() => getHeartRows(isMobile), [isMobile]);
  const imageCount = useMemo(() => getHeartImageCount(rows), [rows]);
  const [images, setImages] = useState<string[]>(() =>
    getFallbackPortraitImages(imageCount),
  );
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
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
    <section className="relative z-10 mt-1 flex w-full justify-center sm:mt-2 lg:mt-3">
      <div
        ref={clusterRef}
        className="heart-cluster relative flex flex-col items-center will-change-transform"
      >
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-center"
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
                {segment.tiles.map((tile) => (
                  <ImageTile
                    key={tile.id}
                    src={
                      tile.imageIndex >= 0
                        ? images[tile.imageIndex % images.length]
                        : images[0]
                    }
                    pixelHeart={tile.pixelHeart}
                    brightness={tile.brightness}
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
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
