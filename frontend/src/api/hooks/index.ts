import { useCallback, useEffect, useState } from 'react';
import { TOKEN_KEY, useAuthStore } from '../../stores/authStore';

export type ApiError = {
    message: string;
    status_code: number;
};

export const getApiUri = () => {
    return import.meta.env.VITE_API_URI || '/api';
};

export const runApi = async <ResultType, BodyType = undefined>(
    method: string,
    path: string,
    body?: BodyType,
): Promise<ResultType> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json;charset=UTF-8',
    };

    const store = useAuthStore.getState();
    let token = store.token;

    try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken !== token) {
            token = storedToken;
        }
    } catch {
        token = store.token;
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiUri()}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
        store.clearSession();
    }

    if (!response.ok) {
        let message = 'Request failed';
        try {
            const payload = await response.json();
            message = payload?.message || message;
        } catch {
            message = response.statusText || message;
        }
        throw { message, status_code: response.status } as ApiError;
    }

    if (response.status === 204) {
        return undefined as ResultType;
    }

    return response.json() as Promise<ResultType>;
};

export const useQuery = <T,>(
    path: string,
): [T | undefined, ApiError | undefined, boolean, () => void] => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [error, setError] = useState<ApiError | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [tick, setTick] = useState(0);

    const refresh = useCallback(() => setTick((t) => t + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        runApi<T>('GET', path)
            .then((result) => {
                if (!cancelled) {
                    setData(result);
                    setError(undefined);
                }
            })
            .catch((err: ApiError) => {
                if (!cancelled) {
                    setError(err);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [path, tick]);

    return [data, error, loading, refresh];
};