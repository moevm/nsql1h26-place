export type Coordinates = {
    x: number;
    y: number;
};

export type Map = {
    _id: string;
    user_id: string;
    name: string;
    description: string;
    country: string;
    area: string;
    coordinates: Coordinates;
    visible: boolean;
    tags: string[];
    image_path: string;
    created_at: string;
    updated_at: string;
};

export type CreateMap = {
    user_id: string;
    name: string;
    coordinates: Coordinates;
    description: string;
    country: string;
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
    coordinates?: Coordinates;
};