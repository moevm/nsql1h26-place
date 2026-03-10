import { useState } from 'react'
import '../Panels.css'
import { createMap } from '../../../../api/maps'
import { useMapStore } from '../../../../stores/mapsStore'
import { LuX } from 'react-icons/lu'
import { useAuthStore } from '../../../../stores/authStore'

type CreateMapPanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const CreateMapPanel = ({setAdditionalOpen} : CreateMapPanelProps) => {
    const { addMap } = useMapStore()
    const { user } = useAuthStore()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [country, setCountry] = useState('')
    const [area, setArea] = useState('')
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCreateMap = async () => {
        setLoading(true)
        setError('')

        try {
            const newMap = await createMap({
                user_id: user?._id || "",
                name: name.trim(),
                description: description.trim(),
                country: country.trim(),
                area: area.trim(),
                coordinates: {x: 50.0000, y: 50.000},
                visible: visible,
                tags: [],
                image_path: "map_icon.png"
            })

            addMap(newMap)
            setAdditionalOpen(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось создать карту'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание карты</h3>
                <LuX className='panel__close' onClick={() => setAdditionalOpen(false)} />
            </div>
            <div className="create-form">
                <label htmlFor="title">Название</label>
                <input
                    id="title"
                    className="create-form__input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Например: Карта подосиновиков"
                />

                <label htmlFor="description">Описание</label>
                <textarea
                    id="description"
                    className="create-form__textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Краткое описание карты"
                />

                <hr className='divider' />

                <label htmlFor="country">Страна</label>
                <input
                    id="country"
                    className="create-form__input"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Россия"
                />

                <label htmlFor="area">Область</label>
                <input
                    id="area"
                    className="create-form__input"
                    value={area}
                    onChange={(event) => setArea(event.target.value)}
                    placeholder="Свердловское городское поселение"
                />

                <hr className='divider' />

                <label htmlFor="visible">Видимость</label>
                <select id='visible' className="create-form__input">
                    <option onClick={() => setVisible(true)}>Публичная</option>
                    <option onClick={() => setVisible(false)}>Приватная</option>
                </select>

                <hr className='divider' />

                {error && <div className="card__desc">{error}</div>}

                <div className="create-form__actions">
                    <button className="create-form__btn create-form__btn--ghost" onClick={() => setAdditionalOpen(false)}>
                        Отменить
                    </button>
                    <button className="create-form__btn card__btn--safe" onClick={handleCreateMap} disabled={loading}>
                        Принять
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default CreateMapPanel