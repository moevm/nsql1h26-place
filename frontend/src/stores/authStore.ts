import { create } from 'zustand'

export type AuthUser = {
    _id: string;
    username: string;
    image_path?: string;
}

type AuthStore = {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    setSession: (token: string, user: AuthUser) => void;
    clearSession: () => void;
}

export const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

const getInitialSession = () => {
    const token = localStorage.getItem(TOKEN_KEY)
    const userRaw = localStorage.getItem(USER_KEY)

    let user: AuthUser | null = null
    if (userRaw) {
        try {
            user = JSON.parse(userRaw) as AuthUser
        } catch {
            user = null
        }
    }

    return {
        token,
        user,
        isAuthenticated: Boolean(token),
    }
}

const initialSession = getInitialSession()

export const useAuthStore = create<AuthStore>((set) => ({
    token: initialSession.token,
    user: initialSession.user,
    isAuthenticated: initialSession.isAuthenticated,

    setSession: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
        set({ token, user, isAuthenticated: true })
    },

    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        set({ token: null, user: null, isAuthenticated: false })
    },
}))