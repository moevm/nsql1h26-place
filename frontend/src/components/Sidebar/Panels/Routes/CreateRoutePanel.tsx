import { useState } from 'react'
import '../Panels.css'

type CreateRoutePanelProps = {
    setAdditionalOpen: (val: boolean) => void
}

const CreateRoutePanel = ({setAdditionalOpen} : CreateRoutePanelProps) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    return (
        <aside className="panel panel--slide">
            <div className="panel__header">
                <h3>Создание маршрута</h3>
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

                <div className="create-form__actions">
                    <button className="create-form__btn">
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