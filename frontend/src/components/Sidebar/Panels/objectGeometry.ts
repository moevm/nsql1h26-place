import type { GeoJSONLineString, GeoJSONPoint, GeoJSONPolygon } from '../../../models/GeoJSON';
import type { Map } from '../../../models/Map';

export const getMapCenterPoint = (map: Map | null): GeoJSONPoint | null => {
    if (!map) {
        return null;
    }

    const { location } = map;

    if (location.type === 'Point') {
        const [lat, lon] = location.coordinates;

        return {
            type: 'Point',
            coordinates: [lat, lon],
        };
    }

    if (location.type === 'LineString') {
        const first = location.coordinates[0];
        if (!first) {
            return null;
        }

        const [lat, lon] = first;

        return {
            type: 'Point',
            coordinates: [lat, lon],
        };
    }

    const first = location.coordinates[0]?.[0];
    if (!first) {
        return null;
    }

    const [lat, lon] = first;

    return {
        type: 'Point',
        coordinates: [lat, lon],
    };
};

export const buildDefaultRoute = (center: GeoJSONPoint): GeoJSONLineString => {
    const [lat, lon] = center.coordinates;

    return {
        type: 'LineString',
        coordinates: [
            [lat - 0.003, lon - 0.002],
            [lat, lon],
            [lat + 0.003, lon + 0.002],
        ],
    };
};

export const buildDefaultArea = (center: GeoJSONPoint): GeoJSONPolygon => {
    const [lat, lon] = center.coordinates;
    const latDelta = 0.002;
    const lonDelta = 0.0015;

    return {
        type: 'Polygon',
        coordinates: [[
            [lat - latDelta, lon - lonDelta],
            [lat + latDelta, lon - lonDelta],
            [lat + latDelta, lon + lonDelta],
            [lat - latDelta, lon + lonDelta],
            [lat - latDelta, lon - lonDelta],
        ]],
    };
};
