import { create } from 'zustand';
import { type MapObject } from '../models/MapObject';
import type { LatLon } from '../models/GeoJSON';

interface MapObjectStore {
    MapObjects: MapObject[];
    selectedMapObjectId: string | null;
    selectedMapObjectTick: number;
    pointPlacementActive: boolean;
    pointPlacementCoordinates: LatLon | null;
    sortBy: '_id' | 'name' | null;
    sortOrder: 'asc' | 'desc';

    setSelectedMapObjectId: (selectedMapObjectId: string | null) => void;

    setMapObjects: (MapObjects: MapObject[]) => void;
    addMapObject: (MapObject: MapObject) => void;
    updateMapObject: (MapObject: MapObject) => void;
    removeMapObject: (id: string) => void;
    setPointPlacementActive: (active: boolean) => void;
    setPointPlacementCoordinates: (coordinates: LatLon | null) => void;
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

    setMapObjects: (MapObjects) => set((state) => ({
        MapObjects,
        selectedMapObjectId: state.selectedMapObjectId ?? (MapObjects.length ? MapObjects[0]._id : null),
    })),
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

    setSort: (field) => set(state => ({
        sortBy: field,
        sortOrder: state.sortBy === field && state.sortOrder === 'asc' ? 'desc' : 'asc'
    })),

    getSortedMapObjects: () => {
        const { MapObjects, sortBy, sortOrder } = get();
        if (!sortBy) return MapObjects;

        return [...MapObjects].sort((a, b) => {
            const modifier = sortOrder === 'asc' ? 1 : -1;
            return a[sortBy] > b[sortBy] ? modifier : -modifier;
        });
    }
}));