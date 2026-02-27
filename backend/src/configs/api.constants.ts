import config from './config';

export const API_ENDPOINTS = {
    users: `${config.baseUrl}/users`,
    albums: `${config.baseUrl}/albums`,
    photos: `${config.baseUrl}/photos`,
    photo: (id: number) => `${config.baseUrl}/photos/${id}`,
} as const;

export const DEFAULT_PAGINATION_LIMIT = 25 as const;
export const DEFAULT_PAGINATION_OFFSET = 0 as const;
