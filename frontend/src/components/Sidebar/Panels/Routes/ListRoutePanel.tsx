import { LuPlus, LuX } from 'react-icons/lu'
import '../Panels.css'
import type { Route } from '../../../../models/Route';

type ListRoutesPanelProps = {
    setOpen: (val: boolean) => void,
    setAdditionalOpen: (val: boolean) => void,
}

const ListRoutesPanel = ({setAdditionalOpen, setOpen} : ListRoutesPanelProps) => {
    const routes: Route[] = [];

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
                {routes.map((route) => (
                    <article key={route.id} className="card">
                        <div className="card__avatar">image</div>
                        <div className="card__content">
                            <div className="card__title">{route.title}</div>
                            <div className="card__desc">{route.description}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default ListRoutesPanel