import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { BsFillTrashFill } from 'react-icons/bs';
import { deleteMapObject, updateMapObject, useLoadMapObjectsByType } from '../../../../api/mapObjects';
import { useMapObjectStore } from '../../../../stores/mapObjectStore';
import { useMapStore } from '../../../../stores/mapsStore';
import { useState, type UIEvent } from 'react';
import type { UpdateMapObject } from '../../../../models/MapObject';
import { FaSave } from 'react-icons/fa';
import { GrEdit } from 'react-icons/gr';

type ListRoutesPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListRoutesPanel = ({setAdditionalOpen, setOpen} : ListRoutesPanelProps) => {
    const { loading, error, loadMore, hasMore } = useLoadMapObjectsByType('Route');
    const mapObjectStore = useMapObjectStore();
    const selectedMapId = useMapStore((s) => s.selectedMapId);
    const [ edit, setEdit ] = useState('');
    const [ updatedMapObject, setUpdatedMapObject ] = useState<UpdateMapObject>({});
    const [tagsValue, setTagsValue] = useState('');

    const routes = mapObjectStore.MapObjects
        .filter((item) => item.type === 'Route' && (!selectedMapId || String(item.map_id) === selectedMapId));

    const handleEdit = (routeId: string, routeTags: string[]) => {
        setEdit(routeId);
        setUpdatedMapObject({});
        setTagsValue(routeTags.join(', '));
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMapObject(id);
            mapObjectStore.removeMapObject(id);
        } catch (err) {
            alert('Не удалось удалить маршрут!');
            console.log(err)
        }
    };

    const handleSave = async (id: string) => {
        try {
            const payload: UpdateMapObject = {
                ...updatedMapObject,
                tags: tagsValue.split(',').map((tag) => tag.trim()).filter(Boolean),
            };

            const mapObject = await updateMapObject(id, payload);
            mapObjectStore.updateMapObject(mapObject);
        } catch (err) {
            alert("Не удалось обновить маршрут!")
            console.log(err)
        }

        setEdit('')
        setUpdatedMapObject({})
        setTagsValue('')
    };

    const handleScroll = (event: UIEvent<HTMLElement>) => {
        if (loading || !hasMore) return;
        const target = event.currentTarget;
        const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;
        if (remaining < 80) {
            loadMore();
        }
    };

    return (
        <aside className="panel panel--primary" onScroll={handleScroll}>
            <div className="panel__header">
                <h3>Маршрут</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <button className="card card--add" onClick={() => setAdditionalOpen(true)}>
                    <div className="card__avatar"><LuPlus /></div>
                    <div className="card__content">
                        <div className="card__title">Добавить маршрут</div>
                        <div className="card__desc">Создать новый маршрут</div>
                    </div>
                </button>
                <hr className="divider" />
                {loading && routes.length === 0 && <div className="list__empty">Загружаю маршруты...</div>}
                {error && <div className="list__empty">Ошибка: {error.message}</div>}
                {!loading && routes.length === 0 && <div className="list__empty">Маршрутов пока нет</div>}
                {routes.map((route) => (
                    edit === route._id ? (
                        <article
                            key={route._id}
                            className={`card ${mapObjectStore.selectedMapObjectId === route._id ? 'card--selected' : ''}`}
                            onClick={() => mapObjectStore.setSelectedMapObjectId(route._id)}
                        >
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${route.image_path}`} alt="route" />
                                    <div className='card__right_container'>
                                        <input
                                            type="text"
                                            className='card__title'
                                            value={updatedMapObject.name ?? route.name}
                                            onChange={(event) => setUpdatedMapObject((prev) => ({ ...prev, name: event.target.value }))}
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className='create-form__textarea'
                                    value={updatedMapObject.description ?? route.description}
                                    onChange={(event) => setUpdatedMapObject((prev) => ({ ...prev, description: event.target.value }))}
                                />
                                <div className="card__actions">
                                    {route.updated_at
                                        ? `ред. ${new Date(route.updated_at).toLocaleDateString()}`
                                        : new Date(route.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <FaSave
                                            className='card__action_icon card__btn--safe'
                                            onClick={() => handleSave(route._id)}
                                        />
                                        <LuX
                                            className='card__action_icon card__btn--danger'
                                            onClick={() => {
                                                setEdit('');
                                                setUpdatedMapObject({});
                                                setTagsValue('');
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ) : (
                        <article
                            key={route._id}
                            className={`card ${mapObjectStore.selectedMapObjectId === route._id ? 'card--selected' : ''}`}
                            onClick={() => mapObjectStore.setSelectedMapObjectId(route._id)}
                        >
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${route.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <div className='card__title'>{route.name}</div>
                                    </div>
                                </div>
                                <div className='card__description'>{route.description}</div>
                                <div className="card__actions">
                                    {route.updated_at ? "ред. " + new Date(route.updated_at).toLocaleDateString() : new Date(route.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <GrEdit
                                            className='card__action_icon card__btn--safe'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(route._id, route.tags);
                                            }}
                                        />
                                        <FaSave className='card__action_icon card__btn--inactive' />
                                        <BsFillTrashFill
                                            className="card__action_icon card__btn--danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(route._id);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    )
                ))}
                {loading && routes.length > 0 && (
                    <div className="list__empty">Загружаю еще маршруты...</div>
                )}
                {!loading && !hasMore && routes.length > 0 && (
                    <div className="list__empty">Больше нет маршрутов</div>
                )}
            </div>
        </aside>
    )
}

export default ListRoutesPanel