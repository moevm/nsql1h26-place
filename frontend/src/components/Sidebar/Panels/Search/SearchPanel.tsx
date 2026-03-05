import { LuSearch, LuX } from 'react-icons/lu'
import '../Panels.css'
import type { SearchResult } from '../../../../models/SearchResult';

type SearchPanelProps = {
    setOpen: (val: boolean) => void,
}

const SearchPanel = ({setOpen} : SearchPanelProps) => {
    const results: SearchResult[] = [];

    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Поиск</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <button className="card card--add">
                    <div className="card__avatar"><LuSearch /></div>
                    <div className="card__content">
                        строка поиска
                    </div>
                </button>
                <hr className="divider" />
                {results.map((result) => (
                    <article key={result.id} className="card">
                        <div className="card__avatar">image</div>
                        <div className="card__content">
                            <div className="card__title">{result.title}</div>
                            <div className="card__desc">{result.description}</div>
                        </div>
                    </article>
                ))}
            </div>
        </aside>
    )
}

export default SearchPanel