const FIXED_IMAGE_URL =
  "https://images.unsplash.com/photo-1770034285769-4a5a3f410346?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const CURATED_UNSPLASH_IDS = [
  "WEJZwgNcNWg",
  "bLjlMU1vc54",
  "q3H-wd12Cb4",
  "NqQPfpgFxLI",
  "d2xBtIJ5KTw",
  "xxRT5LtdVlE",
  "nYGMnyZHR2I",
  "_wG-sQ40_H4",
  "edlL1vvGcLI",
  "jJ-sxA58Or4",
  "fYx7mQHxVEw",
  "OExIl3ioFPw",
  "U6qp3qpCF3I",
  "AOiBDWRnaRs",
  "LZzzPAoXyn0",
  "vii9pN5393Q",
  "1JfgQc_P0XQ",
  "KILylfMiuVY",
  "-gq-d4sQHDs",
  "ShhYgCQS778",
  "xr5i10isWU0",
  "j1lwHZlHrU0",
  "IMGxX_mKiNs",
  "LNljMD3OaVI",
  "Iaj87oR-MWw",
  "1QXZa2SNwWE",
  "ItpNQK05INA",
  "2gSN1tuv11Q",
  "Qpab-4wvpeA",
  "ZdkFcak1PIo",
  "Z2PahC-Fi08",
  "i27V8_1d2eQ",
  "CIQtp39DAAQ",
  "lftiUidW9AQ",
  "OYPP93y14eA",
  "owGeIH7usUo",
  "DD0awdH-v_c",
  "lfPhku3hH-A",
  "z-zB9Kx4qV0",
  "X6TeCDUTZGU",
  "-gmetXsQxso",
  "Np2RoHxcwak",
  "676mDEaVVeA",
  "3WEwPFnkQlE",
  "RuZguCyUmE0",
  "jXY_s0j4A1w",
  "pfZ3z9XTUzI",
  "1GFJWhuKpsA",
  "IBxBj382lIk",
  "UxU21BkFXnA",
  "8qSdQ6jml0Q",
  "58C3F85SYXM",
] as const;

const buildUnsplashDownloadUrl = (id: string): string => {
  const params = new URLSearchParams({
    force: "true",
    w: "640",
    h: "640",
    fit: "crop",
    q: "80",
    auto: "format",
  });
  return `https://unsplash.com/photos/${id}/download?${params.toString()}`;
};

const CURATED_IMAGE_URLS = CURATED_UNSPLASH_IDS.map((id) =>
  buildUnsplashDownloadUrl(id),
);

const buildFallbackImages = (count: number): string[] => {
  if (count <= CURATED_IMAGE_URLS.length) {
    return CURATED_IMAGE_URLS.slice(0, count);
  }

  const images = [...CURATED_IMAGE_URLS];
  for (let index = images.length; index < count; index += 1) {
    images.push(`${FIXED_IMAGE_URL}&sig=${index + 1}`);
  }
  return images;
};

export const getFallbackPortraitImages = (count: number): string[] => {
  return buildFallbackImages(count);
};

export const fetchPortraitImages = async (count: number): Promise<string[]> => {
  return buildFallbackImages(count);
};
