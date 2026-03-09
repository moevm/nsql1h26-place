type AuthUser = {
    _id: string;
    username: string;
    image_path?: string;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const saveAuthSession = (token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return Boolean(getAuthToken());
};
