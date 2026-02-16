import { useEffect } from 'react'
import { useApi, type ApiError } from './hooks'
import { useMapStore } from '../stores/mapsStore'
import type { Map } from '../models/Map'

export const useListMaps = (): [
    Map[], ApiError | undefined, boolean, () => void
] => {
    const { setMaps } = useMapStore()

    const [maps, error, loading, refresh] = useApi<Map[]>({ path: '/maps' });
    useEffect(() => {
        setMaps(maps)
    }, [maps, setMaps])

    return [maps, error, loading, refresh]
}