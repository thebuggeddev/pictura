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

interface HeartRowBlueprint {
  segments: number[];
  size: number;
  gap: number;
  rowGap: number;
  segmentGap?: number;
  pixelHeartAt?: number;
}

const DESKTOP_BLUEPRINT: HeartRowBlueprint[] = [
  { segments: [2, 2], size: 84, gap: 6, segmentGap: 36, rowGap: 8 },
  { segments: [7], size: 72, gap: 5, rowGap: 7 },
  { segments: [7], size: 56, gap: 5, rowGap: 7, pixelHeartAt: 3 },
  { segments: [7], size: 47, gap: 5, rowGap: 6 },
  { segments: [8], size: 30, gap: 4, rowGap: 6 },
  { segments: [8], size: 26, gap: 4, rowGap: 5 },
  { segments: [6], size: 24, gap: 4, rowGap: 5 },
  { segments: [4], size: 22, gap: 3, rowGap: 4 },
  { segments: [2], size: 20, gap: 3, rowGap: 0 },
];

const MOBILE_BLUEPRINT: HeartRowBlueprint[] = [
  { segments: [2, 2], size: 54, gap: 4, segmentGap: 22, rowGap: 6 },
  { segments: [6], size: 44, gap: 4, rowGap: 5 },
  { segments: [6], size: 36, gap: 4, rowGap: 5, pixelHeartAt: 3 },
  { segments: [6], size: 30, gap: 4, rowGap: 5 },
  { segments: [7], size: 23, gap: 3, rowGap: 5 },
  { segments: [6], size: 20, gap: 3, rowGap: 4 },
  { segments: [4], size: 18, gap: 3, rowGap: 4 },
  { segments: [2], size: 16, gap: 3, rowGap: 0 },
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

export const getHeartRows = (isMobile: boolean): HeartRow[] => {
  return createHeartRows(isMobile ? MOBILE_BLUEPRINT : DESKTOP_BLUEPRINT);
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
