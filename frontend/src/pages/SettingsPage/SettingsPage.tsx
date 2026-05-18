import { TbPaperclip } from 'react-icons/tb'
import './SettingsPage.css'

const SettingsPage = () => {
    return (
        <div className="settings-page">
            <div className="settings-page__content">
                <div className="settings-page__avatar">
                    <img src="/src/assets/images/avatar.jpg" alt="user avatar" />
                </div>
                <h1 className="settings-page__name">Имя пользователя</h1>

                <div className="settings-page__divider" aria-hidden="true" />

                <h2 className="settings-page__section-title">Изменение данных пользователя</h2>

                <div className="settings-page__form">
                    <div className="settings-page__field">
                        <label htmlFor="userName">Имя пользователя</label>
                        <input
                            id="userName"
                            type="text"
                            className="settings-page__input"
                            placeholder="Введите имя"
                        />
                    </div>
                    <div className="settings-page__field">
                        <label htmlFor="userAvatar">Изменить изображение пользователя</label>
                        <div className="settings-page__file">
                            <input
                                id="userAvatar"
                                type="file"
                                className="settings-page__input settings-page__input--file"
                            />
                            <TbPaperclip className="settings-page__file-icon" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <button className="settings-page__button" type="button">
                    Принять
                </button>

                <div className="settings-page__divider" aria-hidden="true" />
            </div>
        </div>
    )
}

export default SettingsPage;