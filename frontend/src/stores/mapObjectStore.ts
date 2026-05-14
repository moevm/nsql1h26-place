import { create } from 'zustand';
import type { ApiError } from '../api/hooks';
import type { LatLon } from '../models/GeoJSON';
import { type MapObject } from '../models/MapObject';

interface MapObjectStore {
    MapObjects: MapObject[];
    selectedMapObjectId: string | null;
    selectedMapObjectTick: number;
    pointPlacementActive: boolean;
    pointPlacementCoordinates: LatLon | null;
    sortBy: '_id' | 'name' | null;
    sortOrder: 'asc' | 'desc';
    routeDraftActive: boolean;
    routeDraftWaypoints: LatLon[];
    routeDraftHoveredIndex: number | null;
    routeDraftMapCenter: LatLon | null;
    areaDraftActive: boolean;
    areaDraftRadius: number;
    mapObjectsLoadingByPath: Record<string, boolean>;
    mapObjectsErrorByPath: Record<string, ApiError | undefined>;
    mapObjectsPageByPath: Record<string, number>;
    mapObjectsHasMoreByPath: Record<string, boolean>;
    mapObjectsInitializedByPath: Record<string, boolean>;

    setSelectedMapObjectId: (selectedMapObjectId: string | null) => void;

    setMapObjects: (MapObjects: MapObject[]) => void;
    setMapObjectsByType: (type: string, MapObjects: MapObject[]) => void;
    appendMapObjects: (MapObjects: MapObject[]) => void;
    addMapObject: (MapObject: MapObject) => void;
    updateMapObject: (MapObject: MapObject) => void;
    removeMapObject: (id: string) => void;
    setPointPlacementActive: (active: boolean) => void;
    setPointPlacementCoordinates: (coordinates: LatLon | null) => void;
    startRouteDraft: () => void;
    stopRouteDraft: () => void;
    addRouteDraftWaypoint: (waypoint: LatLon) => void;
    updateRouteDraftWaypoint: (index: number, waypoint: LatLon) => void;
    removeRouteDraftWaypoint: (index: number) => void;
    reorderRouteDraftWaypoints: (fromIndex: number, toIndex: number) => void;
    setRouteDraftHoveredIndex: (index: number | null) => void;
    setRouteDraftMapCenter: (center: LatLon | null) => void;
    setAreaDraftActive: (active: boolean) => void;
    setAreaDraftRadius: (radius: number) => void;
    setSort: (field: '_id' | 'name' | null) => void;
    getSortedMapObjects: () => MapObject[];
}

export const useMapObjectStore = create<MapObjectStore>((set, get) => ({
    MapObjects: [],
    selectedMapObjectId: null,
    selectedMapObjectTick: 0,
    pointPlacementActive: false,
    pointPlacementCoordinates: null,
    sortBy: null,
    sortOrder: 'asc',
    routeDraftActive: false,
    routeDraftWaypoints: [],
    routeDraftHoveredIndex: null,
    routeDraftMapCenter: null,
    areaDraftActive: false,
    areaDraftRadius: 1,
    mapObjectsLoadingByPath: {},
    mapObjectsErrorByPath: {},
    mapObjectsPageByPath: {},
    mapObjectsHasMoreByPath: {},
    mapObjectsInitializedByPath: {},

    setMapObjects: (MapObjects) => set((state) => ({
        MapObjects,
        selectedMapObjectId: state.selectedMapObjectId ?? (MapObjects.length ? MapObjects[0]._id : null),
    })),
    setMapObjectsByType: (type, incoming) => set((state) => ({
        MapObjects: [
            ...state.MapObjects.filter((item) => item.type !== type),
            ...incoming,
        ],
    })),
    appendMapObjects: (MapObjects) => set((state) => {
        const existingIds = new Set(state.MapObjects.map((item) => item._id));
        const nextObjects = MapObjects.filter((item) => !existingIds.has(item._id));

        return {
            MapObjects: nextObjects.length ? [...state.MapObjects, ...nextObjects] : state.MapObjects,
        };
    }),
    setSelectedMapObjectId: (selectedMapObjectId) => set((state) => ({
        selectedMapObjectId,
        selectedMapObjectTick: state.selectedMapObjectTick + 1,
    })),
    addMapObject: (MapObject) => set(state => ({
        MapObjects: [...state.MapObjects, MapObject]
    })),
    updateMapObject: (updatedMapObject) => set(state => ({
        MapObjects: state.MapObjects.map(MapObject => MapObject._id === updatedMapObject._id ? updatedMapObject : MapObject)
    })),

    removeMapObject: (id) => set(state => ({
        MapObjects: state.MapObjects.filter(MapObject => MapObject._id !== id)
    })),

    setPointPlacementActive: (active) => set(() => ({
        pointPlacementActive: active,
    })),

    setPointPlacementCoordinates: (coordinates) => set(() => ({
        pointPlacementCoordinates: coordinates,
    })),

    startRouteDraft: () => set({ routeDraftActive: true, routeDraftWaypoints: [], routeDraftHoveredIndex: null }),

    stopRouteDraft: () => set({ routeDraftActive: false, routeDraftWaypoints: [], routeDraftHoveredIndex: null }),

    addRouteDraftWaypoint: (waypoint) => set((state) => ({
        routeDraftWaypoints: [...state.routeDraftWaypoints, waypoint],
    })),

    updateRouteDraftWaypoint: (index, waypoint) => set((state) => ({
        routeDraftWaypoints: state.routeDraftWaypoints.map((item, itemIndex) =>
            itemIndex === index ? waypoint : item,
        ),
    })),

    removeRouteDraftWaypoint: (index) => set((state) => ({
        routeDraftWaypoints: state.routeDraftWaypoints.filter((_, itemIndex) => itemIndex !== index),
    })),

    reorderRouteDraftWaypoints: (fromIndex, toIndex) => set((state) => {
        if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= state.routeDraftWaypoints.length ||
            toIndex >= state.routeDraftWaypoints.length ||
            fromIndex === toIndex
        ) {
            return state;
        }

        const reordered = [...state.routeDraftWaypoints];
        const [moved] = reordered.splice(fromIndex, 1);

        if (!moved) {
            return state;
        }

        reordered.splice(toIndex, 0, moved);

        return { routeDraftWaypoints: reordered };
    }),

    setRouteDraftHoveredIndex: (index) => set({ routeDraftHoveredIndex: index }),

    setRouteDraftMapCenter: (center) => set({ routeDraftMapCenter: center }),

    setAreaDraftActive: (active) => set({ areaDraftActive: active }),

    setAreaDraftRadius: (radius) => set({ areaDraftRadius: radius }),

    setSort: (field) => set(state => ({
        sortBy: field,
        sortOrder: state.sortBy === field && state.sortOrder === 'asc' ? 'desc' : 'asc'
    })),

    getSortedMapObjects: () => {
        const { MapObjects, sortBy, sortOrder } = get();
        if (!sortBy) return MapObjects;

        return [...MapObjects].sort((a, b) => {
            if (a[sortBy] === b[sortBy]) {
                return 0;
            }

            const modifier = sortOrder === 'asc' ? 1 : -1;
            return a[sortBy] > b[sortBy] ? modifier : -modifier;
        });
    }
}));