import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../../stores/mapsStore'
import { useLoadMaps } from '../../api/maps'
import './HomePage.css'

const FlyToSelected = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 })
    }, [center, zoom, map])

    return null
}

const HomePage = () => {
    const { loading, error } = useLoadMaps()
    const maps = useMapStore((s) => s.Maps)
    const selectedMapId = useMapStore((s) => s.selectedMapId)

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const zoom = 15;

    const center: [number, number] = selectedMap
        ? [selectedMap.coordinates.x, selectedMap.coordinates.y]
        : [55.75, 37.62]


    return (
        <div className="home-page">
            {loading && <p className="home-page__status">Загрузка карт...</p>}
            {error && <p className="home-page__status home-page__status--error">Ошибка: {error.message}</p>}
            {!loading && maps.length === 0 && (
                <p className="home-page__status">Карт пока нет — Создайте свою первую карту через боковую панель.</p>
            )}

            <div className="home-page__map-wrap">
                <MapContainer center={center} zoom={15} className="home-page__map" zoomControl={false}>
                    <ZoomControl position="topright" />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FlyToSelected center={center} zoom={zoom} />
                </MapContainer>
            </div>
        </div>
    )
}

export default HomePage