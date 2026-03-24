import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../../stores/mapsStore'
import { useLoadMaps } from '../../api/maps'
import './HomePage.css'
import type { Map } from '../../models/Map'

const FlyToSelected = ({ center, zoom, trigger }: { center: [number, number]; zoom: number; trigger: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 })
    }, [center, zoom, map, trigger])

    return null
}

const getMapCenter = (map: Map): [number, number] | null => {
    const { location } = map

    if (location.type === 'Point') {
        return [location.coordinates[0], location.coordinates[1]]
    }

    if (location.type === 'LineString') {
        const first = location.coordinates[0]
        return first ? [first[0], first[1]] : null
    }

    const first = location.coordinates[0]?.[0]
    return first ? [first[0], first[1]] : null
}

const HomePage = () => {
    const { loading, error } = useLoadMaps()
    const maps = useMapStore((s) => s.Maps)
    const selectedMapId = useMapStore((s) => s.selectedMapId)
    const selectedMapTick = useMapStore((s) => s.selectedMapTick)

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const zoom = 15;

    const center: [number, number] | null = selectedMap ? getMapCenter(selectedMap) : null


    return (
        <div className="home-page">
            {loading && <p className="home-page__status_wrapper">Загрузка карт...</p>}
            {error && <p className="home-page__status_wrapper home-page__status--error">Ошибка: {error.message}</p>}
            {(!loading && maps.length === 0) ? (
                <p className="home-page__status_wrapper">Карт пока нет - cоздайте свою первую карту через боковую панель.</p>
            ) : !selectedMap ? (
                <p className="home-page__status_wrapper">Карта не выбрана — выберите карту в боковой панели.</p>
            ) : !center ? (
                <p className="home-page__status_wrapper home-page__status--error">У выбранной карты нет корректной геометрии.</p>
            ) : (
                <div className="home-page__map-wrap">
                    <MapContainer center={center} zoom={15} className="home-page__map" zoomControl={false}>
                        <ZoomControl position="topright" />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        <FlyToSelected center={center} zoom={zoom} trigger={selectedMapTick} />
                    </MapContainer>
                </div>
            )}
        </div>
    )
}

export default HomePage