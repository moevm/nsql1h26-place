import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../../stores/mapsStore'
import { useLoadMaps } from '../../api/maps'
import './HomePage.css'

const FlyToSelected = ({ center, zoom, trigger }: { center: [number, number]; zoom: number; trigger: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 })
    }, [center, zoom, map, trigger])

    return null
}

const HomePage = () => {
    const { loading, error } = useLoadMaps()
    const maps = useMapStore((s) => s.Maps)
    const selectedMapId = useMapStore((s) => s.selectedMapId)
    const selectedMapTick = useMapStore((s) => s.selectedMapTick)

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const zoom = 15;

    const center: [number, number] | null = selectedMap
        ? [selectedMap.coordinates.x, selectedMap.coordinates.y]
        : null


    return (
        <div className="home-page">
            {loading && <p className="home-page__status_wrapper">Загрузка карт...</p>}
            {error && <p className="home-page__status_wrapper home-page__status--error">Ошибка: {error.message}</p>}
            {(!loading && maps.length === 0) ? (
                <p className="home-page__status_wrapper">Карт пока нет - cоздайте свою первую карту через боковую панель.</p>
            ) : !selectedMap ? (
                <p className="home-page__status_wrapper">Карта не выбрана — выберите карту в боковой панели.</p>
            ) : (
                <div className="home-page__map-wrap">
                    <MapContainer center={center as [number, number]} zoom={15} className="home-page__map" zoomControl={false}>
                        <ZoomControl position="topright" />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        <FlyToSelected center={center as [number, number]} zoom={zoom} trigger={selectedMapTick} />
                    </MapContainer>
                </div>
            )}
        </div>
    )
}

export default HomePage