import { useEffect, useState } from 'react'
import './MapsPanels.css'

type CreateMapPanelProps = {
    isOpen: boolean
    onCreate: (payload: { title: string; description: string }) => void
    onCancel: () => void
}

const CreateMapPanel = ({ isOpen, onCreate, onCancel }: CreateMapPanelProps) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (!isOpen) {
            setTitle('')
            setDescription('')
        }
    }, [isOpen])

    const handleCreate = () => {
        const trimmedTitle = title.trim()
        const trimmedDescription = description.trim()
        if (!trimmedTitle) return

        onCreate({
            title: trimmedTitle,
            description: trimmedDescription || 'Без описания',
        })

        setTitle('')
        setDescription('')
    }

    if (!isOpen) return null

    return (
        <aside className="maps-panel maps-panel--slide">
            <div className="maps-panel__header">
                <h3>Создание карты</h3>
            </div>
            <div className="create-map-form">
                <label className="create-map-form__label" htmlFor="map-title">Название</label>
                <input
                    id="map-title"
                    className="create-map-form__input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Например: Карта подосиновиков"
                />

                <label className="create-map-form__label" htmlFor="map-description">Описание</label>
                <textarea
                    id="map-description"
                    className="create-map-form__textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Краткое описание карты"
                />

                <div className="create-map-form__actions">
                    <button className="create-map-form__btn" onClick={handleCreate}>
                        Создать
                    </button>
                    <button className="create-map-form__btn create-map-form__btn--ghost" onClick={onCancel}>
                        Отмена
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default CreateMapPanel