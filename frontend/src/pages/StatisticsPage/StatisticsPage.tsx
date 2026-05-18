import './StatisticsPage.css'

const StatisticsPage = () => {
    return (
        <div className="statistics-page">
            <h1 style={{padding: "10px"}}>Статистика</h1>
            <div className="statistics-page__layout">
                <section className="statistics-page__chart"></section>

                <section className="statistics-page__controls" aria-label="Панель настроек">
                    <div className="statistics-page__panel">
                        <h2>Фильтры</h2>
                        <div className="statistics-page__field">
                            <label htmlFor="dataType">Тип данных</label>
                            <select id="dataType" className="statistics-page__select">
                                <option value="mine">Мои данные</option>
                                <option value="others">Другие пользователи</option>
                            </select>
                        </div>
                        <div className="statistics-page__field">
                            <label htmlFor="visibility">Видимость</label>
                            <select id="visibility" className="statistics-page__select">
                                <option value="public">Публичная</option>
                                <option value="private">Приватная</option>
                            </select>
                        </div>
                    </div>

                    <div className="statistics-page__panel statistics-page__panel--axis">
                        <h2>Значения осей</h2>
                        <div className="statistics-page__axis-container">
                            <div className="statistics-page__axis">
                                <h3>Ось X</h3>
                                <div className="statistics-page__field">
                                    <label htmlFor="axisX">Показатель</label>
                                    <select id="axisX" className="statistics-page__select">
                                        <option value="labels">Количество меток</option>
                                        <option value="views">Количество просмотров</option>
                                    </select>
                                </div>
                            </div>
                            <div className="statistics-page__axis">
                                <h3>Ось Y</h3>
                                <div className="statistics-page__field">
                                    <label htmlFor="axisY">Тип данных</label>
                                    <select id="axisY" className="statistics-page__select">
                                        <option value="markType">Тип отметки</option>
                                        <option value="routeType">Тип маршрута</option>
                                        <option value="areaType">Тип области</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default StatisticsPage;