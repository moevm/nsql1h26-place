import type { GeoJSONGeometry } from './GeoJSON';

export type Map = {
    _id: string;
    user_id: string;
    name: string;
    description: string;
    area: string;
    location: GeoJSONGeometry;
    visible: boolean;
    tags: string[];
    image_path: string;
    created_at: string;
    updated_at: string;
};

export type CreateMap = {
    name: string;
    location: GeoJSONGeometry;
    description: string;
    area: string;
    visible: boolean;
    tags: string[];
    image_path: string;
};

export type UpdateMap = {
    name?: string;
    description?: string;
    visible?: boolean;
    tags?: string[];
    location?: GeoJSONGeometry;
};