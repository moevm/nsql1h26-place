import { useState } from 'react'
import { useMapStore } from '../../stores/mapsStore'
import ListMapsPanel from './Maps/ListMapsPanel'
import CreateMapPanel from './Maps/CreateMapPanel'
import './Sidebar.css'
import { CgClose } from 'react-icons/cg'
import { LuBarcode, LuFileInput, LuGrid2X2, LuMap, LuMapPinned, LuRoute, LuSearch } from 'react-icons/lu'

const Sidebar = () => {
    const [open, setOpen] = useState(false)
    const [mapsPanelOpen, setMapsPanelOpen] = useState(false)
    const [createPanelOpen, setCreatePanelOpen] = useState(false)

    const { Maps, addMap } = useMapStore()

    const toggleMapsPanel = () => {
        setMapsPanelOpen((prev) => {
            const next = !prev
            if (!next) {
                setCreatePanelOpen(false)
            }
            return next
        })
    }

    return (
        <>
            <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
                <div className="sidebar__content">
                    <button className="sidebar__item" onClick={() => alert('TODO: создание метки')}>
                        <LuFileInput className="sidebar__icon" />
                        <span className="sidebar__label">Данные</span>
                    </button>

                    <button className="sidebar__item" onClick={() => alert('TODO: создание метки')}>
                        <LuSearch className="sidebar__icon" />
                        <span className="sidebar__label">Поиск</span>
                    </button>

                    <button
                        className={`sidebar__item ${mapsPanelOpen ? 'sidebar__item--active' : ''}`}
                        onClick={toggleMapsPanel}
                    >
                        <LuMap className="sidebar__icon" />
                        <span className="sidebar__label">Карты</span>
                    </button>

                    <button
                        className="sidebar__item"
                        onClick={() => alert('TODO: панель отметок временно отключена')}
                    >
                        <LuMapPinned className="sidebar__icon" />
                        <span className="sidebar__label">Отметки</span>
                    </button>

                    <button
                        className="sidebar__item"
                        onClick={() => alert('TODO: панель маршрутов временно отключена')}
                    >
                        <LuRoute className="sidebar__icon" />
                        <span className="sidebar__label">Маршруты</span>
                    </button>

                    <button
                        className="sidebar__item"
                        onClick={() => alert('TODO: панель областей временно отключена')}
                    >
                        <LuGrid2X2 className="sidebar__icon" />
                        <span className="sidebar__label">Области</span>
                    </button>

                    <hr className="sidebar__divider" />
                </div>
                <div className="sidebar__toggle-container">
                    <button className="sidebar__toggle" onClick={() => setOpen(!open)} title={open ? 'Свернуть панель' : 'Развернуть панель'}>
                        {open ? <CgClose className="sidebar__icon" /> : <LuBarcode className="sidebar__icon" />}
                    </button>
                </div>
            </aside>

            <ListMapsPanel
                isOpen={mapsPanelOpen}
                maps={Maps}
                onAddClick={() => setCreatePanelOpen(true)}
            />

            <CreateMapPanel
                isOpen={mapsPanelOpen && createPanelOpen}
                onCreate={(payload) => {
                    addMap({
                        id: `map-${Date.now()}`,
                        userid: 'local-user',
                        title: payload.title,
                        description: payload.description,
                        avatar: '🗺️',
                    })
                    setCreatePanelOpen(false)
                }}
                onCancel={() => setCreatePanelOpen(false)}
            />
        </>
    )
}

export default Sidebar;