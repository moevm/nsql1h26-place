type Coordinate = [number, number];
type Ring = Coordinate[];

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const isValidCoord = (v: unknown): v is Coordinate =>
  Array.isArray(v) &&
  v.length >= 2 &&
  isFiniteNumber(v[0]) &&
  isFiniteNumber(v[1]) &&
  v[0] >= -180 &&
  v[0] <= 180 &&
  v[1] >= -90 &&
  v[1] <= 90;

const isClosedRing = (ring: Ring): boolean =>
  ring.length >= 4 &&
  ring[0][0] === ring[ring.length - 1][0] &&
  ring[0][1] === ring[ring.length - 1][1];

export const validateGeoJSONGeometry = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') return false;
  const geo = value as { type?: unknown; coordinates?: unknown };

  if (geo.type === 'Point') {
    return isValidCoord(geo.coordinates);
  }

  if (geo.type === 'LineString') {
    return (
      Array.isArray(geo.coordinates) &&
      geo.coordinates.length >= 2 &&
      geo.coordinates.every(isValidCoord)
    );
  }

  if (geo.type === 'Polygon') {
    return (
      Array.isArray(geo.coordinates) &&
      geo.coordinates.length >= 1 &&
      geo.coordinates.every(
        (ring: unknown) => Array.isArray(ring) && ring.every(isValidCoord) && isClosedRing(ring as Ring),
      )
    );
  }

  return false;
};
