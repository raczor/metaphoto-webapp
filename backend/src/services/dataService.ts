import axios from 'axios';
import { User, Album, Photo, EnrichedPhoto } from '../types';
import { API_ENDPOINTS } from '../configs/api.constants';
import cacheService from "./cache";

const CACHE_KEYS = {
  users: 'users',
  albums: 'albums',
  photos: 'photos',
  enrichedPhotos: 'enriched_photos',
} as const;

async function fetchWithCache<T>(key: string, url: string): Promise<T> {
  const cached = await cacheService.get<T>(key);
  if (cached) {
    return cached;
  }

  const { data } = await axios.get<T>(url);
  cacheService.set(key, data);
  return data;
}

async function getAllUsers() {
  return fetchWithCache<User[]>(CACHE_KEYS.users, API_ENDPOINTS.users);
}

async function getAllAlbums() {
  return fetchWithCache<Album[]>(CACHE_KEYS.albums, API_ENDPOINTS.albums);
}

async function getAllPhotos() {
  return fetchWithCache<Photo[]>(CACHE_KEYS.photos, API_ENDPOINTS.photos);
}

async function getPhoto(id: number) {
  return fetchWithCache(`photo_${id}`, API_ENDPOINTS.photo(id));
}

export async function buildEnrichedPhotos(forceRefresh: boolean = false): Promise<EnrichedPhoto[]> {
  if (forceRefresh) {
    await cacheService.invalidate(CACHE_KEYS.enrichedPhotos);
  }

  const cached = await cacheService.get<EnrichedPhoto[]>(CACHE_KEYS.enrichedPhotos);
  if (cached) {
    return cached;
  }

  const [photos, albums, users] = await Promise.all([
    getAllPhotos(),
    getAllAlbums(),
    getAllUsers(),
  ]);

  const albumMap: Record<number, Album> = {};
  albums.forEach(a => albumMap[a.id] = a);

  const userMap: Record<number, User> = {};
  users.forEach(u => userMap[u.id] = u);

  const enriched: EnrichedPhoto[] = photos.map(photo => {
    const album: Album = albumMap[photo.albumId] || null;
    const user: User | null = album ? userMap[album.userId] || null : null;

    return {
      id: photo.id,
      title: photo.title,
      loweredCaseTitle: photo.title.toLowerCase(),
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      album: album ? { id: album.id,
        title: album.title,
        loweredCaseTitle: album.title.toLowerCase(),
        user } : null,
    };
  });

  cacheService.set(CACHE_KEYS.enrichedPhotos, enriched);
  return enriched;
}

export async function getEnrichedPhoto(id: number): Promise<EnrichedPhoto | null> {
  const all = await buildEnrichedPhotos();
  const photo = all.find(p => p.id === id);

  if (!photo) {
    const refreshed = await buildEnrichedPhotos(true);
    return refreshed.find(p => p.id === id) || null;
  }

  return photo;
}
