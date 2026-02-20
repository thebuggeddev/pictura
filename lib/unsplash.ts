const FIXED_IMAGE_URL =
  "https://images.unsplash.com/photo-1770034285769-4a5a3f410346?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const CURATED_UNSPLASH_IDS = [
  "C3V88BOoRoM",
  "hGV2TfOh0ns",
  "QwAL909kTiY",
  "dAmHWsRYP9c",
  "744oGeqpxPQ",
  "-8a5eJ1-mmQ",
  "ztYmIQecyH4",
  "hpjSkU2UYSU",
  "nWvWBV0sv04",
  "Hcfwew744z4",
  "KEMb3TSbZBc",
  "eBWzFKahEaU",
  "eveI7MOcSmw",
  "Z8I-BhVtzn0",
  "m_HRfLhgABo",
  "oRKF_ZBJYGM",
  "lvWw_G8tKsk",
  "QLqNalPe0RA",
  "KzKFuvbZz2Q",
  "YXl2LXviw_Y",
  "ute2XAFQU2I",
  "5x7Zl8QXFvg",
  "rkkMvTwmitA",
  "W1B2LpQOBxA",
  "iUDZ79JHf58",
  "BaSeK7rwc1A",
  "7I5A7630GpY",
  "0QvTyp0gH3A",
  "o7TMfcX815s",
  "R3KpH1W4Deo",
  "i-t4zL1Nqc0",
  "a4maTFz1QPc",
  "To2HQm-4688",
  "DkubwfzdKsc",
  "JoKS3XweV50",
  "eHD8Y1Znfpk",
  "U2BI3GMnSSE",
  "nApaSgkzaxg",
  "GdRvIi8mWzE",
  "WHWYBmtn3_0",
  "PNodyzJcccA",
  "fZyRI4MSUiI",
  "LghgciPTH6o",
  "3ijHgGTSDi8",
  "qW1Iob14q-Q",
  "0IVop5v4MMU",
  "xcgh5_-QIXc",
  "hTUZW7E7krg",
  "Of5Q41Gnxzo",
  "-A_Sod5xVDY",
  "PP4LPGM3gHg",
  "pFqrYbhIAXs",
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
