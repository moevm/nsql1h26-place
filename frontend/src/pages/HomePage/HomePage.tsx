import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../../stores/mapsStore'
import { useLoadMaps } from '../../api/maps'
import './HomePage.css'
import type { Map } from '../../models/Map'
import { useMapObjectStore } from '../../stores/mapObjectStore'
import { useLoadMapObjectsByType } from '../../api/mapObjects'
import type { PointMapObject } from '../../models/MapObject'

const FlyToSelected = ({ center, zoom, trigger }: { center: [number, number]; zoom: number; trigger: number }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 })
    }, [center, zoom, map, trigger])

    return null
}

const PointPlacementClickHandler = () => {
    const mapObjectStore = useMapObjectStore()

    useMapEvents({
        click(event) {
            if (!mapObjectStore.pointPlacementActive) {
                return
            }

            mapObjectStore.setPointPlacementCoordinates([event.latlng.lat, event.latlng.lng])
            mapObjectStore.setPointPlacementActive(false)
        },
    })

    return null
}

const getMapCenter = (map: Map): [number, number] | null => {
    const { location } = map

    switch (location.type) {
        case "Point":
            return location.coordinates;
        case "LineString":
            const first = location.coordinates[0]
            return first ? [first[0], first[1]] : null
        default:
            console.log("unknown object")
            return null;
    }
}

const isPointOnSelectedMap = (selectedMapId: string | null) =>
    (item: ReturnType<typeof useMapObjectStore.getState>['MapObjects'][number]): item is PointMapObject =>
        item.type === 'Point' && (!selectedMapId || String(item.map_id) === selectedMapId)

const HomePage = () => {
    const { loading, error } = useLoadMaps()
    useLoadMapObjectsByType('Point')
    const mapObjectStore = useMapObjectStore()

    const maps = useMapStore((s) => s.Maps)
    const selectedMapId = useMapStore((s) => s.selectedMapId)
    const selectedMapTick = useMapStore((s) => s.selectedMapTick)
    const points = mapObjectStore.MapObjects
        .filter(isPointOnSelectedMap(selectedMapId))

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const zoom = 15;

    const center: [number, number] | null = selectedMap ? getMapCenter(selectedMap) : null
    const selectedPoint = points.find((point) => point._id === mapObjectStore.selectedMapObjectId)
    const selectedPointCenter: [number, number] | null = selectedPoint
        ? [selectedPoint.location.coordinates[0], selectedPoint.location.coordinates[1]]
        : null


    return (
        <div className="home-page">
            {loading && <p className="home-page__status_wrapper">Загрузка карт...</p>}
            {error && <p className="home-page__status_wrapper home-page__status--error">Ошибка: {error.message}</p>}
            {(!loading && maps.length === 0) ?
                ( <p className="home-page__status_wrapper">Карт пока нет - cоздайте свою первую карту через боковую панель.</p>)
                : !selectedMap ? (<p className="home-page__status_wrapper">Карта не выбрана — выберите карту в боковой панели.</p>)
                : !center ? (<p className="home-page__status_wrapper home-page__status--error">Не удалось определить центр.</p>)
            : (
                <div className="home-page__map-wrap">
                    <MapContainer center={center} zoom={15} className="home-page__map" zoomControl={false}>
                        <ZoomControl position="topright" />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        <FlyToSelected center={center} zoom={zoom} trigger={selectedMapTick} />
                        {selectedPointCenter && (<FlyToSelected center={selectedPointCenter} zoom={17} trigger={mapObjectStore.selectedMapObjectTick} />)}
                        <PointPlacementClickHandler />
                        {points.map((point) => (
                            <Marker
                                key={point._id}
                                position={point.location.coordinates}
                                eventHandlers={{
                                    click: () => mapObjectStore.setSelectedMapObjectId(point._id),
                                }}
                            >
                                <Popup>{point.name}</Popup>
                            </Marker>
                        ))}
                        {mapObjectStore.pointPlacementCoordinates && (
                            <Marker position={mapObjectStore.pointPlacementCoordinates}>
                                <Popup>Временная отметка</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            )}
        </div>
    )
}

export default HomePage