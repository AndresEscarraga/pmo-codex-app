import { registry } from '../../app/plugins';
import View from './view';
import { parseCsvFile } from '../../core/csv';
import { RiskCsvSchema } from '../../data-schemas/risks';
import { db } from '../../core/db';
import { downloadCsv, downloadMarkdown } from '../../core/export';

const moduleId = 'raid-board';

registry.push({
  id: moduleId,
  title: 'RAID Board',
  route: moduleId,
  icon: '⚠️',
  view: View,
  importers: [
    {
      id: 'risks-csv',
      label: 'Importar riesgos CSV',
      accept: ['text/csv'],
      run: async (file, projectId) => {
        const rows = await parseCsvFile(file, RiskCsvSchema);
        await db.risks.where('projectId').equals(projectId).delete();
        await Promise.all(
          rows.map(async (row, index) => {
            await db.risks.put({
              id: `${projectId}-risk-${index}`,
              projectId,
              title: row.title,
              prob: row.prob,
              impact: row.impact,
              owner: row.owner,
              due: row.due,
              notes: row.notes
            });
          })
        );
      }
    }
  ],
  exporters: [
    {
      id: 'risks-csv',
      label: 'Exportar CSV',
      run: async projectId => {
        const rows = await db.risks.where('projectId').equals(projectId).toArray();
        downloadCsv(
          'risks.csv',
          rows.map(risk => ({
            title: risk.title,
            prob: risk.prob,
            impact: risk.impact,
            owner: risk.owner ?? '',
            due: risk.due ?? '',
            notes: risk.notes ?? ''
          }))
        );
      }
    },
    {
      id: 'risks-md',
      label: 'Exportar Markdown',
      run: async projectId => {
        const rows = await db.risks.where('projectId').equals(projectId).toArray();
        const lines = ['# Riesgos', '', '| Riesgo | Probabilidad | Impacto | Dueño | Fecha | Notas |', '| --- | --- | --- | --- | --- | --- |'];
        rows.forEach(risk => {
          lines.push(`| ${risk.title} | ${risk.prob} | ${risk.impact} | ${risk.owner ?? ''} | ${risk.due ?? ''} | ${risk.notes ?? ''} |`);
        });
        downloadMarkdown('riesgos.md', lines.join('\n'));
      }
    }
  ],
  loadSample: async projectId => {
    const csv = await fetch(new URL('../../samples/raid-board/raid.sample.csv', import.meta.url)).then(res => res.text());
    const [, ...rows] = csv.trim().split('\n');
    await db.risks.where('projectId').equals(projectId).delete();
    for (const [index, line] of rows.entries()) {
      const [title, prob, impact, owner, due, notes] = line.split(',');
      await db.risks.put({
        id: `${projectId}-sample-${index}`,
        projectId,
        title,
        prob: Number(prob),
        impact: Number(impact),
        owner,
        due,
        notes
      });
    }
  }
});
