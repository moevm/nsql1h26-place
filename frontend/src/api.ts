const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function normalizePath(path = '/items'): string {
  return path.startsWith('/') ? path : `/${path}`
}

export async function request<T = unknown>(method: RequestMethod, path: string, data?: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${normalizePath(path)}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: data === undefined ? undefined : JSON.stringify(data)
  })

  const text = await response.text()
  let parsed: unknown

  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`
    )
  }

  return parsed as T
}

export function getData<T = unknown>(path: string): Promise<T> {
  return request<T>('GET', path)
}

export function postData<T = unknown>(path: string, payload: unknown): Promise<T> {
  return request<T>('POST', path, payload)
}
