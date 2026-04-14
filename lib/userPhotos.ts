import { CURATED_IMAGE_URLS } from "./unsplash";

// This file is auto-generated when "Sync my photos" is called.
// Do not edit manually if you plan on using the sync command.
export const USER_PHOTOS: string[] = [
  "/photos/photo_6264829032880868894_y.jpg",
  "/photos/photo_6264829032880868895_y.jpg",
  "/photos/photo_6264829032880868896_y.jpg",
  "/photos/photo_6264829032880868897_y.jpg",
  "/photos/photo_6264829032880868898_y.jpg",
  "/photos/photo_6264829032880868899_y.jpg",
  "/photos/photo_6264829032880868900_y.jpg",
  "/photos/photo_6264829032880868901_y.jpg",
  "/photos/photo_6264829032880868902_y.jpg",
  "/photos/photo_6264829032880868903_y.jpg",
  "/photos/photo_6264829032880868904_y.jpg",
  "/photos/photo_6264829032880868905_y.jpg",
  "/photos/photo_6264829032880868906_y.jpg",
  "/photos/photo_6264829032880868907_y.jpg",
  "/photos/photo_6264829032880868908_y.jpg",
  "/photos/photo_6264829032880868909_y.jpg",
  "/photos/photo_6264829032880868910_y.jpg",
  "/photos/photo_6264829032880868911_y.jpg",
  "/photos/photo_6264829032880868912_y.jpg",
  "/photos/photo_6264829032880868913_y.jpg",
  "/photos/photo_6264829032880868914_y.jpg",
  "/photos/photo_6264829032880868915_y.jpg",
  "/photos/photo_6264829032880868916_y.jpg",
  "/photos/photo_6264829032880868917_y.jpg",
  "/photos/photo_6264829032880868918_y.jpg",
  "/photos/photo_6264829032880868919_y.jpg",
  "/photos/photo_6264829032880868920_y.jpg",
  "/photos/photo_6264829032880868921_y.jpg",
  "/photos/photo_6264829032880868922_y.jpg",
  "/photos/photo_6264829032880868923_y.jpg"
];

export const getHeartImages = (count: number): string[] => {
  const photos = USER_PHOTOS.length > 0 ? USER_PHOTOS : [...CURATED_IMAGE_URLS];
  
  if (count <= 0) return [];
  
  return Array.from({ length: count }, (_, index) => {
    return photos[index % photos.length];
  });
};
