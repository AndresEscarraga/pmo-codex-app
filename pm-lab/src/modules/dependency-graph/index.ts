import { registry } from '../../app/plugins';
import View from './view';
import { parseCsvFile } from '../../core/csv';
import { DependencyEdgeSchema } from '../../data-schemas/dependencies';

const moduleId = 'dependency-graph';
const edgeCache = new Map<string, { From: string; To: string; Type?: string }[]>();

registry.push({
  id: moduleId,
  title: 'Dependency Graph',
  route: moduleId,
  icon: '🕸️',
  view: View,
  importers: [
    {
      id: 'deps-csv',
      label: 'Importar dependencias CSV',
      accept: ['text/csv'],
      run: async (file, projectId) => {
        const rows = await parseCsvFile(file, DependencyEdgeSchema);
        edgeCache.set(projectId, rows);
        sessionStorage.setItem(`pm-lab-deps-${projectId}`, JSON.stringify(rows));
        window.dispatchEvent(new CustomEvent('pm-lab-deps-updated', { detail: { projectId } }));
      }
    }
  ],
  exporters: [
    {
      id: 'deps-png',
      label: 'Exportar PNG',
      run: async projectId => {
        const container = document.querySelector('[data-module="dependency-graph"] .graph-container') as HTMLElement | null;
        if (!container) throw new Error('No se encontró el gráfico para exportar.');
        const { downloadPng } = await import('../../core/export');
        await downloadPng('dependency-graph.png', container);
      }
    }
  ],
  loadSample: async projectId => {
    const csv = await fetch(new URL('../../samples/dependency-graph/dependencies.csv', import.meta.url)).then(res => res.text());
    const [, ...rows] = csv.trim().split('\n');
    const data = rows.map(line => {
      const [From, To, Type] = line.split(',');
      return { From, To, Type };
    });
    edgeCache.set(projectId, data);
    sessionStorage.setItem(`pm-lab-deps-${projectId}`, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('pm-lab-deps-updated', { detail: { projectId } }));
  }
});

export { edgeCache };
