import { registry } from '../../app/plugins';
import View from './view';
import { parseCsvFile } from '../../core/csv';
import { TaskCsvSchema } from '../../data-schemas/tasks';
import { db } from '../../core/db';
import { downloadMarkdown } from '../../core/export';

const moduleId = 'schedule-montecarlo';

registry.push({
  id: moduleId,
  title: 'Schedule Risk Monte Carlo',
  route: moduleId,
  icon: '🎲',
  view: View,
  importers: [
    {
      id: 'tasks-csv',
      label: 'Importar tareas (CSV)',
      accept: ['text/csv'],
      run: async (file, projectId) => {
        const rows = await parseCsvFile(file, TaskCsvSchema);
        await Promise.all(
          rows.map(async row => {
            await db.tasks.put({
              id: row.id,
              projectId,
              name: row.name,
              duration: row.duration,
              dependsOn: row.dependsOn ? row.dependsOn.split(';').map(v => v.trim()).filter(Boolean) : [],
              distribution: row.distribution,
              assignee: row.assignee,
              status: row.status,
              start: row.start,
              due: row.due
            });
          })
        );
      }
    }
  ],
  exporters: [
    {
      id: 'montecarlo-md',
      label: 'Exportar resumen Markdown',
      run: async projectId => {
        const latest = sessionStorage.getItem(`pm-lab-montecarlo-${projectId}`);
        if (!latest) throw new Error('Ejecuta una simulación antes de exportar.');
        downloadMarkdown('schedule-risk.md', latest);
      }
    }
  ],
  loadSample: async projectId => {
    const tasksText = await fetch(new URL('../../samples/gantt-cpm/tasks.sample.csv', import.meta.url)).then(res => res.text());
    const distributionText = await fetch(new URL('../../samples/schedule-montecarlo/distributions.csv', import.meta.url)).then(res => res.text());
    const distMap = new Map(
      distributionText
        .trim()
        .split('\n')
        .slice(1)
        .map(line => {
          const [id, distribution] = line.split(',');
          return [id, distribution];
        })
    );
    const rows = tasksText
      .trim()
      .split('\n')
      .slice(1)
      .map(line => {
        const [id, name, duration, dependsOn, assignee, status, start, due, distribution] = line.split(',');
        return {
          id,
          name,
          duration: duration ? Number(duration) : undefined,
          dependsOn: dependsOn ? dependsOn.split(';').filter(Boolean) : [],
          assignee,
          status,
          start,
          due,
          distribution: distMap.get(id) ?? distribution
        };
      });
    await db.tasks.where('projectId').equals(projectId).delete();
    for (const row of rows) {
      await db.tasks.put({
        id: row.id,
        projectId,
        name: row.name,
        duration: row.duration,
        dependsOn: row.dependsOn,
        assignee: row.assignee,
        status: row.status,
        start: row.start,
        due: row.due,
        distribution: row.distribution
      });
    }
  }
});
