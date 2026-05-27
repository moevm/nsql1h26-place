import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { TbPaperclip } from 'react-icons/tb'
import { getMe, updateMe } from '../../api/auth'
import { useAuthStore, type AuthUser } from '../../stores/authStore'
import './SettingsPage.css'

const DEFAULT_AVATAR = '/src/assets/images/avatar.jpg'
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

const SettingsPage = () => {
    const authUser = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const setSession = useAuthStore((state) => state.setSession)

    const [name, setName] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [profileLoading, setProfileLoading] = useState(true)

    const resolveCurrentUser = async (): Promise<AuthUser> => {
        if (authUser) {
            return authUser
        }

        const user = await getMe()
        setSession(token ?? '', user)
        return user
    }

    useEffect(() => {
        const initialize = async () => {
            if (authUser) {
                setName(authUser.username)
                setProfileLoading(false)
                return
            }

            try {
                const user = await getMe()
                setSession(token ?? '', user)
                setName(user.username)
            } catch {
                setError('Не удалось загрузить данные пользователя')
            } finally {
                setProfileLoading(false)
            }
        }

        initialize()
    }, [authUser, setSession, token])

    const avatarSrc = useMemo(() => {
        if (avatarPreview) {
            return avatarPreview
        }

        if (authUser?.image_path) {
            return authUser.image_path
        }

        return DEFAULT_AVATAR
    }, [avatarPreview, authUser])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setError('')
        const file = event.target.files?.[0] ?? null

        if (!file) {
            setSelectedFile(null)
            setAvatarPreview('')
            return
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
            setSelectedFile(null)
            setAvatarPreview('')
            setError('Неподдерживаемый формат файла. Выберите PNG, JPG или GIF')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setAvatarPreview(reader.result)
            }
        }
        reader.readAsDataURL(file)
        setSelectedFile(file)
    }

    const handleResetAvatar = async () => {
        if (!token) {
            setError('Требуется авторизация')
            return
        }

        setLoading(true)
        setError('')
        setStatus('')

        try {
            const currentUser = await resolveCurrentUser()

            await updateMe({
                username: currentUser.username,
                image_path: '',
            })

            const updatedUser = {
                ...currentUser,
                image_path: '',
            }

            setSession(token, updatedUser)

            setSelectedFile(null)
            setAvatarPreview('')
            setStatus('Аватар сброшен')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Не удалось сбросить аватар')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setStatus('')

        if (!name.trim()) {
            setError('Введите логин пользователя')
            return
        }

        if (!token) {
            setError('Требуется авторизация')
            return
        }

        setLoading(true)

        try {
            let image_path: string | undefined

            if (selectedFile) {
                image_path = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = () => {
                        if (typeof reader.result === 'string') {
                            resolve(reader.result)
                        } else {
                            reject(new Error('Ошибка чтения файла'))
                        }
                    }
                    reader.onerror = () => reject(reader.error)
                    reader.readAsDataURL(selectedFile)
                })
            }

            const payload = {
                username: name.trim(),
                ...(image_path ? { image_path } : {}),
            }

            const updatedUser = await updateMe(payload)
            const newUser = updatedUser || {
                ...authUser,
                username: name.trim(),
                ...(image_path ? { image_path } : {}),
            }

            if (!newUser || typeof newUser !== 'object') {
                throw new Error('Некорректный ответ сервера')
            }

            setSession(token, newUser as typeof authUser)
            setStatus('Данные успешно сохранены')
            setSelectedFile(null)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Не удалось сохранить изменения')
        } finally {
            setLoading(false)
        }
    }

    if (profileLoading) {
        return (
            <div className="settings-page">
                <div className="settings-page__content">
                    <p className="settings-page__status">Загрузка профиля...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="settings-page">
            <div className="settings-page__content">
                <div className="settings-page__avatar">
                    <img src={avatarSrc} alt="user avatar" />
                </div>
                <h1 className="settings-page__name">{authUser?.username || 'Логин пользователя'}</h1>

                <div className="settings-page__divider" aria-hidden="true" />

                <h2 className="settings-page__section-title">Изменение данных пользователя</h2>

                <form className="settings-page__form" onSubmit={handleSave}>
                    <div className="settings-page__field">
                        <label htmlFor="userName">Изменить логин пользователя</label>
                        <input
                            id="userName"
                            type="text"
                            className="settings-page__input"
                            placeholder="Введите логин"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>
                    <div className="settings-page__field">
                        <label htmlFor="userAvatar">Изменить изображение пользователя</label>
                        <div className="settings-page__file">
                            <input
                                id="userAvatar"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                className="settings-page__input--hidden"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="userAvatar" className="settings-page__file-label">
                                <span className="settings-page__file-text">
                                    {selectedFile ? selectedFile.name : 'Файл не выбран'}
                                </span>
                                <TbPaperclip className="settings-page__file-icon" aria-hidden="true" />
                            </label>
                        </div>
                    </div>

                    {error && <div className="settings-page__status settings-page__status--error">{error}</div>}
                    {status && <div className="settings-page__status settings-page__status--success">{status}</div>}

                    <div className="settings-page__actions">
                        <button
                            type="button"
                            className="settings-page__button settings-page__button--cancel"
                            onClick={handleResetAvatar}
                            disabled={loading}
                        >
                            Отменить
                        </button>
                        <button className="settings-page__button" type="submit" disabled={loading}>
                            {loading ? 'Сохранение...' : 'Принять'}
                        </button>
                    </div>
                </form>

                <div className="settings-page__divider" aria-hidden="true" />
            </div>
        </div>
    )
}

export default SettingsPage;