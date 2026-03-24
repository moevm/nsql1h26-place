import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { BsFillTrashFill } from 'react-icons/bs';
import { deleteMapObject, useLoadMapObjectsByType } from '../../../../api/mapObjects';
import { useMapObjectStore } from '../../../../stores/mapObjectStore';
import { useMapStore } from '../../../../stores/mapsStore';

type ListRoutesPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListRoutesPanel = ({setAdditionalOpen, setOpen} : ListRoutesPanelProps) => {
    const { loading, error } = useLoadMapObjectsByType('Route');
    const selectedMapId = useMapStore((s) => s.selectedMapId);
    const routes = useMapObjectStore((s) => s.MapObjects)
        .filter((item) => item.type === 'Route' && (!selectedMapId || String(item.map_id) === selectedMapId));
    const { removeMapObject } = useMapObjectStore();

    const handleDelete = async (id: string) => {
        try {
            await deleteMapObject(id);
            removeMapObject(id);
        } catch {
            alert('Не удалось удалить маршрут!');
        }
    };

    return (
        <aside className="panel panel--primary">
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
                {loading && <div className="list__empty">Загружаю маршруты...</div>}
                {error && <div className="list__empty">Ошибка: {error.message}</div>}
                {!loading && routes.length === 0 && <div className="list__empty">Маршрутов пока нет</div>}
                {routes.map((route) => (
                    <article key={route._id} className="card">
                        <div className="card__avatar">
                            <img className='card__icon' src={`/src/assets/images/${route.image_path}`} alt="route" />
                        </div>
                        <div className="card__content">
                            <div className="card__title">{route.name}</div>
                            <div className="card__desc">{route.description}</div>
                            <div className="card__actions">
                                {route.updated_at
                                    ? `ред. ${new Date(route.updated_at).toLocaleDateString()}`
                                    : new Date(route.created_at).toLocaleDateString()}
                                <div className='card__actions__container'>
                                    <BsFillTrashFill
                                        className="card__action_icon card__btn--danger"
                                        onClick={() => handleDelete(route._id)}
                                    />
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default ListRoutesPanel