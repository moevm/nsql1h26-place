import { useEffect } from 'react'
import { useApi, type ApiError } from './hooks'
import { useMapStore } from '../stores/mapsStore'
import type { Map } from '../models/Map'

export const useListMaps = (): [
    Map[], ApiError | undefined, boolean, () => void
] => {
    const { setMaps } = useMapStore()

    const [cars, error, loading, refresh] = useApi<Map[]>({});
    useEffect(() => {
        setMaps(cars)
    }, [cars, setMaps])

    return [cars, error, loading, refresh]
}