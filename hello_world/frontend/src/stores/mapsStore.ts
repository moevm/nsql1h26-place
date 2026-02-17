import { create } from 'zustand';
import { type Map } from '../models/Map';

interface MapStore {
    Maps: Map[];
    sortBy: 'id' | null;
    sortOrder: 'asc' | 'desc';

    setMaps: (Maps: Map[]) => void;
    addMap: (Map: Map) => void;
    updateMap: (Map: Map) => void;
    removeMap: (id: string) => void;
    setSort: (field: 'id' | null) => void;
    getSortedMaps: () => Map[];
}

export const useMapStore = create<MapStore>((set, get) => ({
    Maps: [],
    sortBy: null,
    sortOrder: 'asc',

    setMaps: (Maps) => set({ Maps }),
    addMap: (Map) => set(state => ({
        Maps: [...state.Maps, Map]
    })),
    updateMap: (updatedMap) => set(state => ({
        Maps: state.Maps.map(Map => Map.id === updatedMap.id ? updatedMap : Map)
    })),

    removeMap: (id) => set(state => ({
        Maps: state.Maps.filter(Map => Map.id !== id)
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