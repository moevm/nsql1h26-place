import { useState } from 'react'
import '../Panels.css'
import { LuX } from 'react-icons/lu'
import { createMapObject } from '../../../../api/mapObjects'
import { useMapObjectStore } from '../../../../stores/mapObjectStore'
import { useMapStore } from '../../../../stores/mapsStore'
import { getMapCenterPoint } from '../objectGeometry'

type CreatePointPanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const CreatePointPanel = ({setAdditionalOpen} : CreatePointPanelProps) => {
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
                type: 'Point',
                name: title.trim(),
                description: description.trim(),
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                location: centerPoint,
                image_path: 'map_icon.png',
            })

            addMapObject(object)
            setAdditionalOpen(false)
        } catch {
            alert('Не удалось создать отметку!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание отметки</h3>
                <LuX className='panel__close' onClick={() => setAdditionalOpen(false)} />
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

                <div className="card__desc">
                    Геометрия точки берется из центра выбранной карты.
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

export default CreatePointPanel