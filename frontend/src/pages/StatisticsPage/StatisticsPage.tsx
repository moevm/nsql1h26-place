import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useQuery } from '../../api/hooks';
import { buildStatisticsSummaryPath } from '../../api/statistics';
import type {
    StatisticsCategory,
    StatisticsPeriod,
    StatisticsSummaryItem,
} from '../../models/Statistics';
import type { Tag } from '../../models/Tag';
import './StatisticsPage.css';

type AxisYMode = 'total' | 'categories' | 'maps' | 'points' | 'routes' | 'areas';

const CATEGORY_ORDER: StatisticsCategory[] = ['maps', 'points', 'routes', 'areas'];
const CATEGORY_LABELS: Record<StatisticsCategory, string> = {
    maps: 'Карты',
    points: 'Точки',
    routes: 'Маршруты',
    areas: 'Области',
};

const PERIOD_OPTIONS: StatisticsPeriod[] = ['day', 'week', 'month', 'year'];
const PERIOD_LABELS: Record<StatisticsPeriod, string> = {
    day: 'День',
    week: 'Неделя',
    month: 'Месяц',
    year: 'Год',
};

const isCategoryMode = (value: AxisYMode): value is StatisticsCategory =>
    CATEGORY_ORDER.includes(value as StatisticsCategory);

