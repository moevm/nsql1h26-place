import { useCallback, useEffect } from 'react'
import { runApi, type ApiError } from './hooks'
import { useAuthStore } from '../stores/authStore'
import { useMapStore } from '../stores/mapsStore'
import type { Map, CreateMap, UpdateMap } from '../models/Map'

const MAPS_PAGE_SIZE = 10;
let activeRequestId = 0;

const withPage = (path: string, page: number) => {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}page=${page}`;
};

export const fetchMaps = () => runApi<Map[]>('GET', '/maps');

export const fetchMapsPage = (page: number) => runApi<Map[]>('GET', withPage('/maps', page));

export const fetchMap = (id: string) => runApi<Map>('GET', `/maps/${id}`);

export const createMap = (payload: CreateMap) =>
    runApi<Map, CreateMap>('POST', '/maps', payload);

export const updateMap = (id: string, payload: UpdateMap) =>
    runApi<Map, UpdateMap>('PATCH', `/maps/${id}`, payload);

export const deleteMap = (id: string) =>
    runApi<Map>('DELETE', `/maps/${id}`);

const loadMapsPage = async (page: number, replace: boolean, userId: string | null) => {
    const requestId = ++activeRequestId;
    const { appendMaps, setMaps } = useMapStore.getState();

    useMapStore.setState({ mapsLoading: true, mapsError: undefined });

    try {
        const result = await fetchMapsPage(page);
        if (requestId !== activeRequestId) return;

        if (replace) {
            setMaps(result);
        } else {
            appendMaps(result);
        }

        useMapStore.setState({
            mapsHasMore: result.length === MAPS_PAGE_SIZE,
            mapsPage: page,
            mapsInitialized: true,
            mapsLoading: false,
            mapsUserId: userId,
        });
    } catch (err) {
        if (requestId !== activeRequestId) return;
        useMapStore.setState({
            mapsError: err as ApiError,
            mapsInitialized: true,
            mapsLoading: false,
        });
    }
};

export const useLoadMaps = (): {
    error: ApiError | undefined;
    loading: boolean;
    refresh: () => void;
    loadMore: () => void;
    hasMore: boolean;
} => {
    const userId = useAuthStore((s) => s.user?._id ?? null);
    const loading = useMapStore((s) => s.mapsLoading);
    const error = useMapStore((s) => s.mapsError);
    const hasMore = useMapStore((s) => s.mapsHasMore);

    useEffect(() => {
        const state = useMapStore.getState();
        if (state.mapsLoading) return;

        if (state.mapsUserId !== userId) {
            useMapStore.setState({
                mapsInitialized: false,
                mapsPage: 1,
                mapsHasMore: true,
                mapsUserId: userId,
            });
            useMapStore.getState().setMaps([]);
            loadMapsPage(1, true, userId);
            return;
        }

        if (!state.mapsInitialized) {
            loadMapsPage(1, true, userId);
        }
    }, [userId]);

    const loadMore = useCallback(() => {
        const state = useMapStore.getState();
        if (state.mapsLoading || !state.mapsHasMore) return;
        loadMapsPage(state.mapsPage + 1, false, userId);
    }, [userId]);

    const refresh = useCallback(() => {
        loadMapsPage(1, true, userId);
    }, [userId]);

    return { error, loading, refresh, loadMore, hasMore };
};