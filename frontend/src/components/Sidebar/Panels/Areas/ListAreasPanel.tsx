import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import type { Area } from '../../../../models/Area';

type ListAreasPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListAreasPanel = ({setAdditionalOpen, setOpen} : ListAreasPanelProps) => {
    const areas: Area[] = [];

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
                {areas.map((area) => (
                    <article key={area.id} className="card">
                        <div className="card__avatar">image</div>
                        <div className="card__content">
                            <div className="card__title">{area.title}</div>
                            <div className="card__desc">{area.description}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default ListAreasPanel