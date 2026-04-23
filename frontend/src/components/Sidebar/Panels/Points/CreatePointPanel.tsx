import { useEffect, useState } from 'react'
import '../Panels.css'
import { LuX } from 'react-icons/lu'
import { createMapObject } from '../../../../api/mapObjects'
import { useMapObjectStore } from '../../../../stores/mapObjectStore'
import { useMapStore } from '../../../../stores/mapsStore'

type CreatePointPanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const CreatePointPanel = ({setAdditionalOpen} : CreatePointPanelProps) => {
    const mapObjectStore = useMapObjectStore()
    const selectedMapId = useMapStore((s) => s.selectedMapId)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        mapObjectStore.setPointPlacementActive(false)
        mapObjectStore.setPointPlacementCoordinates(null)

        return () => {
            mapObjectStore.setPointPlacementActive(false)
        }
    }, [mapObjectStore.setPointPlacementActive, mapObjectStore.setPointPlacementCoordinates])

    const handleCreate = async () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        if (!mapObjectStore.pointPlacementCoordinates) {
            alert('Сначала укажите координаты отметки кнопкой "Поставить метку на карте".')
            return
        }

        setLoading(true)

        try {
            const object = await createMapObject({
                map_id: selectedMapId,
                type: 'Point',
                name: title.trim(),
                description: description.trim(),
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                location: {
                    type: 'Point',
                    coordinates: mapObjectStore.pointPlacementCoordinates,
                },
                image_path: 'point_icon.png',
            })

            mapObjectStore.addMapObject(object)
            mapObjectStore.setPointPlacementCoordinates(null)
            mapObjectStore.setPointPlacementActive(false)
            setAdditionalOpen(false)
        } catch {
            alert('Не удалось создать отметку!')
        } finally {
            setLoading(false)
        }
    }

    const handleStartPointPlacement = () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        mapObjectStore.setPointPlacementActive(true)
    }

    const handleClose = () => {
        mapObjectStore.setPointPlacementActive(false)
        mapObjectStore.setPointPlacementCoordinates(null)
        setAdditionalOpen(false)
    }

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание отметки</h3>
                <LuX className='panel__close' onClick={handleClose} />
            </div>
            <div className="create-form">
                <label className="create-form__label" htmlFor="title">Название</label>
                <input
                    id="title"
                    className="create-form__input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Например: Подосиновик"
                />

                <label className="create-form__label" htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    className="create-form__textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Краткое описание отметки"
                />

                <label className="create-form__label" htmlFor="tags">Теги (через запятую)</label>
                <input
                    id="tags"
                    className="create-form__input"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="гриб, лес, ягоды"
                />

                <hr className='divider' />

                    <label className="create-form__label" htmlFor="tags">Координаты отметки</label>
                    <button
                        type="button"
                        className="create-form__btn point-placement__btn"
                        onClick={handleStartPointPlacement}
                        disabled={!selectedMapId}
                    >
                        {mapObjectStore.pointPlacementActive ? 'Ожидание клика по карте...' : 'Поставить метку на карте'}
                    </button>

                <hr className='divider' />

                <div className="create-form__actions">
                    <button className="create-form__btn create-form__btn--ghost" onClick={handleClose}>Отменить</button>
                    <button className="create-form__btn" onClick={handleCreate} disabled={loading}>Принять</button>
                </div>
            </div>
        </aside>
    )
}

export default CreatePointPanel