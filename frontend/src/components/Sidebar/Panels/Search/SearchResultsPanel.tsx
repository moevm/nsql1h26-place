import { useEffect, useMemo, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { searchEntities } from '../../../../api/search';
import type { SearchResult } from '../../../../models/SearchResult';
import type { SearchCriteria } from './SearchPanel';
import '../Panels.css';

type SearchResultsPanelProps = {
    setOpen: (val: boolean) => void;
    setAdditionalOpen: (val: boolean) => void;
    criteria: SearchCriteria | null;
};

const SearchResultsPanel = ({ setOpen, setAdditionalOpen, criteria }: SearchResultsPanelProps) => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const requestIdRef = useRef(0);

    const normalizedNameQuery = criteria?.nameQuery.trim().toLowerCase() ?? '';
    const normalizedTagsQuery = criteria?.tagsQuery.trim().toLowerCase() ?? '';
    const normalizedDescriptionQuery = criteria?.descriptionQuery.trim().toLowerCase() ?? '';
    const activeFilters = useMemo(() => criteria?.activeFilters ?? [], [criteria]);

    const hasSearchCriteria = useMemo(
        () => Boolean(
            normalizedNameQuery ||
            normalizedTagsQuery ||
            normalizedDescriptionQuery,
        ),
        [normalizedDescriptionQuery, normalizedNameQuery, normalizedTagsQuery],
    );

    useEffect(() => {
        const requestId = ++requestIdRef.current;

        if (!criteria || !hasSearchCriteria) {
            setResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        setResults([]);
        setError(null);

        const timer = window.setTimeout(async () => {
            setLoading(true);

            try {
                const searchResults = await searchEntities({
                    nameQuery: normalizedNameQuery || undefined,
                    tagsQuery: normalizedTagsQuery || undefined,
                    descriptionQuery: normalizedDescriptionQuery || undefined,
                    dateFromDay: criteria.dateRangeActive ? criteria.dateFromDay : undefined,
                    dateToDay: criteria.dateRangeActive ? criteria.dateToDay : undefined,
                    categories: activeFilters.length ? activeFilters : undefined,
                });

                if (requestId === requestIdRef.current) {
                    setResults(searchResults);
                }
            } catch {
                if (requestId === requestIdRef.current) {
                    setResults([]);
                    setError('Не удалось выполнить поиск');
                }
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        }, 250);

        return () => {
            window.clearTimeout(timer);
        };
    }, [
        criteria,
        hasSearchCriteria,
        normalizedDescriptionQuery,
        normalizedNameQuery,
        normalizedTagsQuery,
        activeFilters,
    ]);

    const handleClose = () => {
        setOpen(false);
        setAdditionalOpen(false);
    };

    if (!criteria) {
        return (
            <aside className="panel panel--secondary">
                <div className="panel__header">
                    <h3>Результаты</h3>
                    <LuX className='panel__close' onClick={() => setAdditionalOpen(false)} />
                </div>
                <div className="list">
                    <p style={{ textAlign: 'center', color: '#666' }}>Откройте поиск для выполнения запроса</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Результаты</h3>
                <LuX className='panel__close' onClick={handleClose} />
            </div>
            <div className="list">
                {!hasSearchCriteria && <div className="list__empty">Введите параметры слева</div>}
                {loading && <div className="list__empty">Ищу совпадения...</div>}
                {error && <div className="list__empty">{error}</div>}
                {!loading && hasSearchCriteria && !error && results.length === 0 && (
                    <div className="list__empty">Ничего не найдено</div>
                )}

                {results.map((result) => (
                    <article key={result.id} className="card">
                        <div className="card__content">
                            <div className='card__title_container'>
                                <img className='card__icon' src={`/src/assets/images/${result.image_path}`} alt="logo" />
                                <div className='card__right_container'>
                                    <div className='card__title'>{result.title}</div>
                                </div>
                            </div>
                            <div className='card__description'>{result.description || 'Без описания'}</div>
                            {result.tags.length > 0 && (
                                <div className="card__tags">
                                    {result.tags.map((tag) => (
                                        <span key={tag} className="tag-chip">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    );
};

export default SearchResultsPanel;
