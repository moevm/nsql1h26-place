import { useState, type ReactElement, type ReactNode } from 'react'
import './Sidebar.css'
import { CgClose } from 'react-icons/cg'
import { LuBarcode, LuFileInput, LuGrid2X2, LuMap, LuMapPinned, LuRoute, LuSearch } from 'react-icons/lu'
import ListMapsPanel from './Panels/Maps/ListMapsPanel'
import CreateMapPanel from './Panels/Maps/CreateMapPanel'
import ListPointsPanel from './Panels/Points/ListPointsPanel'
import CreatePointPanel from './Panels/Points/CreatePointPanel'
import ListRoutesPanel from './Panels/Routes/ListRoutePanel'
import CreateRoutePanel from './Panels/Routes/CreateRoutePanel'
import ListAreasPanel from './Panels/Areas/ListAreasPanel'
import CreateAreaPanel from './Panels/Areas/CreateAreaPanel'
import SearchPanel from './Panels/Search/SearchPanel'
import DataPanel from './Panels/Data/DataPanel'

type SidebarEntry = {
    id: string
    icon: ReactNode
    label: string
    component: ReactElement
    additionalComponent?: ReactElement
}

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false)
    const [activePanel, setActivePanel] = useState("")
    const [openAdditional, setOpenAdditional] = useState(false)
    const [openComponent, setOpenComponent] = useState(false)

    const SIDEBAR_ENTRIES: SidebarEntry[] = [
        {
            id: 'data',
            icon: <LuFileInput />,
            label: 'Данные',
            component: <DataPanel setOpen={setOpenComponent} />
        },
        {
            id: 'search',
            icon: <LuSearch />,
            label: 'Поиск',
            component: <SearchPanel setOpen={setOpenComponent} />,
        },
        {
            id: 'maps',
            icon: <LuMap />,
            label: 'Карты',
            component:
                <ListMapsPanel
                    setOpen={setOpenComponent}
                    setAdditionalOpen={setOpenAdditional}
                />,
            additionalComponent: <CreateMapPanel setAdditionalOpen={setOpenAdditional} />
        },
        {
            id: 'points',
            icon: <LuMapPinned />,
            label: 'Отметки',
            component:
                <ListPointsPanel
                    setOpen={setOpenComponent}
                    setAdditionalOpen={setOpenAdditional}
                />,
            additionalComponent: <CreatePointPanel setAdditionalOpen={setOpenAdditional} />
        },
        {
            id: 'routes',
            icon: <LuRoute />,
            label: 'Маршруты',
            component:
                <ListRoutesPanel
                    setOpen={setOpenComponent}
                    setAdditionalOpen={setOpenAdditional}
                />,
            additionalComponent: <CreateRoutePanel setAdditionalOpen={setOpenAdditional} />
        },
        {
            id: 'areas',
            icon: <LuGrid2X2 />,
            label: 'Области',
            component:
                <ListAreasPanel
                    setOpen={setOpenComponent}
                    setAdditionalOpen={setOpenAdditional}
                />,
            additionalComponent: <CreateAreaPanel setAdditionalOpen={setOpenAdditional} />
        },
    ]

    const handleClick = (entry: SidebarEntry) => {
        setActivePanel(entry.id);
        setOpenComponent(true);
        setOpenAdditional(false);
    }

    return (
        <div className="sidebar-area">
            <aside className={`sidebar ${expanded ? 'sidebar--open' : ''}`}>
                <div className="sidebar__content">
                    {SIDEBAR_ENTRIES.map((entry) => (
                        <button
                            key={entry.id}
                            className={`sidebar__item ${activePanel === entry.id ? 'sidebar__item--active' : ''}`}
                            onClick={() => handleClick(entry)}
                            title={entry.label}
                        >
                            <span className="sidebar__icon">{entry.icon}</span>
                            <span className="sidebar__label">{entry.label}</span>
                        </button>
                    ))}
                </div>

                <hr className="sidebar__divider" />

                <div className="sidebar__toggle-container">
                    <button
                        className="sidebar__toggle"
                        onClick={() => setExpanded(!expanded)}
                        title={expanded ? 'Свернуть панель' : 'Развернуть панель'}
                    >
                        {expanded ?
                            (<CgClose className="sidebar__icon" />) :
                            (<LuBarcode className="sidebar__icon" />)}
                    </button>
                </div>
            </aside>

            {openComponent && SIDEBAR_ENTRIES.find(e => e.id === activePanel)?.component}
            {openAdditional && SIDEBAR_ENTRIES.find(e => e.id === activePanel)?.additionalComponent}
        </div>
    )
}

export default Sidebar