import { useState } from 'react'
import { getData, postData } from './api'

export default function App() {
  const [path, setPath] = useState<string>('/items')
  const [payloadText, setPayloadText] = useState<string>('{\n  "name": "test",\n  "value": 123\n}')
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<unknown>(null)
  const [error, setError] = useState<string>('')

  const runGet = async (): Promise<void> => {
    setLoading(true)
    setError('')
    try {
      const data = await getData(path)
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const runPost = async (): Promise<void> => {
    setLoading(true)
    setError('')
    try {
      const payload = JSON.parse(payloadText) as unknown
      const data = await postData(path, payload)
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Тестовый фронт для API</h1>
      <p>
        Базовый URL API: <strong>{import.meta.env.VITE_API_BASE_URL || '/api'}</strong>
      </p>

      <label>Ручка (path):</label>
      <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/items" />

      <label>JSON для POST:</label>
      <textarea value={payloadText} onChange={(e) => setPayloadText(e.target.value)} rows={8} />

      <div className="buttons">
        <button onClick={runGet} disabled={loading}>
          GET
        </button>
        <button onClick={runPost} disabled={loading}>
          POST
        </button>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="error">Ошибка: {error}</p>}

      <h2>Ответ:</h2>
      <pre>{result === null ? 'Нет данных' : JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
