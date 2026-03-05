import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import type { Point } from '../../../../models/Point';

type ListPointPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListPointsPanel = ({setAdditionalOpen, setOpen} : ListPointPanelProps) => {
    const points: Point[] = [];

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
                {points.map((point) => (
                    <article key={point.id} className="card">
                        <div className="card__avatar">image</div>
                        <div className="card__content">
                            <div className="card__title">{point.title}</div>
                            <div className="card__desc">{point.description}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default ListPointsPanel