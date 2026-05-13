import { useState } from 'react'
import { LuX } from 'react-icons/lu'
import '../Panels.css'
import { BiExport, BiImport } from 'react-icons/bi'
import { downloadExportFile, importData, readFileContent } from '../../../../api/exportImport'

type DataPanelProps = {
    setOpen: (val: boolean) => void,
}

const DataPanel = ({ setOpen }: DataPanelProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleExport = async () => {
        try {
            setIsLoading(true)
            setErrorMessage(null)
            await downloadExportFile()
        } catch (error) {
            console.error('Export failed:', error)
            setErrorMessage('Ошибка при экспорте данных')
            setTimeout(() => setErrorMessage(null), 5000)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImportClick = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return

            // Проверка расширения файла
            if (!file.name.toLowerCase().endsWith('.json')) {
                setErrorMessage('Выберите файл с расширением .json')
                setTimeout(() => setErrorMessage(null), 5000)
                return
            }

            try {
                setIsLoading(true)
                setErrorMessage(null)
                const content = await readFileContent(file)
                await importData(content)
                // После успешного импорта перезагружаем страницу, чтобы отобразить новые данные
                window.location.reload()
            } catch (error) {
                console.error('Import failed:', error)
                setErrorMessage(
                    error instanceof Error ? error.message : 'Ошибка при импорте данных',
                )
                setTimeout(() => setErrorMessage(null), 5000)
            } finally {
                setIsLoading(false)
            }
        }
        input.click()
    }



    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Данные</h3>
                <LuX className='panel__close' onClick={() => {
                    setOpen(false)
                    setErrorMessage(null)
                }} />
            </div>
            <div className="list">
                <button
                    className="card card--add"
                    onClick={handleImportClick}
                    disabled={isLoading}
                >
                    <div className="card__avatar"><BiImport /></div>
                    <div className="card__title">Импорт данных</div>
                </button>
                <hr className="divider" />
                <button
                    className="card card--add"
                    onClick={handleExport}
                    disabled={isLoading}
                >
                    <div className="card__avatar"><BiExport /></div>
                    <div className="card__title">Экспорт данных</div>
                </button>
                {errorMessage && (
                    <div style={{
                        marginTop: '12px',
                        padding: '8px',
                        backgroundColor: '#ffdddd',
                        border: '1px solid #ffaaaa',
                        borderRadius: '4px',
                        color: '#aa0000'
                    }}>
                        {errorMessage}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default DataPanel