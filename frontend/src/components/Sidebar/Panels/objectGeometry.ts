import type { GeoJSONLineString, GeoJSONPoint, GeoJSONPolygon } from '../../../models/GeoJSON';
import type { Map } from '../../../models/Map';

export const getMapCenterPoint = (map: Map | null): GeoJSONPoint | null => {
    if (!map) {
        return null;
    }

    const { location } = map;

    if (location.type === 'Point') {
        return {
            type: 'Point',
            coordinates: [...location.coordinates] as [number, number],
        };
    }

    if (location.type === 'LineString') {
        const first = location.coordinates[0];
        if (!first) {
            return null;
        }

        return {
            type: 'Point',
            coordinates: [first[0], first[1]],
        };
    }

    const first = location.coordinates[0]?.[0];
    if (!first) {
        return null;
    }

    return {
        type: 'Point',
        coordinates: [first[0], first[1]],
    };
};

export const buildDefaultRoute = (center: GeoJSONPoint): GeoJSONLineString => {
    const [firstCoord, secondCoord] = center.coordinates;

    return {
        type: 'LineString',
        coordinates: [
            [firstCoord - 0.003, secondCoord - 0.002],
            [firstCoord, secondCoord],
            [firstCoord + 0.003, secondCoord + 0.002],
        ],
    };
};

export const buildDefaultArea = (center: GeoJSONPoint): GeoJSONPolygon => {
    const [firstCoord, secondCoord] = center.coordinates;
    const dFirst = 0.002;
    const dSecond = 0.0015;

    return {
        type: 'Polygon',
        coordinates: [[
            [firstCoord - dFirst, secondCoord - dSecond],
            [firstCoord + dFirst, secondCoord - dSecond],
            [firstCoord + dFirst, secondCoord + dSecond],
            [firstCoord - dFirst, secondCoord + dSecond],
            [firstCoord - dFirst, secondCoord - dSecond],
        ]],
    };
};
