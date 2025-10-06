import html2canvas from 'html2canvas';
import { createEvents } from 'ics';
import { toCsv } from './csv';
import { Task } from './db';

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv<T extends object>(filename: string, rows: T[]) {
  downloadFile(filename, toCsv(rows), 'text/csv;charset=utf-8;');
}

export function downloadMarkdown(filename: string, markdown: string) {
  downloadFile(filename, markdown, 'text/markdown;charset=utf-8;');
}

export async function downloadPng(filename: string, element: HTMLElement) {
  const canvas = await html2canvas(element);
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function downloadIcs(filename: string, tasks: Task[]) {
  const events = tasks
    .filter(t => t.milestone)
    .map(task => {
      const date = task.due || task.start;
      if (!date) return null;
      const [year, month, day] = date.split('-').map(Number);
      return {
        title: task.name,
        start: [year, month, day],
        duration: { days: task.duration ?? 0 }
      };
    })
    .filter(Boolean) as any[];

  if (!events.length) {
    throw new Error('No hay hitos para exportar.');
  }

  const { error, value } = createEvents(events);
  if (error || !value) {
    throw error ?? new Error('No se pudo generar el ICS');
  }
  downloadFile(filename, value, 'text/calendar;charset=utf-8;');
}
