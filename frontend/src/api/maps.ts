import { useEffect } from 'react'
import { runApi, useQuery, type ApiError } from './hooks'
import { useAuthStore } from '../stores/authStore'
import { useMapStore } from '../stores/mapsStore'
import type { Map, CreateMap, UpdateMap } from '../models/Map'

export const fetchMaps = () => runApi<Map[]>('GET', '/maps');

export const fetchMap = (id: string) => runApi<Map>('GET', `/maps/${id}`);

export const createMap = (payload: CreateMap) =>
    runApi<Map, CreateMap>('POST', '/maps', payload);

export const updateMap = (id: string, payload: UpdateMap) =>
    runApi<Map, UpdateMap>('PATCH', `/maps/${id}`, payload);

export const deleteMap = (id: string) =>
    runApi<Map>('DELETE', `/maps/${id}`);

export const useLoadMaps = (): {
    error: ApiError | undefined;
    loading: boolean;
    refresh: () => void;
} => {
    const setMaps = useMapStore((s) => s.setMaps);
    const userId = useAuthStore((s) => s.user?._id);
    const [data, error, loading, refresh] = useQuery<Map[]>('/maps');

    useEffect(() => {
        if (!data) {
            return;
        }

        const filteredMaps = userId
            ? data.filter((map) => String(map.user_id) === String(userId))
            : [];

        setMaps(filteredMaps);
    }, [data, userId, setMaps]);

    return { error, loading, refresh };
};