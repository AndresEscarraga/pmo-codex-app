import { registry } from '../../app/plugins';
import View from './view';
import { parseCsvFile } from '../../core/csv';
import { TaskCsvSchema } from '../../data-schemas/tasks';
import { db } from '../../core/db';
import { downloadCsv, downloadPng, downloadIcs } from '../../core/export';

const moduleId = 'gantt-cpm';

registry.push({
  id: moduleId,
  title: 'Gantt & Critical Path',
  route: moduleId,
  icon: '🗓️',
  view: View,
  importers: [
    {
      id: 'tasks-csv',
      label: 'Importar tareas CSV',
      accept: ['text/csv'],
      run: async (file, projectId) => {
        const tasks = await parseCsvFile(file, TaskCsvSchema);
        await db.tasks.where('projectId').equals(projectId).delete();
        await Promise.all(
          tasks.map(async task => {
            await db.tasks.put({
              id: task.id,
              projectId,
              name: task.name,
              duration: task.duration,
              dependsOn: task.dependsOn ? task.dependsOn.split(';').map(v => v.trim()).filter(Boolean) : [],
              assignee: task.assignee,
              status: task.status,
              start: task.start,
              due: task.due,
              distribution: task.distribution
            });
          })
        );
      }
    }
  ],
  exporters: [
    {
      id: 'tasks-csv',
      label: 'Exportar CSV',
      run: async projectId => {
        const tasks = await db.tasks.where('projectId').equals(projectId).toArray();
        downloadCsv(
          'tasks.csv',
          tasks.map(task => ({
            id: task.id,
            name: task.name,
            duration: task.duration ?? '',
            dependsOn: task.dependsOn.join(';'),
            assignee: task.assignee ?? '',
            status: task.status ?? '',
            start: task.start ?? '',
            due: task.due ?? '',
            distribution: task.distribution ?? ''
          }))
        );
      }
    },
    {
      id: 'tasks-png',
      label: 'Exportar PNG',
      run: async projectId => {
        const container = document.querySelector('[data-module="gantt-cpm"]') as HTMLElement | null;
        if (!container) throw new Error('No se encontró el contenedor para PNG');
        await downloadPng('gantt.png', container);
      }
    },
    {
      id: 'tasks-ics',
      label: 'Exportar ICS (hitos)',
      run: async projectId => {
        const tasks = await db.tasks.where('projectId').equals(projectId).toArray();
        downloadIcs('milestones.ics', tasks);
      }
    }
  ],
  loadSample: async projectId => {
    const sample = await fetch(new URL('../../samples/gantt-cpm/tasks.sample.csv', import.meta.url)).then(res => res.text());
    const rows = sample.trim().split('\n');
    const header = rows.shift();
    if (!header) return;
    const tasks = rows.map(line => {
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
        distribution
      };
    });
    await db.tasks.where('projectId').equals(projectId).delete();
    for (const task of tasks) {
      await db.tasks.put({
        id: task.id,
        projectId,
        name: task.name,
        duration: task.duration,
        dependsOn: task.dependsOn,
        assignee: task.assignee,
        status: task.status,
        start: task.start,
        due: task.due,
        distribution: task.distribution
      });
    }
  }
});
