import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';

// ── Типы ────────────────────────────────────────────────

export type ApiError = {
    message: string;
    status_code: number;
};

// ── Базовый URI ─────────────────────────────────────────

export const getApiUri = () => {
    return import.meta.env.VITE_API_URI || '/api';
};

// ── runApi — единая точка входа для любого запроса к бэку ──
//
// Использование:
//   await runApi<Map[]>('GET', '/maps')
//   await runApi<Map, CreateMapPayload>('POST', '/maps', body)
//   await runApi<Map, UpdateMapPayload>('PATCH', `/maps/${id}`, body)
//   await runApi<Map>('DELETE', `/maps/${id}`)

export const runApi = async <ResultType, BodyType = undefined>(
    method: string,
    path: string,
    body?: BodyType,
): Promise<ResultType> => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json;charset=UTF-8',
    };

    const token = useAuthStore.getState().token;
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiUri()}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

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

// ── useQuery — React-хук для GET-запросов ───────────────
//
// Автоматически делает GET при монтировании и при вызове refresh().
// Возвращает [data, error, loading, refresh].

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