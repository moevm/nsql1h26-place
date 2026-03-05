import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import type { Map } from '../../../../models/Map';

type ListMapsPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListMapsPanel = ({setAdditionalOpen, setOpen} : ListMapsPanelProps) => {
    const maps: Map[] = [];

    return (
        <aside className="panel panel--primary">
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
                {maps.map((map) => (
                    <article key={map.id} className="card">
                        <div className="card__avatar">image</div>
                        <div className="card__content">
                            <div className="card__title">{map.title}</div>
                            <div className="card__desc">{map.description}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default ListMapsPanel