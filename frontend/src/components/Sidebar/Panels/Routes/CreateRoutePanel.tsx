import { useState } from 'react'
import '../Panels.css'
import { LuX } from 'react-icons/lu'
import { createMapObject } from '../../../../api/mapObjects'
import { useMapObjectStore } from '../../../../stores/mapObjectStore'
import { useMapStore } from '../../../../stores/mapsStore'
import { buildDefaultRoute, getMapCenterPoint } from '../objectGeometry'

type CreateRoutePanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const CreateRoutePanel = ({setAdditionalOpen} : CreateRoutePanelProps) => {
    const { addMapObject } = useMapObjectStore()
    const maps = useMapStore((s) => s.Maps)
    const selectedMapId = useMapStore((s) => s.selectedMapId)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)

    const selectedMap = maps.find((m) => m._id === selectedMapId) ?? null
    const centerPoint = getMapCenterPoint(selectedMap)

    const handleCreate = async () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        if (!centerPoint) {
            alert('У выбранной карты нет корректной геометрии.')
            return
        }

        setLoading(true)

        try {
            const object = await createMapObject({
                map_id: selectedMapId,
                type: 'Route',
                name: title.trim(),
                description: description.trim(),
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                location: buildDefaultRoute(centerPoint),
                image_path: 'route_icon.png',
            })

            addMapObject(object)
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

                <label className="create-form__label" htmlFor="tags">Теги (через запятую)</label>
                <input
                    id="tags"
                    className="create-form__input"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="лесная тропа, пешком"
                />

                <div className="card__desc">
                    Геометрия маршрута создается как линия около центра выбранной карты.
                </div>

                <div className="create-form__actions">
                    <button className="create-form__btn" onClick={handleCreate} disabled={loading}>
                        Создать
                    </button>
                    <button className="create-form__btn create-form__btn--ghost" onClick={() => setAdditionalOpen(false)}>
                        Отмена
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default CreateRoutePanel