import { useEffect, useState } from 'react'
import '../Panels.css'
import { LuMinus, LuPlus, LuX } from 'react-icons/lu'
import { createMapObject } from '../../../../api/mapObjects'
import { useMapObjectStore } from '../../../../stores/mapObjectStore'
import { useMapStore } from '../../../../stores/mapsStore'
import { buildCircleArea } from '../objectGeometry'

type CreateAreaPanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const min_radius = 1
const max_radius = 500

const CreateAreaPanel = ({setAdditionalOpen} : CreateAreaPanelProps) => {
    const addMapObject = useMapObjectStore((s) => s.addMapObject)
    const pointPlacementActive = useMapObjectStore((s) => s.pointPlacementActive)
    const pointPlacementCoordinates = useMapObjectStore((s) => s.pointPlacementCoordinates)
    const setPointPlacementActive = useMapObjectStore((s) => s.setPointPlacementActive)
    const setPointPlacementCoordinates = useMapObjectStore((s) => s.setPointPlacementCoordinates)
    const areaDraftRadius = useMapObjectStore((s) => s.areaDraftRadius)
    const setAreaDraftRadius = useMapObjectStore((s) => s.setAreaDraftRadius)
    const setAreaDraftActive = useMapObjectStore((s) => s.setAreaDraftActive)
    const selectedMapId = useMapStore((s) => s.selectedMapId)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)
    const [radius, setRadius] = useState(min_radius)

    useEffect(() => {
        setAreaDraftActive(true)
        setAreaDraftRadius(min_radius)
        setRadius(min_radius)

        return () => {
            setAreaDraftActive(false)
            setAreaDraftRadius(min_radius)
            setPointPlacementActive(false)
            setPointPlacementCoordinates(null)
        }
    }, [
        setAreaDraftActive,
        setAreaDraftRadius,
        setPointPlacementActive,
        setPointPlacementCoordinates,
    ])

    const handleRadiusChange = (newValue: number) => {
        setRadius(newValue)
        setAreaDraftRadius(newValue)
    }


    const handleCreate = async () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        if (!pointPlacementCoordinates) {
            alert('Сначала укажите центр области кнопкой "Поставить метку на карте".')
            return
        }

        const location = buildCircleArea(
            { type: 'Point', coordinates: pointPlacementCoordinates },
            areaDraftRadius,
        )

        setLoading(true)

        try {
            const object = await createMapObject({
                map_id: selectedMapId,
                type: 'Area',
                name: title.trim(),
                description: description.trim(),
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
                location,
                image_path: 'area_icon.png',
            })

            addMapObject(object)
            handleClose()
        } catch {
            alert('Не удалось создать область!')
        } finally {
            setLoading(false)
        }
    }

    const handleStartPointPlacement = () => {
        if (!selectedMapId) {
            alert('Сначала выберите карту.')
            return
        }

        setPointPlacementCoordinates(null)
        setPointPlacementActive(true)
    }

    const handleClose = () => {
        setAreaDraftActive(false)
        setAreaDraftRadius(min_radius)
        setRadius(min_radius)
        setPointPlacementActive(false)
        setPointPlacementCoordinates(null)
        setAdditionalOpen(false)
    }

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание области</h3>
                <LuX className='panel__close' onClick={handleClose} />
            </div>
            <div className="create-form">
                <label className="create-form__label" htmlFor="title">Название</label>
                <input
                    id="title"
                    className="create-form__input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Например: Область подосиновиков"
                />

                <label className="create-form__label" htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    className="create-form__textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Краткое описание области"
                />
                <hr className='divider' />

                <label className="create-form__label" htmlFor="tags">Выделение области</label>
                <button
                    type="button"
                    className="create-form__btn"
                    onClick={handleStartPointPlacement}
                    disabled={!selectedMapId}
                >
                    {pointPlacementActive ? 'Ожидание клика по карте...' : 'Поставить метку на карте'}
                </button>

                <hr className='divider' />

                <div className="create-form__label-row">
                    <label className="create-form__label" htmlFor="radius">{`Радиус (м): ${radius}`}</label>
                    <div className="create-form__radius-actions">
                        <LuMinus
                            cursor="pointer"
                            color='#51704A'
                            size={32}
                            onClick={() => handleRadiusChange(radius - 1)}
                        />
                        <LuPlus
                            cursor="pointer"
                            color='#51704A'
                            size={32}
                            onClick={() => handleRadiusChange(radius + 1)}
                        />
                    </div>
                </div>

                <div className="search-panel__range-row">
                    <input
                        className="search-panel__range-input"
                        type="range"
                        min={min_radius}
                        max={max_radius}
                        step={1}
                        value={radius}
                        onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    />
                </div>

                <hr className='divider' />

                <label className="create-form__label" htmlFor="tags">Теги (через запятую)</label>
                <input
                    id="tags"
                    className="create-form__input"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="грибная зона, опушка"
                />

                <hr className='divider' />

                <div className="create-form__actions">
                    <button className="create-form__btn" onClick={handleCreate} disabled={loading}>
                        Создать
                    </button>
                    <button className="create-form__btn create-form__btn--ghost" onClick={handleClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default CreateAreaPanel