const StatisticsPage = () => {
    const [dataType, setDataType] = useState<'mine' | 'others'>('mine');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [period, setPeriod] = useState<StatisticsPeriod>('week');
    const [axisY, setAxisY] = useState<AxisYMode>('categories');
    const [selectedCategories, setSelectedCategories] = useState<StatisticsCategory[]>(
        CATEGORY_ORDER,
    );
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [tagsData, tagsError, tagsLoading] = useQuery<Tag[]>('/tags');

    const resolvedCategories = useMemo(() => {
        if (isCategoryMode(axisY)) {
            return [axisY];
        }

        return selectedCategories;
    }, [axisY, selectedCategories]);

    const queryPath = useMemo(
        () =>
            buildStatisticsSummaryPath({
                dataType,
                visibility,
                period,
                categories: resolvedCategories,
                tags: selectedTags,
            }),
        [dataType, visibility, period, resolvedCategories, selectedTags],
    );

    const [data, error, loading] = useQuery<StatisticsSummaryItem[]>(queryPath);

    const counts = useMemo(() => {
        const base: Record<StatisticsCategory, number> = {
            maps: 0,
            points: 0,
            routes: 0,
            areas: 0,
        };

        data?.forEach((item) => {
            base[item.category] = item.count;
        });

        return base;
    }, [data]);

    const chartData = useMemo(() => {
        if (axisY === 'total') {
            const total = resolvedCategories.reduce((sum, category) => sum + counts[category], 0);
            return [{ label: 'Итого', value: total }];
        }

        return resolvedCategories.map((category) => ({
            label: CATEGORY_LABELS[category],
            value: counts[category],
        }));
    }, [axisY, resolvedCategories, counts]);

    const hasSelection = resolvedCategories.length > 0;
    const hasData = chartData.some((item) => item.value > 0);
    const categoriesLocked = isCategoryMode(axisY);

    const handleAxisYChange = (value: AxisYMode) => {
        setAxisY(value);

        if (value === 'categories') {
            setSelectedCategories(CATEGORY_ORDER);
            return;
        }

        if (isCategoryMode(value)) {
            setSelectedCategories([value]);
            return;
        }

        if (!selectedCategories.length) {
            setSelectedCategories(CATEGORY_ORDER);
        }
    };

    const toggleCategory = (category: StatisticsCategory) => {
        if (categoriesLocked) {
            return;
        }

        setSelectedCategories((prev) => {
            const exists = prev.includes(category);
            if (exists) {
                if (prev.length === 1) {
                    return prev;
                }
                return prev.filter((item) => item !== category);
            }

            return [...prev, category];
        });
    };

    const toggleTag = (name: string) => {
        setSelectedTags((prev) =>
            prev.includes(name) ? prev.filter((tag) => tag !== name) : [...prev, name],
        );
    };

    return (
        <div className="statistics-page">
            <h1 style={{ padding: '10px' }}>Статистика</h1>
            <div className="statistics-page__layout">
                <section className="statistics-page__chart">
                    <div className="statistics-page__chart-content">
                        {loading ? (
                            <p className="statistics-page__status">Загрузка статистики...</p>
                        ) : error ? (
                            <p className="statistics-page__status statistics-page__status--error">
                                {error.message || 'Не удалось загрузить статистику'}
                            </p>
                        ) : !hasSelection ? (
                            <p className="statistics-page__status">Выберите хотя бы одну категорию.</p>
                        ) : !hasData ? (
                            <p className="statistics-page__status">Нет данных для выбранных фильтров.</p>
                        ) : (
                            <div className="statistics-page__chart-inner">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        layout="vertical"
                                        margin={{ top: 10, right: 24, bottom: 10, left: 32 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis type="category" dataKey="label" width={120} />
                                        <Tooltip formatter={(value) => [value, 'Количество']} />
                                        <Bar dataKey="value" fill="#948C0F" radius={[6, 6, 6, 6]}>
                                            <LabelList dataKey="value" position="right" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </section>

                <section className="statistics-page__controls" aria-label="Панель настроек">
                    <div className="statistics-page__panel">
                        <h2>Фильтры</h2>
                        <div className="statistics-page__field">
                            <label htmlFor="dataType">Тип данных</label>
                            <select
                                id="dataType"
                                className="statistics-page__select"
                                value={dataType}
                                onChange={(event) => setDataType(event.target.value as 'mine' | 'others')}
                            >
                                <option value="mine">Мои данные</option>
                                <option value="others">Другие пользователи</option>
                            </select>
                        </div>
                        <div className="statistics-page__field">
                            <label htmlFor="visibility">Видимость</label>
                            <select
                                id="visibility"
                                className="statistics-page__select"
                                value={visibility}
                                onChange={(event) => setVisibility(event.target.value as 'public' | 'private')}
                            >
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
                                    <label htmlFor="axisX">Период</label>
                                    <select
                                        id="axisX"
                                        className="statistics-page__select"
                                        value={period}
                                        onChange={(event) => setPeriod(event.target.value as StatisticsPeriod)}
                                    >
                                        {PERIOD_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {PERIOD_LABELS[option]}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="statistics-page__axis">
                                <h3>Ось Y</h3>
                                <div className="statistics-page__field">
                                    <label htmlFor="axisY">Показатель</label>
                                    <select
                                        id="axisY"
                                        className="statistics-page__select"
                                        value={axisY}
                                        onChange={(event) => handleAxisYChange(event.target.value as AxisYMode)}
                                    >
                                        <option value="total">Итого</option>
                                        <option value="categories">Все категории</option>
                                        <option value="maps">Только карты</option>
                                        <option value="points">Только отметки</option>
                                        <option value="routes">Только маршруты</option>
                                        <option value="areas">Только области</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="statistics-page__categories">
                            <h3>Категории</h3>
                            <div className="statistics-page__category-list">
                                {CATEGORY_ORDER.map((category) => (
                                    <label key={category} className="statistics-page__category-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                            disabled={categoriesLocked}
                                        />
                                        {CATEGORY_LABELS[category]}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="statistics-page__tags">
                            <h3>Теги</h3>
                            {tagsLoading ? (
                                <p className="statistics-page__tag-status">Загрузка тегов...</p>
                            ) : tagsError ? (
                                <p className="statistics-page__tag-status statistics-page__tag-status--error">
                                    Не удалось загрузить теги
                                </p>
                            ) : !tagsData || tagsData.length === 0 ? (
                                <p className="statistics-page__tag-status">Теги не найдены</p>
                            ) : (
                                <div className="statistics-page__tag-list">
                                    {tagsData.map((tag) => (
                                        <label key={tag._id} className="statistics-page__tag-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedTags.includes(tag.name)}
                                                onChange={() => toggleTag(tag.name)}
                                            />
                                            {tag.name}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StatisticsPage;