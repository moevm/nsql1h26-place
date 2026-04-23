import { useState } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';
import type { SearchCategory } from '../../../../models/SearchResult';
import '../Panels.css';

const formatDay = (day: number) => new Date(day * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU');

type SearchPanelProps = {
    setOpen: (val: boolean) => void;
    setAdditionalOpen: (val: boolean) => void;
    onCriteriaChange: (next: SearchCriteria) => void;
};

export type SearchCriteria = {
    nameQuery: string;
    dateFromDay: number;
    dateToDay: number;
    tagsQuery: string;
    descriptionQuery: string;
    activeFilters: SearchCategory[];
};

type FilterCategory = {
    id: SearchCategory;
    label: string;
};

const FILTERS: FilterCategory[] = [
    { id: 'points', label: 'Отметки' },
    { id: 'routes', label: 'Маршруты' },
    { id: 'areas', label: 'Области' },
    { id: 'maps', label: 'Карты' },
];

const SearchPanel = ({ setOpen, setAdditionalOpen, onCriteriaChange }: SearchPanelProps) => {
    const minDay = Math.floor(new Date('2000-01-01T00:00:00Z').getTime() / (24 * 60 * 60 * 1000));
    const maxDay = Math.floor(Date.now() / (24 * 60 * 60 * 1000));

    const [criteria, setCriteria] = useState<SearchCriteria>({
        nameQuery: '',
        dateFromDay: minDay,
        dateToDay: maxDay,
        tagsQuery: '',
        descriptionQuery: '',
        activeFilters: [],
    });

    const { nameQuery, dateFromDay, dateToDay, tagsQuery, descriptionQuery, activeFilters } = criteria;

    const updateCriteria = (next: SearchCriteria) => {
        setCriteria(next);
        onCriteriaChange(next);
    };

    const toggleFilter = (category: SearchCategory) => {
        const nextFilters = activeFilters.includes(category)
            ? activeFilters.filter((item) => item !== category)
            : [...activeFilters, category];

        updateCriteria({
            ...criteria,
            activeFilters: nextFilters,
        });
    };

    const handleClose = () => {
        setOpen(false);
        setAdditionalOpen(false);
    };

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Поиск</h3>
                <LuX className='panel__close' onClick={handleClose} />
            </div>
            <div className="list">
                <label>Поиск по названию</label>
                <div className="search-panel__input-wrapper">
                    <LuSearch className="search-panel__input-icon" />
                    <input
                        className="search-panel__input"
                        type="text"
                        value={nameQuery}
                        onChange={(event) =>
                            updateCriteria({ ...criteria, nameQuery: event.target.value })
                        }
                        placeholder="Введите название"
                    />
                </div>
                <label>Поиск по дате</label>
                <div className="search-panel__date-range">
                    <div className="search-panel__range-row">
                        <span>От: {formatDay(dateFromDay)}</span>
                        <input
                            className="search-panel__range-input"
                            type="range"
                            min={Math.floor(new Date('2000-01-01T00:00:00Z').getTime() / (24 * 60 * 60 * 1000))}
                            max={Math.floor(Date.now() / (24 * 60 * 60 * 1000))}
                            step={1}
                            value={dateFromDay}
                            onChange={(event) => {
                                const nextFrom = Number(event.target.value);

                                updateCriteria({
                                    ...criteria,
                                    dateFromDay: nextFrom,
                                    dateToDay: Math.max(nextFrom, dateToDay),
                                });
                            }}
                        />
                    </div>
                    <div className="search-panel__range-row">
                        <span>До: {formatDay(dateToDay)}</span>
                        <input
                            className="search-panel__range-input"
                            type="range"
                            min={Math.floor(new Date('2000-01-01T00:00:00Z').getTime() / (24 * 60 * 60 * 1000))}
                            max={Math.floor(Date.now() / (24 * 60 * 60 * 1000))}
                            step={1}
                            value={dateToDay}
                            onChange={(event) => {
                                const nextTo = Number(event.target.value);

                                updateCriteria({
                                    ...criteria,
                                    dateFromDay: Math.min(dateFromDay, nextTo),
                                    dateToDay: nextTo,
                                });
                            }}
                        />
                    </div>
                </div>
                <label>Поиск по тегам</label>
                <div className="search-panel__input-wrapper">
                    <LuSearch className="search-panel__input-icon" />
                    <input
                        className="search-panel__input"
                        type="text"
                        value={tagsQuery}
                        onChange={(event) =>
                            updateCriteria({ ...criteria, tagsQuery: event.target.value })
                        }
                        placeholder="Введите тег"
                    />
                </div>
                <label>Поиск по описанию</label>
                <div className="search-panel__input-wrapper">
                    <LuSearch className="search-panel__input-icon" />
                    <input
                        className="search-panel__input"
                        type="text"
                        value={descriptionQuery}
                        onChange={(event) =>
                            updateCriteria({ ...criteria, descriptionQuery: event.target.value })
                        }
                        placeholder="Введите часть описания"
                    />
                </div>

                <hr className="divider" />

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
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default SearchPanel