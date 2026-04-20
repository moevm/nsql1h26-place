import type { GeoJSONGeometry, GeoJSONLineString, GeoJSONPoint, GeoJSONPolygon } from './GeoJSON';

export type MapObjectType = 'Point' | 'Area' | 'Route';

type MapObjectBase = {
    _id: string;
    map_id: string;
    name: string;
    description: string;
    tags: string[];
    created_at: string;
    updated_at: string;
    image_path: string;
};

export type PointMapObject = MapObjectBase & {
    type: 'Point';
    location: GeoJSONPoint;
};

export type AreaMapObject = MapObjectBase & {
    type: 'Area';
    location: GeoJSONPolygon;
};

export type RouteMapObject = MapObjectBase & {
    type: 'Route';
    location: GeoJSONLineString;
};

export type MapObject = PointMapObject | AreaMapObject | RouteMapObject;

type CreateMapObjectBase = {
    map_id: string;
    name: string;
    description: string;
    tags: string[];
    image_path: string;
};

export type CreatePointMapObject = CreateMapObjectBase & {
    type: 'Point';
    location: GeoJSONPoint;
};

export type CreateAreaMapObject = CreateMapObjectBase & {
    type: 'Area';
    location: GeoJSONPolygon;
};

export type CreateRouteMapObject = CreateMapObjectBase & {
    type: 'Route';
    location: GeoJSONLineString;
};

export type CreateMapObject = CreatePointMapObject | CreateAreaMapObject | CreateRouteMapObject;

export type MapObjectByType<T extends MapObjectType> = Extract<MapObject, { type: T }>;

export type UpdateMapObject = {
    type?: MapObjectType;
    name?: string;
    description?: string;
    tags?: string[];
    location?: GeoJSONGeometry;
    image_path?: string;
};