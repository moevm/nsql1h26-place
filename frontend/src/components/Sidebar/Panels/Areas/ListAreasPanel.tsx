import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { BsFillTrashFill } from 'react-icons/bs';
import { deleteMapObject, useLoadMapObjectsByType } from '../../../../api/mapObjects';
import { useMapObjectStore } from '../../../../stores/mapObjectStore';
import { useMapStore } from '../../../../stores/mapsStore';

type ListAreasPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListAreasPanel = ({setAdditionalOpen, setOpen} : ListAreasPanelProps) => {
    const { loading, error } = useLoadMapObjectsByType('Area');
    const selectedMapId = useMapStore((s) => s.selectedMapId);
    const areas = useMapObjectStore((s) => s.MapObjects)
        .filter((item) => item.type === 'Area' && (!selectedMapId || String(item.map_id) === selectedMapId));
    const { removeMapObject } = useMapObjectStore();

    const handleDelete = async (id: string) => {
        try {
            await deleteMapObject(id);
            removeMapObject(id);
        } catch {
            alert('Не удалось удалить область!');
        }
    };

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Области</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <button className="card card--add" onClick={() => setAdditionalOpen(true)}>
                    <div className="card__avatar"><LuPlus /></div>
                    <div className="card__content">
                        <div className="card__title">Добавить область</div>
                        <div className="card__desc">Создать новую область</div>
                    </div>
                </button>
                <hr className="divider" />
                {loading && <div className="list__empty">Загружаю области...</div>}
                {error && <div className="list__empty">Ошибка: {error.message}</div>}
                {!loading && areas.length === 0 && <div className="list__empty">Областей пока нет</div>}
                {areas.map((area) => (
                    <article key={area._id} className="card">
                        <div className="card__avatar">
                            <img className='card__icon' src={`/src/assets/images/${area.image_path}`} alt="area" />
                        </div>
                        <div className="card__content">
                            <div className="card__title">{area.name}</div>
                            <div className="card__desc">{area.description}</div>
                            <div className="card__actions">
                                {area.updated_at
                                    ? `ред. ${new Date(area.updated_at).toLocaleDateString()}`
                                    : new Date(area.created_at).toLocaleDateString()}
                                <div className='card__actions__container'>
                                    <BsFillTrashFill
                                        className="card__action_icon card__btn--danger"
                                        onClick={() => handleDelete(area._id)}
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

export default ListAreasPanel