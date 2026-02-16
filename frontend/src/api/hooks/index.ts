import {useEffect, useState} from 'react';
import requester, {type Request} from '../requests/fetch';

export type ApiError = {
    message: string;
    status_code: number;
}

export type ApiRequest<T,> = {
    path?: string;
    method?: string;
    headers?: HeadersInit;
    params?: object;
    body?: T;
}

export const getApiUri = () => {
    return import.meta.env.VITE_API_URI || '/api';
}

export const useApi = <ResultType, RequestType = undefined>(
    request: ApiRequest<RequestType>
): [ResultType, ApiError | undefined, boolean, () => void] => {
    const [apiError, setApiError] = useState<ApiError | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [result, setResult] = useState<ResultType | undefined>(undefined);

    const refresh = () => {
        setRefreshCounter((prev) => prev + 1);
    }

    useEffect(() => {
        const method = request.method || 'GET';

        if ((['POST', 'PUT', 'PATCH', 'DELETE'].find((value) => value === method) && request.body) || method === 'GET') {
            setLoading(true);

            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(request.params || {})) {
                params.append(key, value);
            }

            const paramString = `${params}`;
            const path = request.path || '';
            const req: Request = {
                uri: `${getApiUri()}${path}${paramString.length > 0 ? '?' + paramString : ''}`,
                method: method,
                headers: {
                    ...request.headers,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify(request.body),
            };

            requester(req)
                .then(async (response) => {
                    if (response.ok) {
                        setResult(await response.json());
                        setApiError(undefined);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setApiError({message: err.message, status_code: err.status_code});
                    setLoading(false);
                });
        }
    }, [refreshCounter, request.body, request.headers, request.method, request.params, request.path]);

    return [result!, apiError, loading, refresh];
}