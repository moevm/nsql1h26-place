import { ChangeEvent, useEffect, useState } from 'react'
import { LuX } from 'react-icons/lu'
import '../Panels.css'
import { BiExport, BiImport, BiPaperclip } from 'react-icons/bi'
import { exportData, importData, readFileContent } from '../../../../api/exportImport'

type DataPanelProps = {
    setOpen: (val: boolean) => void,
}

const DataPanel = ({ setOpen }: DataPanelProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [exportLink, setExportLink] = useState<string | null>(null)
    const [exportFileName, setExportFileName] = useState<string | null>(null)

    useEffect(() => {
        return () => {
            if (exportLink) {
                window.URL.revokeObjectURL(exportLink)
            }
        }
    }, [exportLink])

    const handleExport = async () => {
        try {
            setIsLoading(true)
            if (exportLink) {
                window.URL.revokeObjectURL(exportLink)
            }
            const blob = await exportData()
            const url = window.URL.createObjectURL(blob)
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const fileName = `mushroom-place-export-${timestamp}.json`

            setExportLink(url)
            setExportFileName(fileName)
        } catch (error) {
            console.error('Export failed:', error)
            alert('Ошибка при экспорте данных')
        } finally {
            setIsLoading(false)
        }
    }

    const handleImportClick = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const extension = file.name.toLowerCase().split('.').pop()
        if (extension !== 'json') {
            setSelectedFile(null)
            alert('Выберите файл с расширением .json')
            return
        }

        try {
            setIsLoading(true)
            setSelectedFile(file.name)

            const content = await readFileContent(file)
            await importData(content)
        } catch (error) {
            console.error('Import failed:', error)
            const message = error instanceof Error ? error.message : 'Ошибка при импорте данных'
            alert(message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <aside className="panel panel--primary">
            <div className="panel__header">
                <h3>Данные</h3>
                <LuX className='panel__close' onClick={() => {
                    setOpen(false)
                    setSelectedFile(null)
                }} />
            </div>
            <div className="list">
                <button className="card card--add" type="button" disabled={isLoading}>
                    <div className="card__content data-panel__content">
                        <div className="data-panel__row">
                            <div className="card__avatar"><BiImport /></div>
                            <div className="data-panel__section-title">Импорт данных</div>
                        </div>
                        <label htmlFor="file-upload" className="file_upload">
                            Прикрепите файл формата .json ... <BiPaperclip />
                        </label>
                        <input
                            id="file-upload"
                            className="file_upload__input"
                            type="file"
                            accept=".json"
                            onChange={handleImportClick}
                            disabled={isLoading}
                        />
                    </div>
                </button>
                <hr className="divider" />
                <button
                    className="card card--add"
                    type="button"
                    onClick={handleExport}
                    disabled={isLoading}
                >
                    <div className="card__content data-panel__content">
                        <div className="data-panel__row">
                            <div className="card__avatar"><BiExport /></div>
                            <div className="data-panel__section-title">Экспорт данных</div>
                        </div>
                        <div
                            className="file_upload file_upload--stub"
                            role={exportLink ? 'button' : undefined}
                            style={{
                                cursor: exportLink ? 'pointer' : 'default',
                                marginTop: '10px',
                                padding: '12px',
                            }}
                            onClick={() => {
                                if (!exportLink || !exportFileName) return
                                const link = document.createElement('a')
                                link.href = exportLink
                                link.download = exportFileName
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                            }}
                        >
                            {exportFileName || 'Файл для скачивания появится здесь ...'} <BiExport />
                        </div>
                    </div>
                </button>
            </div>
        </aside>
    )
}

export default DataPanel