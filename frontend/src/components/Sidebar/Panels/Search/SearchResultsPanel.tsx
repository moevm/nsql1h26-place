import { useEffect, useMemo, useState } from 'react';
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

    const normalizedNameQuery = criteria.nameQuery.trim().toLowerCase();
    const normalizedTagsQuery = criteria.tagsQuery.trim().toLowerCase();
    const normalizedDescriptionQuery = criteria.descriptionQuery.trim().toLowerCase();

    const hasSearchQuery = useMemo(
        () => Boolean(normalizedNameQuery || normalizedTagsQuery || normalizedDescriptionQuery),
        [normalizedDescriptionQuery, normalizedNameQuery, normalizedTagsQuery],
    );

    useEffect(() => {
        if (!hasSearchQuery) {
            setResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        const backendQuery = normalizedNameQuery || normalizedTagsQuery || normalizedDescriptionQuery;

        const matchesFrontendFilters = (result: SearchResult) => {
            const title = result.title.toLowerCase();
            const description = (result.description || '').toLowerCase();
            const searchableText = `${title} ${description}`;

            const matchesName = !normalizedNameQuery || title.includes(normalizedNameQuery);
            const matchesTags = !normalizedTagsQuery || searchableText.includes(normalizedTagsQuery);
            const matchesDescription = !normalizedDescriptionQuery || description.includes(normalizedDescriptionQuery);

            return matchesName && matchesTags && matchesDescription;
        };

        let cancelled = false;

        const timer = window.setTimeout(async () => {
            setLoading(true);
            setError(null);

            try {
                const searchResults = await searchEntities({
                    query: backendQuery,
                    categories: criteria.activeFilters.length ? criteria.activeFilters : undefined,
                });

                if (!cancelled) {
                    setResults(searchResults.filter(matchesFrontendFilters));
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
    }, [
        criteria.activeFilters,
        hasSearchQuery,
        normalizedDescriptionQuery,
        normalizedNameQuery,
        normalizedTagsQuery,
    ]);

    const handleClose = () => {
        setOpen(false);
        setAdditionalOpen(false);
    };

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Результаты</h3>
                <LuX className='panel__close' onClick={handleClose} />
            </div>
            <div className="list">
                {!hasSearchQuery && <div className="list__empty">Введите параметры слева</div>}
                {loading && <div className="list__empty">Ищу совпадения...</div>}
                {error && <div className="list__empty">{error}</div>}
                {!loading && hasSearchQuery && !error && results.length === 0 && (
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
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    );
};

export default SearchResultsPanel;
