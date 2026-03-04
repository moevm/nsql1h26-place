import { LuPlus } from 'react-icons/lu'
import type { Map } from '../../../models/Map'
import './MapsPanels.css'

type ListMapsPanelProps = {
    isOpen: boolean
    maps: Map[]
    onAddClick: () => void
}

const ListMapsPanel = ({ isOpen, maps, onAddClick }: ListMapsPanelProps) => {
    if (!isOpen) return null

    return (
        <aside className="maps-panel maps-panel--primary">
            <div className="maps-panel__header">
                <h3>Карты</h3>
            </div>
            <div className="maps-list">
                <button className="map-card map-card--add" onClick={onAddClick}>
                    <div className="map-card__avatar"><LuPlus /></div>
                    <div className="map-card__content">
                        <div className="map-card__title">Добавить карту</div>
                        <div className="map-card__desc">Создать новую карту</div>
                    </div>
                </button>

                <hr className="map__divider" />

                {maps.map((map) => (
                    <article key={map.id} className="map-card">
                        <div className="map-card__avatar">{map.avatar}</div>
                        <div className="map-card__content">
                            <div className="map-card__title">{map.title}</div>
                            <div className="map-card__desc">{map.description}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default ListMapsPanel