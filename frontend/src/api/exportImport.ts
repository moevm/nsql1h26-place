import { runApi } from './hooks'

export type ExportFormat = 'json';
export type ImportFormat = 'json';

export const exportData = async (): Promise<Blob> => {
  const result = await runApi<Record<string, unknown>>('GET', '/export-import/export');
  const jsonString = JSON.stringify(result, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
};

export const importData = async (
  content: string,
): Promise<{ message: string; success: boolean }> => {
  return runApi<
    { message: string; success: boolean },
    { content: string }
  >('POST', `/export-import/import`, { content });
};

export const downloadExportFile = async (): Promise<void> => {
  try {
    const blob = await exportData();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = 'json';
    link.download = `mushroom-place-export-${timestamp}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
};

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
