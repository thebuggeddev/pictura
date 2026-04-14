export interface HeartTile {
  id: string;
  row: number;
  size: number;
  brightness: number;
  imageIndex: number;
  pixelHeart: boolean;
}

export interface HeartSegment {
  id: string;
  tiles: HeartTile[];
}

export interface HeartRow {
  id: string;
  gap: number;
  rowGap: number;
  segmentGap: number;
  segments: HeartSegment[];
}

export type HeartViewport = "mobile" | "tablet" | "desktop";

interface HeartRowBlueprint {
  segments: number[];
  size: number;
  gap: number;
  rowGap: number;
  segmentGap?: number;
  pixelHeartAt?: number;
}

const DESKTOP_BLUEPRINT: HeartRowBlueprint[] = [
  { segments: [2, 2], size: 136, gap: 7, segmentGap: 40, rowGap: 9 },
  { segments: [7], size: 116, gap: 6, rowGap: 8 },
  { segments: [7], size: 91, gap: 6, rowGap: 8, pixelHeartAt: 3 },
  { segments: [7], size: 77, gap: 6, rowGap: 7 },
  { segments: [8], size: 49, gap: 5, rowGap: 10 },
  { segments: [8], size: 42, gap: 7, rowGap: 10 },
  { segments: [6], size: 38, gap: 4, rowGap: 6 },
  { segments: [4], size: 36, gap: 4, rowGap: 5 },
  { segments: [2], size: 31, gap: 3, rowGap: 0 },
];

const MOBILE_BLUEPRINT: HeartRowBlueprint[] = [
  { segments: [2, 2], size: 88, gap: 4, segmentGap: 24, rowGap: 7 },
  { segments: [6], size: 71, gap: 4, rowGap: 6 },
  { segments: [6], size: 58, gap: 4, rowGap: 6, pixelHeartAt: 3 },
  { segments: [6], size: 49, gap: 4, rowGap: 6 },
  { segments: [7], size: 37, gap: 3, rowGap: 7 },
  { segments: [6], size: 31, gap: 5, rowGap: 7 },
  { segments: [4], size: 29, gap: 3, rowGap: 4 },
  { segments: [2], size: 26, gap: 3, rowGap: 0 },
];

const TABLET_BLUEPRINT: HeartRowBlueprint[] = [
  { segments: [2, 2], size: 116, gap: 6, segmentGap: 34, rowGap: 9 },
  { segments: [7], size: 100, gap: 5, rowGap: 8 },
  { segments: [7], size: 79, gap: 5, rowGap: 8, pixelHeartAt: 3 },
  { segments: [7], size: 67, gap: 5, rowGap: 7 },
  { segments: [8], size: 43, gap: 4, rowGap: 9 },
  { segments: [8], size: 38, gap: 6, rowGap: 9 },
  { segments: [6], size: 36, gap: 4, rowGap: 6 },
  { segments: [4], size: 31, gap: 3, rowGap: 5 },
  { segments: [2], size: 29, gap: 3, rowGap: 0 },
];

const createHeartRows = (blueprint: HeartRowBlueprint[]): HeartRow[] => {
  let imageIndex = 0;

  return blueprint.map((rowBlueprint, row) => {
    let rowTileIndex = 0;
    const segments = rowBlueprint.segments.map((segmentCount, segmentIndex) => {
      const tiles: HeartTile[] = Array.from({ length: segmentCount }, (_, tileIndex) => {
        const isPixelHeart = rowBlueprint.pixelHeartAt === rowTileIndex;
        const brightness =
          isPixelHeart
            ? 1
            : 0.84 + ((row * 11 + segmentIndex * 5 + tileIndex * 3) % 5) * 0.035;

        const tile: HeartTile = {
          id: `tile-${row}-${segmentIndex}-${tileIndex}`,
          row,
          size: rowBlueprint.size,
          brightness,
          imageIndex: isPixelHeart ? -1 : imageIndex,
          pixelHeart: isPixelHeart,
        };

        rowTileIndex += 1;
        if (!isPixelHeart) {
          imageIndex += 1;
        }

        return tile;
      });

      return {
        id: `segment-${row}-${segmentIndex}`,
        tiles,
      };
    });

    return {
      id: `row-${row}`,
      gap: rowBlueprint.gap,
      rowGap: rowBlueprint.rowGap,
      segmentGap: rowBlueprint.segmentGap ?? 0,
      segments,
    };
  });
};

export const getHeartRows = (viewport: HeartViewport): HeartRow[] => {
  if (viewport === "mobile") {
    return createHeartRows(MOBILE_BLUEPRINT);
  }
  if (viewport === "tablet") {
    return createHeartRows(TABLET_BLUEPRINT);
  }
  return createHeartRows(DESKTOP_BLUEPRINT);
};

export const getHeartImageCount = (rows: HeartRow[]): number => {
  return rows.reduce((sum, row) => {
    const count = row.segments.reduce((segmentSum, segment) => {
      const tileCount = segment.tiles.filter((tile) => !tile.pixelHeart).length;
      return segmentSum + tileCount;
    }, 0);
    return sum + count;
  }, 0);
};
