import { EnrichedPhoto } from '../types/photo.types';

// The API serves square picsum images. Picsum can render the same seeded photo
// at any size, so the gallery asks for a per-photo aspect ratio to get a real
// masonry layout. Any other image host falls back to the URLs the API returned.
const PICSUM_SEED = /^https:\/\/picsum\.photos\/seed\/([^/]+)\/\d+$/;
const RATIOS = [1, 4 / 5, 3 / 4, 4 / 3, 1, 2 / 3, 16 / 10];

export interface SizedImage {
  src: string;
  ratio: number;
}

export function imageFor(photo: EnrichedPhoto, width: number): SizedImage {
  const match = PICSUM_SEED.exec(photo.url);
  if (!match) {
    return { src: width <= 400 ? photo.thumbnailUrl : photo.url, ratio: 1 };
  }
  const ratio = RATIOS[photo.id % RATIOS.length];
  const height = Math.round(width / ratio);
  return { src: `https://picsum.photos/seed/${match[1]}/${width}/${height}`, ratio };
}

export const FALLBACK_IMAGE = '/no-data.webp';
