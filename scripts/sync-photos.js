import fs from 'fs';
import path from 'path';

const PHOTOS_DIR = path.join(process.cwd(), 'public', 'photos');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'userPhotos.ts');

const syncPhotos = () => {
  try {
    if (!fs.existsSync(PHOTOS_DIR)) {
      console.log('Photos directory does not exist.');
      return;
    }

    const files = fs.readdirSync(PHOTOS_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file)
    ).map(file => `/photos/${file}`);

    const content = `import { CURATED_IMAGE_URLS } from "./unsplash";

// This file is auto-generated when "Sync my photos" is called.
// Do not edit manually if you plan on using the sync command.
export const USER_PHOTOS: string[] = ${JSON.stringify(imageFiles, null, 2)};

export const getHeartImages = (count: number): string[] => {
  const photos = USER_PHOTOS.length > 0 ? USER_PHOTOS : [...CURATED_IMAGE_URLS];
  
  if (count <= 0) return [];
  
  return Array.from({ length: count }, (_, index) => {
    return photos[index % photos.length];
  });
};
`;

    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`Successfully synced ${imageFiles.length} photos!`);
    if (imageFiles.length === 0) {
      console.log('No photos found in public/photos. Using fallback Unsplash images.');
    }
  } catch (error) {
    console.error('Error syncing photos:', error);
  }
};

syncPhotos();
