import { LuX } from 'react-icons/lu'
import '../Panels.css'
import { BiExport, BiImport, BiPaperclip } from 'react-icons/bi'

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
                    <div className="card__content data-panel__content">
                        <div className="data-panel__row">
                            <div className="card__avatar"><BiImport /></div>
                            <div className="data-panel__section-title">Импорт данных</div>
                        </div>
                        <label htmlFor="file-upload" className="file_upload">
                            Прикрепите файл формата .csv ... <BiPaperclip />
                        </label>
                        <input id="file-upload" className="file_upload__input" type="file" accept=".xlsx,.csv" />
                    </div>
                </button>
                <hr className="divider" />
                <button className="card card--add">
                    <div className="card__content data-panel__content">
                        <div className="data-panel__row">
                            <div className="card__avatar"><BiExport /></div>
                            <div className="data-panel__section-title">Экспорт данных</div>
                        </div>
                        <div className="file_upload file_upload--stub">
                            Файл для скачивания появится здесь ... <BiExport />
                        </div>
                    </div>
                </button>
            </div>
        </aside>
    )
}

export default DataPanel