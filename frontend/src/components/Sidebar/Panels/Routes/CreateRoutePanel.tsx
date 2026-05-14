import { useEffect, useState } from 'react'
import '../Panels.css'
import { LuMapPinned, LuTrash2, LuX } from 'react-icons/lu'
import { BsGripVertical } from 'react-icons/bs'
import { createMapObject } from '../../../../api/mapObjects'
import { useMapObjectStore } from '../../../../stores/mapObjectStore'
import { useMapStore } from '../../../../stores/mapsStore'
import { getMapCenterPoint } from '../objectGeometry'
import type { LatLon } from '../../../../models/GeoJSON'
import { useShallow } from 'zustand/react/shallow'
import './CreateRoutePanel.css'
import TagSelector from '../../../TagSelector/TagSelector'

type CreateRoutePanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const roundCoordinate = (value: number): number => Number(value.toFixed(6))

const CreateRoutePanel = ({setAdditionalOpen} : CreateRoutePanelProps) => {
    const [
        addMapObject,
        waypoints,
        routeDraftMapCenter,
        startDraft,
        stopDraft,
        addWaypoint,
        removeWaypoint,
        reorderWaypoints,
        setHoveredWaypointIndex,
    ] = useMapObjectStore(
        useShallow((s) => [
            s.addMapObject,
            s.routeDraftWaypoints,
            s.routeDraftMapCenter,
            s.startRouteDraft,
            s.stopRouteDraft,
            s.addRouteDraftWaypoint,
            s.removeRouteDraftWaypoint,
            s.reorderRouteDraftWaypoints,
            s.setRouteDraftHoveredIndex,
        ]),
    )

    const [maps, selectedMapId] = useMapStore(
        useShallow((s) => [s.Maps, s.selectedMapId]),
    )

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    useEffect(() => {
        startDraft()

        return () => {
            setHoveredWaypointIndex(null)
            stopDraft()
        }
    }, [setHoveredWaypointIndex, startDraft, stopDraft])

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const centerPoint = getMapCenterPoint(selectedMap)

    const handleAddWaypoint = () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        const fallbackCenter = centerPoint
            ? [roundCoordinate(centerPoint.coordinates[0]), roundCoordinate(centerPoint.coordinates[1])] as LatLon
            : null

        const targetCenter = routeDraftMapCenter ?? fallbackCenter

        if (!targetCenter) {
            alert('У выбранной карты нет корректной геометрии.')
            return
        }

        addWaypoint([roundCoordinate(targetCenter[0]), roundCoordinate(targetCenter[1])])
    }

    const handleDropWaypoint = (targetIndex: number) => {
        if (dragFromIndex === null) {
            return
        }

        reorderWaypoints(dragFromIndex, targetIndex)
        setDragFromIndex(null)
        setDragOverIndex(null)
    }

    const handleCreate = async () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        if (!title.trim()) {
            alert('Укажите название маршрута.')
            return
        }

        if (waypoints.length < 2) {
            alert('Добавьте минимум две отметки маршрута.')
            return
        }

        setLoading(true)

        try {
            const object = await createMapObject({
                map_id: selectedMapId,
                type: 'Route',
                name: title.trim(),
                description: description.trim(),
                tags,
                location: {
                    type: 'LineString',
                    coordinates: waypoints,
                },
                image_path: 'route_icon.png',
            })

            addMapObject(object)
            stopDraft()
            setAdditionalOpen(false)
        } catch {
            alert('Не удалось создать маршрут!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание маршрута</h3>
                <LuX className='panel__close' onClick={() => setAdditionalOpen(false)} />
            </div>
            <div className="create-form">
                <label className="create-form__label" htmlFor="title">Название</label>
                <input
                    id="title"
                    className="create-form__input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Например: Маршрут подосиновиков"
                />

                <label className="create-form__label" htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    className="create-form__textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Краткое описание маршрута"
                />

                <hr className="divider route-create__divider" />

                <button type="button" className="create-form__btn route-create__add-point" onClick={handleAddWaypoint}>
                    <LuMapPinned /> Поставить метку на карте
                </button>

                <div className="route-create__waypoints">
                    {!waypoints.length && (
                        <div className="list__empty route-create__empty">
                            Пока нет точек. Добавьте первую метку на карту.
                        </div>
                    )}

                    {waypoints.map((waypoint, index) => (
                        <div
                            key={`${index}-${waypoint[0]}-${waypoint[1]}`}
                            className={`route-create__waypoint ${dragOverIndex === index ? 'route-create__waypoint--over' : ''}`}
                            onMouseEnter={() => setHoveredWaypointIndex(index)}
                            onMouseLeave={() => setHoveredWaypointIndex(null)}
                            onDragOver={(event) => {
                                event.preventDefault()
                                setDragOverIndex(index)
                            }}
                            onDrop={() => handleDropWaypoint(index)}
                        >
                            <div className="route-create__waypoint-head">
                                <span
                                    className="route-create__drag-handle"
                                    draggable
                                    onDragStart={(event) => {
                                        setDragFromIndex(index)
                                        event.dataTransfer.effectAllowed = 'move'
                                        event.dataTransfer.setData('text/plain', String(index))
                                    }}
                                    onDragEnd={() => {
                                        setDragFromIndex(null)
                                        setDragOverIndex(null)
                                    }}
                                    title="Перетащить точку"
                                >
                                    <BsGripVertical className="route-create__drag-icon" />
                                </span>
                                <span className="route-create__waypoint-index">#{index + 1}</span>
                                <button
                                    type="button"
                                    className="route-create__remove"
                                    onClick={() => {
                                        setHoveredWaypointIndex(null)
                                        removeWaypoint(index)
                                    }}
                                >
                                    <LuTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="divider route-create__divider" />

                <label className="create-form__label">Теги</label>
                <TagSelector value={tags} onChange={setTags} />

                <hr className="divider route-create__divider" />
                

                <div className="create-form__actions">
                    <button className="create-form__btn create-form__btn--ghost" onClick={() => setAdditionalOpen(false)}>
                        Отмена
                    </button>
                    <button className="create-form__btn" onClick={handleCreate} disabled={loading}>
                        Принять
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default CreateRoutePanel