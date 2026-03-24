import { useEffect } from 'react'
import { runApi, useQuery, type ApiError } from './hooks'
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

export const fetchMapObjects = () => runApi<MapObject[]>('GET', '/objects');

export const fetchMapObjectsByType = <T extends MapObjectType>(type: T) =>
    runApi<MapObjectByType<T>[]>('GET', mapObjectPathByType[type]);

export const fetchMapObject = (id: string) => runApi<MapObject>('GET', `/objects/${id}`);

export const createMapObject = (payload: CreateMapObject) =>
    runApi<MapObject, CreateMapObject>('POST', '/objects', payload);

export const updateMapObject = (id: string, payload: UpdateMapObject) =>
    runApi<MapObject, UpdateMapObject>('PATCH', `/objects/${id}`, payload);

export const deleteMapObject = (id: string) =>
    runApi<MapObject>('DELETE', `/objects/${id}`);

export const useLoadMapObjects = (path = '/objects'): {
    error: ApiError | undefined;
    loading: boolean;
    refresh: () => void;
} => {
    const setMapObjects = useMapObjectStore((s) => s.setMapObjects);
    const [data, error, loading, refresh] = useQuery<MapObject[]>(path);

    useEffect(() => {
        if (data) setMapObjects(data);
    }, [data, setMapObjects]);

    return { error, loading, refresh };
};

export const useLoadMapObjectsByType = <T extends MapObjectType>(type: T) =>
    useLoadMapObjects(mapObjectPathByType[type]);