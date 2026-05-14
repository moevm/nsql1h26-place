import { useEffect, useRef, useState } from 'react';
import { fetchTags } from '../../api/tags';
import type { Tag } from '../../models/Tag';
import './TagSelector.css';

type TagSelectorProps = {
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
};

const TagSelector = ({ value, onChange, placeholder = 'Введите тег...', disabled = false }: TagSelectorProps) => {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<Tag[]>([]);
    const [open, setOpen] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            fetchTags(query || undefined)
                .then((tags) => {
                    setOptions(tags.filter((t) => !value.includes(t.name)));
                })
                .catch(() => setOptions([]));
        }, 250);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [query, value]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (tag: Tag) => {
        onChange([...value, tag.name]);
        setQuery('');
        setOpen(false);
    };

    const handleRemove = (name: string) => {
        onChange(value.filter((t) => t !== name));
    };

    return (
        <div className="tag-selector" ref={containerRef}>
            {value.length > 0 && (
                <div className="tag-selector__chips">
                    {value.map((name) => (
                        <span key={name} className="tag-chip tag-chip--removable">
                            {name}
                            <button
                                type="button"
                                className="tag-chip__remove"
                                onClick={() => handleRemove(name)}
                                disabled={disabled}
                                aria-label={`Удалить тег ${name}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div style={{ position: 'relative' }}>
                <input
                    className="tag-selector__input"
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                {open && (
                    <div className="tag-selector__dropdown">
                        {options.length === 0 ? (
                            <div className="tag-selector__empty">Совпадений не найдено</div>
                        ) : (
                            options.map((tag) => (
                                <div
                                    key={tag._id}
                                    className="tag-selector__option"
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(tag); }}
                                >
                                    {tag.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagSelector;
