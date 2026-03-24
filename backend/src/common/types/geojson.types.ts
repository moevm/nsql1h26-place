import type { LineString, Point, Polygon } from 'geojson';

export type GeoJSONGeometry = Point | LineString | Polygon;

export enum ObjectType {
    POINT = 'Point',
    AREA = 'Area',
    ROUTE = 'Route'
};