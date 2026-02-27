export interface Geo {
    lat: string;
    lng: string;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

export interface Album {
    id: number;
    title: string;
    user: User | null;
}

export interface EnrichedPhoto {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
    album: Album | null;
}

export interface Filters {
    title: string;
    albumTitle: string;
    albumUserEmail: string;
}

export interface PhotosResponse {
    total: number;
    limit: number;
    offset: number;
    data: EnrichedPhoto[];
}