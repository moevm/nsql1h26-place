import { useEffect } from 'react'
import { runApi, useQuery, type ApiError } from './hooks'
import { useMapStore } from '../stores/mapsStore'
import type { Map, CreateMapPayload, UpdateMapPayload } from '../models/Map'

// ── CRUD-функции (императивные, для вызова по клику) ────

export const fetchMaps = () => runApi<Map[]>('GET', '/maps');

export const fetchMap = (id: string) => runApi<Map>('GET', `/maps/${id}`);

export const createMap = (payload: CreateMapPayload) =>
    runApi<Map, CreateMapPayload>('POST', '/maps', payload);

export const updateMap = (id: string, payload: UpdateMapPayload) =>
    runApi<Map, UpdateMapPayload>('PATCH', `/maps/${id}`, payload);

export const deleteMap = (id: string) =>
    runApi<Map>('DELETE', `/maps/${id}`);

// ── React-хук: загружает список карт и кладёт в store ──

export const useLoadMaps = (): {
    error: ApiError | undefined;
    loading: boolean;
    refresh: () => void;
} => {
    const setMaps = useMapStore((s) => s.setMaps);
    const [data, error, loading, refresh] = useQuery<Map[]>('/maps');

    useEffect(() => {
        if (data) setMaps(data);
    }, [data, setMaps]);

    return { error, loading, refresh };
};