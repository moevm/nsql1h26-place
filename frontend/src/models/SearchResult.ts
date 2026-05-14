export type SearchCategory = 'maps' | 'points' | 'routes' | 'areas';

export type SearchResult = {
    id: string;
    category: SearchCategory;
    title: string;
    description: string;
    map_id: string | null;
    image_path: string;
    tags: string[];
};
