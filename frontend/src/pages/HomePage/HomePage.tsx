import { Fragment, useEffect, useState } from 'react'
import { divIcon } from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapStore } from '../../stores/mapsStore'
import { useLoadMaps } from '../../api/maps'
import { useLoadMapObjects } from '../../api/mapObjects'
import './HomePage.css'
import type { Map } from '../../models/Map'
import type { MapObject } from '../../models/MapObject'
import { useMapObjectStore } from '../../stores/mapObjectStore'

const roundCoordinate = (value: number): number => Number(value.toFixed(6))
const ROUTE_DRAFT_CENTER_LEFT_OFFSET_PX = 350

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

const ViewportCenterSync = () => {
    const map = useMap()
    const setRouteDraftMapCenter = useMapObjectStore((s) => s.setRouteDraftMapCenter)

    useEffect(() => {
        const syncCenter = () => {
            const center = map.getCenter()
            const centerPoint = map.latLngToContainerPoint(center)
            const shiftedCenter = map.containerPointToLatLng([
                centerPoint.x - ROUTE_DRAFT_CENTER_LEFT_OFFSET_PX,
                centerPoint.y,
            ])

            setRouteDraftMapCenter([roundCoordinate(shiftedCenter.lat), roundCoordinate(shiftedCenter.lng)])
        }

        syncCenter()
        map.on('move', syncCenter)
        map.on('zoom', syncCenter)

        return () => {
            map.off('move', syncCenter)
            map.off('zoom', syncCenter)
        }
    }, [map, setRouteDraftMapCenter])

    return null
}

