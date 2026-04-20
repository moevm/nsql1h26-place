import { useEffect, useState, type ReactNode } from 'react';
import { LuGrid2X2, LuMap, LuMapPinned, LuRoute, LuSearch, LuX } from 'react-icons/lu';
import { searchEntities } from '../../../../api/search';
import type { SearchCategory, SearchResult } from '../../../../models/SearchResult';
import '../Panels.css';
import './SearchPanel.css';

type SearchPanelProps = {
    setOpen: (val: boolean) => void;
};

type CategoryMeta = {
    label: string;
    icon: ReactNode;
};

const FILTERS: Array<{ id: SearchCategory } & CategoryMeta> = [
    { id: 'points', label: 'Отметки', icon: <LuMapPinned /> },
    { id: 'routes', label: 'Маршруты', icon: <LuRoute /> },
    { id: 'areas', label: 'Области', icon: <LuGrid2X2 /> },
    { id: 'maps', label: 'Карты', icon: <LuMap /> },
];

const CATEGORY_META: Record<SearchCategory, CategoryMeta> = FILTERS.reduce(
    (acc, { id, label, icon }) => {
        acc[id] = { label, icon };
        return acc;
    },
    {} as Record<SearchCategory, CategoryMeta>,
);

const SearchPanel = ({ setOpen }: SearchPanelProps) => {
    const [query, setQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<SearchCategory[]>([]);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleFilter = (category: SearchCategory) => {
        setActiveFilters((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category],
        );
    };

    useEffect(() => {
        const normalizedQuery = query.trim();

        if (!normalizedQuery) {
            setResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const timer = window.setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const searchResults = await searchEntities({
                    query: normalizedQuery,
                    categories: activeFilters.length ? activeFilters : undefined,
                });

                if (!cancelled) {
                    setResults(searchResults);
                }
            } catch {
                if (!cancelled) {
                    setResults([]);
                    setError('Не удалось выполнить поиск');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [query, activeFilters]);

    const normalizedQuery = query.trim();

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Поиск</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <div className="search-panel__input-wrapper">
                    <LuSearch className="search-panel__input-icon" />
                    <input
                        className="search-panel__input"
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Введите слово или часть слова"
                    />
                </div>

                <div className="search-panel__filters">
                    {FILTERS.map((filter) => {
                        const active = activeFilters.includes(filter.id);

                        return (
                            <button
                                key={filter.id}
                                type="button"
                                className={`search-panel__filter ${active ? 'search-panel__filter--active' : ''}`}
                                onClick={() => toggleFilter(filter.id)}
                            >
                                <span className="search-panel__filter-icon">{filter.icon}</span>
                                {filter.label}
                            </button>
                        );
                    })}
                </div>

                <hr className="divider" />

                {!normalizedQuery && <div className="list__empty">Введите запрос для поиска</div>}
                {loading && <div className="list__empty">Ищу совпадения...</div>}
                {error && <div className="list__empty">{error}</div>}
                {!loading && normalizedQuery && !error && results.length === 0 && (
                    <div className="list__empty">Ничего не найдено</div>
                )}

                {results.map((result) => (
                    <article key={`${result.category}-${result.id}`} className="card card--clickable">
                        <div className="card__avatar">{CATEGORY_META[result.category].icon}</div>
                        <div className="card__content">
                            <div className="search-panel__category">{CATEGORY_META[result.category].label}</div>
                            <div className="card__title">{result.title}</div>
                            <div className="card__desc">{result.description || 'Без описания'}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    );
};

export default SearchPanel