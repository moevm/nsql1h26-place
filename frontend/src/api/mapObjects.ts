import { useCallback, useEffect } from 'react'
import { runApi, type ApiError } from './hooks'
import { useMapObjectStore } from '../stores/mapObjectStore'
import type {
    CreateMapObject,
    MapObject,
    MapObjectByType,
    MapObjectType,
    UpdateMapObject,
} from '../models/MapObject'

const mapObjectPathByType: Record<MapObjectType, string> = {
    Point: '/objects/points',
    Area: '/objects/areas',
    Route: '/objects/routes',
}

const MAP_OBJECTS_PAGE_SIZE = 10;
const pendingRequests: Record<string, boolean> = {};
const activeRequestIds: Record<string, number> = {};

const withPage = (path: string, page: number) => {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}page=${page}`;
};

export const fetchMapObjects = () => runApi<MapObject[]>('GET', '/objects');

export const fetchMapObjectsPage = (path: string, page: number) =>
    runApi<MapObject[]>('GET', withPage(path, page));

export const fetchMapObjectsByType = <T extends MapObjectType>(type: T) =>
    runApi<MapObjectByType<T>[]>('GET', mapObjectPathByType[type]);

export const fetchMapObject = (id: string) => runApi<MapObject>('GET', `/objects/${id}`);

export const createMapObject = (payload: CreateMapObject) =>
    runApi<MapObject, CreateMapObject>('POST', '/objects', payload);

export const updateMapObject = (id: string, payload: UpdateMapObject) =>
    runApi<MapObject, UpdateMapObject>('PATCH', `/objects/${id}`, payload);

export const deleteMapObject = (id: string) =>
    runApi<MapObject>('DELETE', `/objects/${id}`);

const updatePathState = (
    path: string,
    patch: {
        loading?: boolean;
        error?: ApiError | undefined;
        page?: number;
        hasMore?: boolean;
        initialized?: boolean;
    },
) => {
    useMapObjectStore.setState((state) => ({
        mapObjectsLoadingByPath: patch.loading === undefined
            ? state.mapObjectsLoadingByPath
            : { ...state.mapObjectsLoadingByPath, [path]: patch.loading },
        mapObjectsErrorByPath: patch.error === undefined
            ? state.mapObjectsErrorByPath
            : { ...state.mapObjectsErrorByPath, [path]: patch.error },
        mapObjectsPageByPath: patch.page === undefined
            ? state.mapObjectsPageByPath
            : { ...state.mapObjectsPageByPath, [path]: patch.page },
        mapObjectsHasMoreByPath: patch.hasMore === undefined
            ? state.mapObjectsHasMoreByPath
            : { ...state.mapObjectsHasMoreByPath, [path]: patch.hasMore },
        mapObjectsInitializedByPath: patch.initialized === undefined
            ? state.mapObjectsInitializedByPath
            : { ...state.mapObjectsInitializedByPath, [path]: patch.initialized },
    }));
};

const loadMapObjectsPage = async (path: string, page: number, replace: boolean) => {
    if (pendingRequests[path]) return;
    pendingRequests[path] = true;

    const requestId = (activeRequestIds[path] ?? 0) + 1;
    activeRequestIds[path] = requestId;

    updatePathState(path, { loading: true, error: undefined });

    try {
        const result = await fetchMapObjectsPage(path, page);
        if (activeRequestIds[path] !== requestId) return;

        if (replace) {
            useMapObjectStore.getState().setMapObjects(result);
        } else {
            useMapObjectStore.getState().appendMapObjects(result);
        }

        updatePathState(path, {
            hasMore: result.length === MAP_OBJECTS_PAGE_SIZE,
            page,
            initialized: true,
            loading: false,
        });
    } catch (err) {
        if (activeRequestIds[path] !== requestId) return;
        updatePathState(path, {
            error: err as ApiError,
            initialized: true,
            loading: false,
        });
    } finally {
        pendingRequests[path] = false;
    }
};

export const useLoadMapObjects = (path = '/objects'): {
    error: ApiError | undefined;
    loading: boolean;
    refresh: () => void;
    loadMore: () => void;
    hasMore: boolean;
} => {
    const loading = useMapObjectStore((s) => s.mapObjectsLoadingByPath[path] ?? false);
    const error = useMapObjectStore((s) => s.mapObjectsErrorByPath[path]);
    const hasMore = useMapObjectStore((s) => s.mapObjectsHasMoreByPath[path] ?? true);

    useEffect(() => {
        const state = useMapObjectStore.getState();
        if (state.mapObjectsLoadingByPath[path]) return;
        if (!state.mapObjectsInitializedByPath[path]) {
            loadMapObjectsPage(path, 1, true);
        }
    }, [path]);

    const loadMore = useCallback(() => {
        const state = useMapObjectStore.getState();
        if (state.mapObjectsLoadingByPath[path]) return;
        if (!(state.mapObjectsHasMoreByPath[path] ?? true)) return;
        const nextPage = (state.mapObjectsPageByPath[path] ?? 1) + 1;
        loadMapObjectsPage(path, nextPage, false);
    }, [path]);

    const refresh = useCallback(() => {
        updatePathState(path, { initialized: false, page: 1, hasMore: true });
        loadMapObjectsPage(path, 1, true);
    }, [path]);

    return { error, loading, refresh, loadMore, hasMore };
};

export const useLoadMapObjectsByType = <T extends MapObjectType>(type: T) =>
    useLoadMapObjects(mapObjectPathByType[type]);