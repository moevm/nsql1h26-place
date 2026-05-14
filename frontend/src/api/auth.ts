import { runApi } from './hooks';

type Credentials = {
    username: string;
    password: string;
};

type AuthUser = {
    _id: string;
    username: string;
    image_path?: string;
};

type LoginResponse = {
    token: string;
    user: AuthUser;
};

type RegisterResponse = {
    user: AuthUser;
};

type MeResponse = AuthUser;

export const login = (payload: Credentials) => {
    return runApi<LoginResponse, Credentials>('POST', '/auth/login', payload);
};

export const register = (payload: Credentials) => {
    return runApi<RegisterResponse, Credentials>('POST', '/auth/register', payload);
};

export const getMe = () => {
    return runApi<MeResponse>('GET', '/auth/me');
};
