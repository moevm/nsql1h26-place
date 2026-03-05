import { LuX } from 'react-icons/lu'
import '../Panels.css'
import { BiExport, BiImport } from 'react-icons/bi'

type DataPanelProps = {
    setOpen: (val: boolean) => void,
}

const DataPanel = ({setOpen} : DataPanelProps) => {
    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Данные</h3>
                <LuX className='panel__close' onClick={() => setOpen(false)} />
            </div>
            <div className="list">
                <button className="card card--add">
                    <div className="card__avatar"><BiImport /></div>
                    <div className="card__content">Импорт данных</div>
                </button>
                <hr className="divider" />
                <button className="card card--add">
                    <div className="card__avatar"><BiExport /></div>
                    <div className="card__content">Экспорт данных</div>
                </button>
            </div>
        </aside>
    )
}

export default DataPanel