const createWaypointIcon = (index: number, highlighted = false) => divIcon({
    className: `home-page__route-waypoint-icon${highlighted ? ' home-page__route-waypoint-icon--active' : ''}`,
    html: `<span>${index}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
})

const waypointIconCache = new Map<string, ReturnType<typeof divIcon>>()

const getWaypointIcon = (index: number, highlighted = false) => {
    const cacheKey = `${index}-${highlighted ? 'active' : 'default'}`
    const cachedIcon = waypointIconCache.get(cacheKey)
    if (cachedIcon) {
        return cachedIcon
    }

    const nextIcon = createWaypointIcon(index, highlighted)
    waypointIconCache.set(cacheKey, nextIcon)

    return nextIcon
}

const RouteDraftLayer = () => {
    const isActive = useMapObjectStore((s) => s.routeDraftActive)
    const waypoints = useMapObjectStore((s) => s.routeDraftWaypoints)
    const updateWaypoint = useMapObjectStore((s) => s.updateRouteDraftWaypoint)
    const hoveredWaypointIndex = useMapObjectStore((s) => s.routeDraftHoveredIndex)
    const [dragPreview, setDragPreview] = useState<{ index: number; point: [number, number] } | null>(null)

    const polylinePoints = dragPreview
        ? waypoints.map((waypoint, index) => (index === dragPreview.index ? dragPreview.point : waypoint))
        : waypoints

    if (!isActive) {
        return null
    }

    return (
        <>
            {waypoints.length > 1 && (
                <Polyline
                    positions={polylinePoints}
                    pathOptions={{ color: '#51704A', weight: 5, opacity: 0.9 }}
                />
            )}

            {waypoints.map((waypoint, index) => (
                <Marker
                    key={`route-waypoint-${index}`}
                    position={dragPreview?.index === index ? dragPreview.point : waypoint}
                    draggable
                    icon={getWaypointIcon(index + 1, hoveredWaypointIndex === index)}
                    zIndexOffset={hoveredWaypointIndex === index ? 1000 : 0}
                    eventHandlers={{
                        drag: (event) => {
                            const latLng = event.target.getLatLng()
                            setDragPreview({
                                index,
                                point: [roundCoordinate(latLng.lat), roundCoordinate(latLng.lng)],
                            })
                        },
                        dragend: (event) => {
                            const latLng = event.target.getLatLng()
                            updateWaypoint(index, [roundCoordinate(latLng.lat), roundCoordinate(latLng.lng)])
                            setDragPreview(null)
                        },
                    }}
                />
            ))}
        </>
    )
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

const HomePage = () => {
    const { loading: mapsLoading, error: mapsError } = useLoadMaps()
    const { error: objectsError } = useLoadMapObjects('/objects')
    const maps = useMapStore((s) => s.Maps)
    const mapObjects = useMapObjectStore((s) => s.MapObjects)
    const selectedMapObjectId = useMapObjectStore((s) => s.selectedMapObjectId)
    const selectedMapObjectTick = useMapObjectStore((s) => s.selectedMapObjectTick)
    const pointPlacementCoordinates = useMapObjectStore((s) => s.pointPlacementCoordinates)
    const selectedMapId = useMapStore((s) => s.selectedMapId)
    const selectedMapTick = useMapStore((s) => s.selectedMapTick)

    const objectsForSelectedMap = mapObjects.filter(
        (item) => !selectedMapId || String(item.map_id) === selectedMapId,
    )
    const pointsForSelectedMap = objectsForSelectedMap.filter(
        (item): item is Extract<MapObject, { type: 'Point' }> => item.type === 'Point',
    )
    const routesForSelectedMap = objectsForSelectedMap.filter(
        (item): item is Extract<MapObject, { type: 'Route' }> => item.type === 'Route',
    )
    const setSelectedMapObjectId = useMapObjectStore((s) => s.setSelectedMapObjectId)

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const zoom = 15;

    const center: [number, number] | null = selectedMap ? getMapCenter(selectedMap) : null
    const selectedPoint = pointsForSelectedMap.find(
        (item): item is Extract<MapObject, { type: 'Point' }> => (
            item.type === 'Point' && item._id === selectedMapObjectId
        ),
    )
    const selectedRoute = routesForSelectedMap.find(
        (item): item is Extract<MapObject, { type: 'Route' }> => (
            item.type === 'Route' && item._id === selectedMapObjectId
        ),
    )
    const selectedPointCenter: [number, number] | null = selectedPoint
        ? selectedPoint.location.coordinates
        : null
    const selectedRouteCenter: [number, number] | null = selectedRoute
        ? (selectedRoute.location.coordinates[0] ?? null)
        : null
    const selectedMapObjectCenter: [number, number] | null = selectedPointCenter ?? selectedRouteCenter


    return (
        <div className="home-page">
            {mapsLoading && <p className="home-page__status_wrapper">Загрузка карт...</p>}
            {mapsError && <p className="home-page__status_wrapper home-page__status--error">Ошибка: {mapsError.message}</p>}
            {(!mapsLoading && maps.length === 0) ?
                ( <p className="home-page__status_wrapper">Карт пока нет - cоздайте свою первую карту через боковую панель.</p>)
                : !selectedMap ? (<p className="home-page__status_wrapper">Карта не выбрана — выберите карту в боковой панели.</p>)
                : !center ? (<p className="home-page__status_wrapper home-page__status--error">Не удалось определить центр.</p>)
            : (
                <div className="home-page__map-wrap">
                    {objectsError && (
                        <p className="home-page__objects-error">Ошибка загрузки объектов: {objectsError.message}</p>
                    )}
                    <MapContainer center={center} zoom={15} className="home-page__map" zoomControl={false}>
                        <ZoomControl position="topright" />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        <ViewportCenterSync />
                        <FlyToSelected center={center} zoom={zoom} trigger={selectedMapTick} />
                        {selectedMapObjectCenter && (
                            <FlyToSelected center={selectedMapObjectCenter} zoom={17} trigger={selectedMapObjectTick} />
                        )}
                        <PointPlacementClickHandler />
                        {pointsForSelectedMap.map((point) => (
                            <Marker
                                key={point._id}
                                position={point.location.coordinates}
                                eventHandlers={{
                                    click: () => setSelectedMapObjectId(point._id),
                                }}
                            >
                                <Popup>{point.name || 'Отметка'}</Popup>
                            </Marker>
                        ))}
                        {pointPlacementCoordinates && (
                            <Marker position={pointPlacementCoordinates}>
                                <Popup>Временная отметка</Popup>
                            </Marker>
                        )}
                        {routesForSelectedMap.map((route) => (
                            <Fragment key={route._id}>
                                <Polyline
                                    positions={route.location.coordinates}
                                    pathOptions={{ color: '#51704A', weight: 5, opacity: 0.9 }}
                                    eventHandlers={{
                                        click: () => setSelectedMapObjectId(route._id),
                                    }}
                                >
                                    <Tooltip>{route.name || 'Маршрут'}</Tooltip>
                                </Polyline>

                                {route.location.coordinates.map((waypoint, waypointIndex) => (
                                    <Marker
                                        key={`${route._id}-point-${waypointIndex}`}
                                        position={waypoint}
                                        icon={getWaypointIcon(waypointIndex + 1)}
                                        eventHandlers={{
                                            click: () => setSelectedMapObjectId(route._id),
                                        }}
                                    />
                                ))}
                            </Fragment>
                        ))}
                        <RouteDraftLayer />
                    </MapContainer>
                </div>
            )}
        </div>
    )
}

export default HomePage