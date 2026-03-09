import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../api/auth'
import { saveAuthSession } from '../../auth/storage'
import './AuthPage.css'

type AuthPageProps = {
    mode: 'login' | 'register'
}

const AuthPage = ({ mode }: AuthPageProps) => {
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
            if (mode === 'register') {
                await register({ username, password })
                navigate('/auth/login')
                return
            }

            const response = await login({ username, password })
            saveAuthSession(response.token, response.user)
            navigate('/')
        }

        catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'message' in err) {
                setError(String(err.message))
            } else {
                setError('Произошла ошибка')
            }
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
                        type="button"
                        className={mode === 'login' ? 'auth-card__tab auth-card__tab--active' : 'auth-card__tab'}
                        onClick={() => { setError(''); navigate('/auth/login') }}
                    >
                        Вход
                    </button>
                    <button
                        type="button"
                        className={mode === 'register' ? 'auth-card__tab auth-card__tab--active' : 'auth-card__tab'}
                        onClick={() => { setError(''); navigate('/auth/register') }}
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
                        {loading ? '...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AuthPage;