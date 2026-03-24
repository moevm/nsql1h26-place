export type LngLat = [number, number];

export type GeoJSONPoint = {
    type: 'Point';
    coordinates: LngLat;
};

export type GeoJSONLineString = {
    type: 'LineString';
    coordinates: LngLat[];
};

export type GeoJSONPolygon = {
    type: 'Polygon';
    coordinates: LngLat[][];
};

export type GeoJSONGeometry = GeoJSONPoint | GeoJSONLineString | GeoJSONPolygon;