import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { BsFillTrashFill } from 'react-icons/bs';
import { deleteMapObject, useLoadMapObjectsByType } from '../../../../api/mapObjects';
import { useMapObjectStore } from '../../../../stores/mapObjectStore';
import { useMapStore } from '../../../../stores/mapsStore';

type ListPointPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListPointsPanel = ({setAdditionalOpen, setOpen} : ListPointPanelProps) => {
    const { loading, error } = useLoadMapObjectsByType('Point');
    const selectedMapId = useMapStore((s) => s.selectedMapId);
    const points = useMapObjectStore((s) => s.MapObjects)
        .filter((item) => item.type === 'Point' && (!selectedMapId || String(item.map_id) === selectedMapId));
    const { removeMapObject } = useMapObjectStore();

    const handleDelete = async (id: string) => {
        try {
            await deleteMapObject(id);
            removeMapObject(id);
        } catch {
            alert('Не удалось удалить отметку!');
        }
    };

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
                    <article key={point._id} className="card">
                        <div className="card__avatar">
                            <img className='card__icon' src={`/src/assets/images/${point.image_path}`} alt="point" />
                        </div>
                        <div className="card__content">
                            <div className="card__title">{point.name}</div>
                            <div className="card__desc">{point.description}</div>
                            <div className="card__actions">
                                {point.updated_at
                                    ? `ред. ${new Date(point.updated_at).toLocaleDateString()}`
                                    : new Date(point.created_at).toLocaleDateString()}
                                <div className='card__actions__container'>
                                    <BsFillTrashFill
                                        className="card__action_icon card__btn--danger"
                                        onClick={() => handleDelete(point._id)}
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

export default ListPointsPanel