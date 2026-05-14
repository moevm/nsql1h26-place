import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import { BsFillTrashFill } from 'react-icons/bs';
import { deleteMapObject, updateMapObject, useLoadMapObjectsByType } from '../../../../api/mapObjects';
import { useMapObjectStore } from '../../../../stores/mapObjectStore';
import { useMapStore } from '../../../../stores/mapsStore';
import { GrEdit } from 'react-icons/gr';
import { FaSave } from 'react-icons/fa';
import { useState, type UIEvent } from 'react';
import type { UpdateMapObject } from '../../../../models/MapObject';
import TagSelector from '../../../TagSelector/TagSelector';

type ListAreaPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListAreasPanel = ({setAdditionalOpen, setOpen} : ListAreaPanelProps) => {
    const { loading, error, loadMore, hasMore } = useLoadMapObjectsByType('Area');
    const [ edit, setEdit ] = useState("");
    const [ updatedMapObject, setUpdatedMapObject ] = useState<UpdateMapObject>({})
    const [ tagsDraft, setTagsDraft ] = useState<string[]>([]);
    const mapObjectStore = useMapObjectStore();

    const selectedMapId = useMapStore((s) => s.selectedMapId);
    const areas = mapObjectStore.MapObjects
        .filter((item) => item.type === 'Area' && (!selectedMapId || String(item.map_id) === selectedMapId));

    const handleDelete = async (id: string) => {
        try {
            await deleteMapObject(id);
            mapObjectStore.removeMapObject(id);
        } catch (err) {
            alert('Не удалось удалить область!');
            console.log(err)
        }
    };

    const handleEdit = (id: string, currentTags: string[]) => {
        setEdit(id);
        setUpdatedMapObject({});
        setTagsDraft(currentTags);
    };

    const handleSave = async (id: string) => {
        try {
            const area = await updateMapObject(id, { ...updatedMapObject, tags: tagsDraft });
            mapObjectStore.updateMapObject(area);
        } catch (err) {
            alert("Не удалось обновить область!")
            console.log(err)
        }

        setEdit("")
        setUpdatedMapObject({})
        setTagsDraft([])
    }

    const handleCancel = () => {
        setEdit("")
        setUpdatedMapObject({})
        setTagsDraft([])
    }

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
                {loading && areas.length === 0 && <div className="list__empty">Загружаю области...</div>}
                {error && <div className="list__empty">Ошибка: {error.message}</div>}
                {!loading && areas.length === 0 && <div className="list__empty">Областей пока нет</div>}
                {areas.map((area) => (
                    edit === area._id ? (
                        <article
                            key={area._id}
                            className={`card ${mapObjectStore.selectedMapObjectId === area._id ? 'card--selected' : ''}`}
                            onClick={() => mapObjectStore.setSelectedMapObjectId(area._id)}
                        >
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${area.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <input
                                            type="text"
                                            className='card__title'
                                            value={updatedMapObject.name ?? area.name}
                                            onChange={(e) => setUpdatedMapObject(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className='create-form__textarea'
                                    value={updatedMapObject.description ?? area.description}
                                    onChange={(e) => setUpdatedMapObject(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <TagSelector value={tagsDraft} onChange={setTagsDraft} />
                                <div className="card__actions">
                                    {area.updated_at ? "ред. " + new Date(area.updated_at).toLocaleDateString() : new Date(area.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <FaSave
                                            className='card__action_icon card__btn--safe'
                                            onClick={() => handleSave(area._id)}
                                        />
                                        <LuX
                                            className='card__action_icon card__btn--danger'
                                            onClick={handleCancel}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ) : (
                        <article
                            key={area._id}
                            className={`card ${mapObjectStore.selectedMapObjectId === area._id ? 'card--selected' : ''}`}
                            onClick={() => mapObjectStore.setSelectedMapObjectId(area._id)}
                        >
                            <div className="card__content">
                                <div className='card__title_container'>
                                    <img className='card__icon' src={`/src/assets/images/${area.image_path}`} alt="logo" />
                                    <div className='card__right_container'>
                                        <div className='card__title'>{area.name}</div>
                                    </div>
                                </div>
                                <div className='card__description'>{area.description}</div>
                                {area.tags.length > 0 && (
                                    <div className="card__tags">
                                        {area.tags.map((tag) => (
                                            <span key={tag} className="tag-chip">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="card__actions">
                                    {area.updated_at ? "ред. " + new Date(area.updated_at).toLocaleDateString() : new Date(area.created_at).toLocaleDateString()}
                                    <div className='card__actions__container'>
                                        <GrEdit
                                            className='card__action_icon card__btn--safe'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(area._id, area.tags);
                                            }}
                                        />
                                        <FaSave className='card__action_icon card__btn--inactive' />
                                        <BsFillTrashFill
                                            className="card__action_icon card__btn--danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(area._id);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    )
                ))}
                {loading && areas.length > 0 && (
                    <div className="list__empty">Загружаю еще области...</div>
                )}
                {!loading && !hasMore && areas.length > 0 && (
                    <div className="list__empty">Больше нет областей</div>
                )}
            </div>
        </aside>
    )
}

export default ListAreasPanel;
