import { create } from 'zustand';
import { type ApiError } from '../api/hooks';
import { type Map } from '../models/Map';

interface MapStore {
    Maps: Map[];
    selectedMapId: string | null;
    selectedMapTick: number;
    sortBy: '_id' | 'name' | null;
    sortOrder: 'asc' | 'desc';
    mapsLoading: boolean;
    mapsError: ApiError | undefined;
    mapsPage: number;
    mapsHasMore: boolean;
    mapsInitialized: boolean;
    mapsUserId: string | null;

    setSelectedMapId: (selectedMapId: string | null) => void;

    setMaps: (Maps: Map[]) => void;
    appendMaps: (Maps: Map[]) => void;
    addMap: (Map: Map) => void;
    updateMap: (Map: Map) => void;
    removeMap: (id: string) => void;
    setSort: (field: '_id' | 'name' | null) => void;
    getSortedMaps: () => Map[];
}

export const useMapStore = create<MapStore>((set, get) => ({
    Maps: [],
    selectedMapId: null,
    selectedMapTick: 0,
    sortBy: null,
    sortOrder: 'asc',
    mapsLoading: false,
    mapsError: undefined,
    mapsPage: 1,
    mapsHasMore: true,
    mapsInitialized: false,
    mapsUserId: null,

    setMaps: (Maps) => set((state) => ({
        Maps,
        selectedMapId: state.selectedMapId ?? (Maps.length ? Maps[0]._id : null),
    })),
    appendMaps: (Maps) => set((state) => {
        const existingIds = new Set(state.Maps.map((item) => item._id));
        const nextMaps = Maps.filter((item) => !existingIds.has(item._id));

        return {
            Maps: nextMaps.length ? [...state.Maps, ...nextMaps] : state.Maps,
        };
    }),
    setSelectedMapId: (selectedMapId) => set((state) => ({
        selectedMapId,
        selectedMapTick: state.selectedMapTick + 1,
    })),
    addMap: (Map) => set(state => ({
        Maps: [...state.Maps, Map]
    })),
    updateMap: (updatedMap) => set(state => ({
        Maps: state.Maps.map(Map => Map._id === updatedMap._id ? updatedMap : Map)
    })),

    removeMap: (id) => set(state => ({
        Maps: state.Maps.filter(Map => Map._id !== id)
    })),

    setSort: (field) => set(state => ({
        sortBy: field,
        sortOrder: state.sortBy === field && state.sortOrder === 'asc' ? 'desc' : 'asc'
    })),

    getSortedMaps: () => {
        const { Maps, sortBy, sortOrder } = get();
        if (!sortBy) return Maps;

        return [...Maps].sort((a, b) => {
            if (a[sortBy] === b[sortBy]) {
                return 0;
            }

            const modifier = sortOrder === 'asc' ? 1 : -1;
            return a[sortBy] > b[sortBy] ? modifier : -modifier;
        });
    }
}));