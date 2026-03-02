import { useNavigate } from 'react-router-dom'
import { TbGraphFilled, TbSettingsFilled } from 'react-icons/tb';
import './TopBar.css'

const TopBar = () => {
    const navigate = useNavigate()

    return (
        <header className="topbar">
            <div className="topbar__left">
                <img onClick={() => navigate('/')} className='topbar__icon-img--user' src="/src/assets/images/mushroom.png" alt="logo" />
            </div>

            <span className="topbar__brand">Mushroom Place</span>

            <div className="topbar__right">
                <button className="topbar__icon-btn" title="Статистика" onClick={() => navigate('/statistics')}>
                    <TbGraphFilled size={"48px"} />
                </button>

                <button className="topbar__icon-btn" title="Настройки" onClick={() => navigate('/settings')}>
                    <TbSettingsFilled size={"48px"} />
                </button>

                <div className="topbar__icon-btn topbar__icon-btn--user">
                    <img className='topbar__icon-img--user' src="/src/assets/images/avatar.jpg" alt="user" />
                </div>
            </div>
        </header>
    )
}

export default TopBar;