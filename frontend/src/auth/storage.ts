import { type AuthUser, useAuthStore } from '../stores/authStore'

export const saveAuthSession = (token: string, user: AuthUser) => {
    useAuthStore.getState().setSession(token, user)
};

export const clearAuthSession = () => {
    useAuthStore.getState().clearSession()
};

export const getAuthToken = () => {
    return useAuthStore.getState().token
};

export const isAuthenticated = () => {
    return useAuthStore.getState().isAuthenticated
};
