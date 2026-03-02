import { Outlet } from 'react-router-dom'
import TopBar from '../TopBar/TopBar'
import Sidebar from '../Sidebar/Sidebar'
import './Layout.css'

const Layout = () => {
    return (
        <div className="layout">
            <TopBar />
            <div className="layout__body">
                <Sidebar />
                <main className="layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Layout;