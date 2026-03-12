import { create } from 'zustand';
import { type Map } from '../models/Map';

interface MapStore {
    Maps: Map[];
    selectedMapId: string | null;
    selectedMapTick: number;
    sortBy: '_id' | 'name' | null;
    sortOrder: 'asc' | 'desc';

    setSelectedMapId: (selectedMapId: string | null) => void;

    setMaps: (Maps: Map[]) => void;
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

    setMaps: (Maps) => set((state) => ({
        Maps,
        selectedMapId: state.selectedMapId ?? (Maps.length ? Maps[0]._id : null),
    })),
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
            const modifier = sortOrder === 'asc' ? 1 : -1;
            return a[sortBy] > b[sortBy] ? modifier : -modifier;
        });
    }
}));