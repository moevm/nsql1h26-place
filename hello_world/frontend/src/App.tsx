import { useState, useCallback } from "react";
import { useListMaps } from "./api/maps";
import { getApiUri } from "./api/hooks";

function App() {
    const [maps, , mapsLoading, refreshMaps] = useListMaps();

    const [createUserId, setCreateUserId] = useState("");
    const [createStatus, setCreateStatus] = useState<{ ok: boolean; text: string } | null>(null);
    const [createLoading, setCreateLoading] = useState(false);

    const [getByIdValue, setGetByIdValue] = useState("");
    const [getByIdResult, setGetByIdResult] = useState<string | null>(null);
    const [getByIdLoading, setGetByIdLoading] = useState(false);

    const [updateId, setUpdateId] = useState("");
    const [updateUserId, setUpdateUserId] = useState("");
    const [updateStatus, setUpdateStatus] = useState<{ ok: boolean; text: string } | null>(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    const [deleteId, setDeleteId] = useState("");
    const [deleteStatus, setDeleteStatus] = useState<{ ok: boolean; text: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const apiUri = getApiUri();

    const safeJson = async (res: Response) => {
        const text = await res.text();
        if (!text) return null;
        try { return JSON.parse(text); } catch { return text; }
    };

    const handleCreate = useCallback(async () => {
        setCreateLoading(true);
        setCreateStatus(null);
        try {
            const res = await fetch(`${apiUri}/maps`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: createUserId }),
            });
            const data = await safeJson(res);
            setCreateStatus({ ok: res.ok, text: data ? JSON.stringify(data, null, 2) : `Status: ${res.status}` });
            if (res.ok) refreshMaps();
        } catch (err: unknown) {
            setCreateStatus({ ok: false, text: String(err) });
        } finally {
            setCreateLoading(false);
        }
    }, [apiUri, createUserId, refreshMaps]);

    const handleGetById = useCallback(async () => {
        setGetByIdLoading(true);
        setGetByIdResult(null);
        try {
            const res = await fetch(`${apiUri}/maps/${getByIdValue}`);
            const data = await safeJson(res);
            setGetByIdResult(data ? JSON.stringify(data, null, 2) : `Пусто (Status: ${res.status})`);
        } catch (err: unknown) {
            setGetByIdResult(String(err));
        } finally {
            setGetByIdLoading(false);
        }
    }, [apiUri, getByIdValue]);

    const handleUpdate = useCallback(async () => {
        setUpdateLoading(true);
        setUpdateStatus(null);
        try {
            const res = await fetch(`${apiUri}/maps/${updateId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: updateUserId }),
            });
            const data = await safeJson(res);
            setUpdateStatus({ ok: res.ok, text: data ? JSON.stringify(data, null, 2) : `Status: ${res.status}` });
            if (res.ok) refreshMaps();
        } catch (err: unknown) {
            setUpdateStatus({ ok: false, text: String(err) });
        } finally {
            setUpdateLoading(false);
        }
    }, [apiUri, updateId, updateUserId, refreshMaps]);

    const handleDelete = useCallback(async () => {
        setDeleteLoading(true);
        setDeleteStatus(null);
        try {
            const res = await fetch(`${apiUri}/maps/${deleteId}`, { method: "DELETE" });
            const data = await safeJson(res);
            setDeleteStatus({ ok: res.ok, text: data ? JSON.stringify(data, null, 2) : `Status: ${res.status}` });
            if (res.ok) refreshMaps();
        } catch (err: unknown) {
            setDeleteStatus({ ok: false, text: String(err) });
        } finally {
            setDeleteLoading(false);
        }
    }, [apiUri, deleteId, refreshMaps]);

    return (
        <div className="app-container">
            <h1 className="app-title">🗺️ Maps API Tester</h1>
            <p className="app-subtitle">Тестирование бэкенда — GET & POST запросы</p>

            <div className="cards-grid">
                <div className="card">
                    <div className="card-header get">
                        <span className="method-badge">GET</span>
                        <span className="endpoint">/api/maps</span>
                    </div>
                    <div className="card-body">
                        <p className="card-description">Получить все карты</p>
                        <button onClick={refreshMaps} disabled={mapsLoading}>
                            {mapsLoading ? "Загрузка..." : "Отправить GET"}
                        </button>
                        {maps && maps.length > 0 ? (
                            <pre className="response success">{JSON.stringify(maps, null, 2)}</pre>
                        ) : maps && maps.length === 0 ? (
                            <pre className="response info">Пусто — нет записей</pre>
                        ) : null}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header post">
                        <span className="method-badge">POST</span>
                        <span className="endpoint">/api/maps</span>
                    </div>
                    <div className="card-body">
                        <p className="card-description">Создать новую карту</p>
                        <div className="input-group">
                            <label>userid</label>
                            <input
                                type="text"
                                value={createUserId}
                                onChange={(e) => setCreateUserId(e.target.value)}
                                placeholder="Введите userid"
                            />
                        </div>
                        <button onClick={handleCreate} disabled={createLoading || !createUserId}>
                            {createLoading ? "Отправка..." : "Отправить POST"}
                        </button>
                        {createStatus && (
                            <pre className={`response ${createStatus.ok ? "success" : "error"}`}>
                                {createStatus.text}
                            </pre>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header get">
                        <span className="method-badge">GET</span>
                        <span className="endpoint">/api/maps/:id</span>
                    </div>
                    <div className="card-body">
                        <p className="card-description">Получить карту по ID</p>
                        <div className="input-group">
                            <label>id</label>
                            <input
                                type="text"
                                value={getByIdValue}
                                onChange={(e) => setGetByIdValue(e.target.value)}
                                placeholder="Введите ID карты"
                            />
                        </div>
                        <button onClick={handleGetById} disabled={getByIdLoading || !getByIdValue}>
                            {getByIdLoading ? "Загрузка..." : "Отправить GET"}
                        </button>
                        {getByIdResult && (
                            <pre className="response success">{getByIdResult}</pre>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header post">
                        <span className="method-badge">POST</span>
                        <span className="endpoint">/api/maps/:id</span>
                    </div>
                    <div className="card-body">
                        <p className="card-description">Обновить карту по ID</p>
                        <div className="input-group">
                            <label>id</label>
                            <input
                                type="text"
                                value={updateId}
                                onChange={(e) => setUpdateId(e.target.value)}
                                placeholder="Введите ID карты"
                            />
                        </div>
                        <div className="input-group">
                            <label>userid</label>
                            <input
                                type="text"
                                value={updateUserId}
                                onChange={(e) => setUpdateUserId(e.target.value)}
                                placeholder="Новый userid"
                            />
                        </div>
                        <button onClick={handleUpdate} disabled={updateLoading || !updateId}>
                            {updateLoading ? "Отправка..." : "Отправить POST"}
                        </button>
                        {updateStatus && (
                            <pre className={`response ${updateStatus.ok ? "success" : "error"}`}>
                                {updateStatus.text}
                            </pre>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header delete">
                        <span className="method-badge">DELETE</span>
                        <span className="endpoint">/api/maps/:id</span>
                    </div>
                    <div className="card-body">
                        <p className="card-description">Удалить карту по ID</p>
                        <div className="input-group">
                            <label>id</label>
                            <input
                                type="text"
                                value={deleteId}
                                onChange={(e) => setDeleteId(e.target.value)}
                                placeholder="Введите ID карты"
                            />
                        </div>
                        <button onClick={handleDelete} disabled={deleteLoading || !deleteId}>
                            {deleteLoading ? "Удаление..." : "Отправить DELETE"}
                        </button>
                        {deleteStatus && (
                            <pre className={`response ${deleteStatus.ok ? "success" : "error"}`}>
                                {deleteStatus.text}
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;