import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbGraphFilled, TbSettingsFilled } from 'react-icons/tb';
// import { useAuthStore } from '../../stores/authStore'
import './TopBar.css'

const TopBar = () => {
    const navigate = useNavigate()
    // const { logout } = useAuthStore()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const userMenuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        // logout()
        setIsUserMenuOpen(false)
        navigate('/auth')
    }

    return (
        <header className="topbar">
            <div className="topbar__left">
                <img onClick={() => navigate('/')} className='topbar__logo' src="/src/assets/images/mushroom.png" alt="logo" />
            </div>

            <span className="topbar__brand">Mushroom Place</span>

            <div className="topbar__right">
                <button className="topbar__icon-btn" title="Статистика" onClick={() => navigate('/statistics')}>
                    <TbGraphFilled />
                </button>

                <button className="topbar__icon-btn" title="Настройки" onClick={() => navigate('/settings')}>
                    <TbSettingsFilled />
                </button>

                <div className="topbar__user-menu" ref={userMenuRef}>
                    <button
                        className="topbar__icon-btn topbar__icon-btn--user"
                        title="Пользователь"
                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    >
                        <img className='topbar__icon-img--user' src="/src/assets/images/avatar.jpg" alt="user" />
                    </button>

                    {isUserMenuOpen && (
                        <div className="topbar__user-dropdown">
                            <button className="topbar__user-dropdown-btn" onClick={handleLogout}>
                                Выйти из аккаунта
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default TopBar;