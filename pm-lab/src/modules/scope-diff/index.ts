import { registry } from '../../app/plugins';
import View, { buildScopeMarkdown } from './view';
import { parseCsvFile } from '../../core/csv';
import { TaskCsvSchema } from '../../data-schemas/tasks';

const moduleId = 'scope-diff';

const planCache = new Map<string, { v1: any[]; v2: any[] }>();

registry.push({
  id: moduleId,
  title: 'Scope Diff',
  route: moduleId,
  icon: '🔍',
  view: View,
  importers: [
    {
      id: 'scope-v1',
      label: 'Cargar Plan V1',
      accept: ['text/csv'],
      run: async (file, projectId) => {
        const rows = await parseCsvFile(file, TaskCsvSchema);
        const entry = planCache.get(projectId) ?? { v1: [], v2: [] };
        entry.v1 = rows;
        planCache.set(projectId, entry);
        sessionStorage.setItem(`pm-lab-scope-${projectId}`, JSON.stringify(entry));
        window.dispatchEvent(new CustomEvent('pm-lab-scope-updated', { detail: { projectId } }));
      }
    },
    {
      id: 'scope-v2',
      label: 'Cargar Plan V2',
      accept: ['text/csv'],
      run: async (file, projectId) => {
        const rows = await parseCsvFile(file, TaskCsvSchema);
        const entry = planCache.get(projectId) ?? { v1: [], v2: [] };
        entry.v2 = rows;
        planCache.set(projectId, entry);
        sessionStorage.setItem(`pm-lab-scope-${projectId}`, JSON.stringify(entry));
        window.dispatchEvent(new CustomEvent('pm-lab-scope-updated', { detail: { projectId } }));
      }
    }
  ],
  exporters: [
    {
      id: 'scope-md',
      label: 'Exportar Markdown',
      run: async projectId => {
        const data = planCache.get(projectId) ?? JSON.parse(sessionStorage.getItem(`pm-lab-scope-${projectId}`) ?? '{"v1":[],"v2":[]}');
        if (!data) throw new Error('No hay comparaciones disponibles');
        const lines = buildScopeMarkdown(data.v1, data.v2);
        const blob = new Blob([lines], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scope-diff.md';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  ],
  loadSample: async projectId => {
    const [v1, v2] = await Promise.all([
      fetch(new URL('../../samples/scope-diff/plan-v1.csv', import.meta.url)).then(res => res.text()),
      fetch(new URL('../../samples/scope-diff/plan-v2.csv', import.meta.url)).then(res => res.text())
    ]);
    const parse = (text: string) =>
      text
        .trim()
        .split('\n')
        .slice(1)
        .map(line => {
          const [id, name, duration, dependsOn] = line.split(',');
          return { id, name, duration, dependsOn };
        });
    const entry = { v1: parse(v1), v2: parse(v2) };
    planCache.set(projectId, entry);
    sessionStorage.setItem(`pm-lab-scope-${projectId}`, JSON.stringify(entry));
    window.dispatchEvent(new CustomEvent('pm-lab-scope-updated', { detail: { projectId } }));
  }
});

export { planCache };
