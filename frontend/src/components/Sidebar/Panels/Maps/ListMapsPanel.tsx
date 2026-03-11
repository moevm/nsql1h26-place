import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { deleteMap, updateMap, useLoadMaps } from '../../../../api/maps';
import { useMapStore } from '../../../../stores/mapsStore';
import { BsFillTrashFill } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';
import { GrEdit } from 'react-icons/gr';
import { useState } from 'react';
import type { UpdateMap } from '../../../../models/Map';

type ListMapsPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListMapsPanel = ({setAdditionalOpen, setOpen} : ListMapsPanelProps) => {
    const { error, loading } = useLoadMaps();
    const maps = useMapStore((s) => s.getSortedMaps());
    const { removeMap, updateMap: update, setSelectedMapId } = useMapStore();
    const [ edit, setEdit ] = useState("");
    const [ updatedMap, setUpdatedMap ] = useState<UpdateMap>({})
    const [ otherError, setOtherError ] = useState("")

    const handleDelete = async (map_id: string) => {
        try {
            const res = await deleteMap(map_id);
            console.log(res)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось обновить карту';
            setOtherError(message);
        }

        removeMap(map_id);
    }

    const handleSave = async (map_id: string) => {
        try {
            const map = await updateMap(map_id, updatedMap);
            update(map);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось обновить карту';
            setOtherError(message);
        }

        setEdit("")
        setUpdatedMap({})
    }

    return (
        <aside className="panel">
            <div className="panel__header">
                <h3>Карты</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <button className="card card--add" onClick={() => setAdditionalOpen(true)}>
                    <div className="card__avatar"><LuPlus /></div>
                    <div className="card__content">
                        <div className="card__title">Добавить карту</div>
                        <div className="card__desc">Создать новую карту</div>
                    </div>
                </button>
                <hr className="divider" />
                {loading && <div className="list__empty">Загружаю карты...</div>}
                {(error || otherError) && <div className="list__empty">Ошибка: {error ? error.message : otherError}</div>}
                {!loading && maps.length === 0 && <div className="list__empty">Карт пока нет</div>}
                {maps.map((map) => (
                    edit === map._id ? (
                        <article key={map._id} className="card">
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${map.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <input
                                            type="text"
                                            className='card__title'
                                            value={updatedMap.name ?? map.name}
                                            onChange={(e) => setUpdatedMap(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                        <div className="card__desc">Видимость:
                                            <select
                                                className='card__visibility'
                                                value={(updatedMap.visible ?? map.visible) ? 'public' : 'private'}
                                                onChange={(e) => setUpdatedMap(prev => ({ ...prev, visible: e.target.value === 'public' }))}
                                            >
                                                <option value="public">Публичная</option>
                                                <option value="private">Приватная</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    className='create-form__textarea'
                                    value={updatedMap.description ?? map.description}
                                    onChange={(e) => setUpdatedMap(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <div className="card__actions">
                                    {map.updated_at ? "ред. " + new Date(map.updated_at).toLocaleDateString() : new Date(map.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <GrEdit
                                            className='card__action_icon card__btn--safe'
                                            onClick={() => setEdit(map._id)}
                                        />
                                        <FaSave
                                            className='card__action_icon card__btn--safe'
                                            onClick={() => handleSave(map._id)}
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
                        <article key={map._id} className="card" onClick={() => setSelectedMapId(map._id)}>
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${map.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <div className='card__title'>{map.name}</div>
                                        <div className="card__desc">Видимость: <b>{map.visible ? "публичная" : "приватная"}</b></div>
                                    </div>
                                </div>
                                <div className='card__description'>{map.description}</div>
                                <div className="card__actions">
                                    {map.updated_at ? "ред. " + new Date(map.updated_at).toLocaleDateString() : new Date(map.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <GrEdit
                                            className='card__action_icon card__btn--safe'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEdit(map._id);
                                            }}
                                        />
                                        <FaSave className='card__action_icon card__btn--inactive' />
                                        <BsFillTrashFill
                                            className="card__action_icon card__btn--danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(map._id);
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

export default ListMapsPanel