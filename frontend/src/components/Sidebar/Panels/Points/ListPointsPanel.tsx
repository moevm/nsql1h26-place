import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { BsFillTrashFill } from 'react-icons/bs';
import { deleteMapObject, updateMapObject, useLoadMapObjectsByType } from '../../../../api/mapObjects';
import { useMapObjectStore } from '../../../../stores/mapObjectStore';
import { useMapStore } from '../../../../stores/mapsStore';
import { GrEdit } from 'react-icons/gr';
import { FaSave } from 'react-icons/fa';
import { useState } from 'react';
import type { UpdateMapObject } from '../../../../models/MapObject';

type ListPointPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListPointsPanel = ({setAdditionalOpen, setOpen} : ListPointPanelProps) => {
    const { loading, error } = useLoadMapObjectsByType('Point');
    const [ edit, setEdit ] = useState("");
    const [ updatedMapObject, setUpdatedMapObject ] = useState<UpdateMapObject>({})
    const mapObjectStore = useMapObjectStore();

    const selectedMapId = useMapStore((s) => s.selectedMapId);
    const points = mapObjectStore.MapObjects
        .filter((item) => item.type === 'Point' && (!selectedMapId || String(item.map_id) === selectedMapId));

    const handleDelete = async (id: string) => {
        try {
            await deleteMapObject(id);
            mapObjectStore.removeMapObject(id);
        } catch (err) {
            alert('Не удалось удалить отметку!');
            console.log(err)
        }
    };

    const handleSave = async (id: string) => {
        try {
            const mapObject = await updateMapObject(id, updatedMapObject);
            updateMapObject(id, mapObject);
        } catch (err) {
            alert("Не удалось обновить точку!")
            console.log(err)
        }

        setEdit("")
        setUpdatedMapObject({})
    }

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Отметки</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <button className="card card--add" onClick={() => setAdditionalOpen(true)}>
                    <div className="card__avatar"><LuPlus /></div>
                    <div className="card__content">
                        <div className="card__title">Добавить отметку</div>
                        <div className="card__desc">Создать новую отметку</div>
                    </div>
                </button>
                <hr className="divider" />
                {loading && <div className="list__empty">Загружаю отметки...</div>}
                {error && <div className="list__empty">Ошибка: {error.message}</div>}
                {!loading && points.length === 0 && <div className="list__empty">Отметок пока нет</div>}
                {points.map((point) => (
                    edit === point._id ? (
                        <article
                            key={point._id}
                            className={`card ${mapObjectStore.selectedMapObjectId === point._id ? 'card--selected' : ''}`}
                            onClick={() => mapObjectStore.setSelectedMapObjectId(point._id)}
                        >
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${point.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <input
                                            type="text"
                                            className='card__title'
                                            value={updatedMapObject.name ?? point.name}
                                            onChange={(e) => setUpdatedMapObject(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className='create-form__textarea'
                                    value={updatedMapObject.description ?? point.description}
                                    onChange={(e) => setUpdatedMapObject(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <div className="card__actions">
                                    {point.updated_at ? "ред. " + new Date(point.updated_at).toLocaleDateString() : new Date(point.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <GrEdit
                                            className='card__action_icon card__btn--safe'
                                            onClick={() => setEdit(point._id)}
                                        />
                                        <FaSave
                                            className='card__action_icon card__btn--safe'
                                            onClick={() => handleSave(point._id)}
                                        />
                                        <LuX
                                            className='card__action_icon card__btn--danger'
                                            onClick={() => setEdit("")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ) : (
                        <article
                            key={point._id}
                            className={`card ${mapObjectStore.selectedMapObjectId === point._id ? 'card--selected' : ''}`}
                            onClick={() => mapObjectStore.setSelectedMapObjectId(point._id)}
                        >
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${point.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <div className='card__title'>{point.name}</div>
                                    </div>
                                </div>
                                <div className='card__description'>{point.description}</div>
                                <div className="card__actions">
                                    {point.updated_at ? "ред. " + new Date(point.updated_at).toLocaleDateString() : new Date(point.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <GrEdit
                                            className='card__action_icon card__btn--safe'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEdit(point._id);
                                            }}
                                        />
                                        <FaSave className='card__action_icon card__btn--inactive' />
                                        <BsFillTrashFill
                                            className="card__action_icon card__btn--danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(point._id);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    )
                ))}
            </div>
        </aside>
    )
}

export default ListPointsPanel