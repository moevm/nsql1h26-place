export type Coordinates = {
    x: number;
    y: number;
};

export type Point = {
    _id: string;
    map_id: string;
    name: string;
    description: string;
    tag: string;
    coordinates: Coordinates;
    created_at: string;
    updated_at: string;
    image_path: string;
};

export type CreatePoint = {
    map_id: string;
    name: string;
    coordinates: Coordinates;
    description: string;
    tag: string | null;
    image_path: string;
};

export type UpdatePoint = {
    name?: string;
    description?: string;
    tag?: string;
    coordinates?: Coordinates;
};