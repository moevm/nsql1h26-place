import type { GeoJSONLineString, GeoJSONPoint, GeoJSONPolygon, LatLon } from '../../../models/GeoJSON';
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

export const buildCircleArea = (
    center: GeoJSONPoint,
    radiusMeters: number,
    steps = 36,
): GeoJSONPolygon => {
    const [lat, lon] = center.coordinates;
    const safeRadius = Math.max(0, radiusMeters);
    const safeSteps = Math.max(3, steps);
    const latRad = (lat * Math.PI) / 180;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLon = Math.cos(latRad) * 111320;
    const latDelta = safeRadius / metersPerDegreeLat;
    const lonDelta = metersPerDegreeLon === 0 ? 0 : safeRadius / metersPerDegreeLon;

    const points: LatLon[] = [];

    for (let i = 0; i < safeSteps; i += 1) {
        const angle = (i / safeSteps) * Math.PI * 2;
        const pointLat = lat + latDelta * Math.sin(angle);
        const pointLon = lon + lonDelta * Math.cos(angle);
        points.push([pointLat, pointLon]);
    }

    points.push(points[0]);

    return {
        type: 'Polygon',
        coordinates: [points],
    };
};
