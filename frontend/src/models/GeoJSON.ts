export type LatLon = [lat: number, lon: number];

export type GeoJSONPoint = {
    type: 'Point';
    coordinates: LatLon;
};

export type GeoJSONLineString = {
    type: 'LineString';
    coordinates: LatLon[];
};

export type GeoJSONPolygon = {
    type: 'Polygon';
    coordinates: LatLon[][];
};

export type GeoJSONGeometry = GeoJSONPoint | GeoJSONLineString | GeoJSONPolygon;