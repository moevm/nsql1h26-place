import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthPage.css'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            navigate('/')
        }

        catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка')
        }

        finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <h1 className="auth-card__title">Mushroom Place</h1>
                </div>

                <div className="auth-card__tabs">
                    <button
                        className={isLogin ? "auth-card__tab auth-card__tab--active" : "auth-card__tab"}
                        onClick={() => { setIsLogin(true); setError('') }}
                    >
                        Вход
                    </button>
                    <button
                        className={isLogin ? "auth-card__tab" : "auth-card__tab auth-card__tab--active"}
                        onClick={() => { setIsLogin(false); setError('') }}
                    >
                        Регистрация
                    </button>
                </div>

                <form className="auth-card__form" onSubmit={handleSubmit}>
                    <div className="auth-card__field">
                        <label htmlFor="username">Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите имя пользователя"
                            required
                        />
                    </div>

                    <div className="auth-card__field">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>

                    {error && <div className="auth-card__error">{error}</div>}

                    <button className="auth-card__submit" type="submit" disabled={loading}>
                        {loading ? '...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage;