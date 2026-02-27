import { User } from './user.types';

export interface Photo {
    id: number;
    albumId: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export interface EnrichedPhoto {
    id: number;
    title: string;
    loweredCaseTitle: string;
    url: string;
    thumbnailUrl: string;
    album: {
        id: number;
        title: string;
        loweredCaseTitle: string;
        user: User | null;
    } | null;
}