import './SettingsPage.css'

const SettingsPage = () => {
    return (
        <div className="settings-page">
            <h1>Настройки</h1>
            <p className="settings-page__subtitle">Управление аккаунтом и предпочтениями</p>

            <div className="settings-page__section">
                <h2>Профиль</h2>
                <div className="settings-page__placeholder">
                    Настройки профиля будут здесь
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;