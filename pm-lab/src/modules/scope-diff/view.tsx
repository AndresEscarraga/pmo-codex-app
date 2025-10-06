import React, { useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../app/project-context';
import { planCache } from './index';

interface TaskRow {
  id: string;
  name: string;
  duration?: number;
  dependsOn?: string;
  [key: string]: unknown;
}

const ScopeDiff: React.FC = () => {
  const { currentProjectId } = useProjects();
  const [v1, setV1] = useState<TaskRow[]>([]);
  const [v2, setV2] = useState<TaskRow[]>([]);

  useEffect(() => {
    const load = () => {
      if (!currentProjectId) return;
      const cached = planCache.get(currentProjectId) ?? JSON.parse(sessionStorage.getItem(`pm-lab-scope-${currentProjectId}`) ?? '{"v1":[],"v2":[]}');
      setV1(cached.v1 ?? []);
      setV2(cached.v2 ?? []);
    };
    load();
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail?.projectId === currentProjectId) {
        load();
      }
    };
    window.addEventListener('pm-lab-scope-updated', handler as EventListener);
    return () => window.removeEventListener('pm-lab-scope-updated', handler as EventListener);
  }, [currentProjectId]);

  const diff = useMemo(() => calculateDiff(v1, v2), [v1, v2]);

  return (
    <div data-module="scope-diff" style={{ padding: '1rem' }}>
      <h2>Comparador de alcance</h2>
      <p>Carga dos versiones de tu plan en CSV para identificar cambios entre iteraciones.</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Stat label="Total V1" value={v1.length} />
        <Stat label="Total V2" value={v2.length} />
        <Stat label="Nuevas" value={diff.added.length} highlight />
        <Stat label="Eliminadas" value={diff.removed.length} highlight />
        <Stat label="Modificadas" value={diff.changed.length} />
      </div>
      <section>
        <h3>Nuevas tareas en V2</h3>
        <ul>
          {diff.added.map(task => (
            <li key={task.id}>
              <strong>{task.id}</strong> — {task.name} ({task.duration ?? 's/d'})
            </li>
          ))}
          {!diff.added.length && <li>No hay nuevas tareas.</li>}
        </ul>
      </section>
      <section>
        <h3>Tareas removidas</h3>
        <ul>
          {diff.removed.map(task => (
            <li key={task.id}>
              <strong>{task.id}</strong> — {task.name}
            </li>
          ))}
          {!diff.removed.length && <li>No hay tareas removidas.</li>}
        </ul>
      </section>
      <section>
        <h3>Tareas modificadas</h3>
        <ul>
          {diff.changed.map(item => (
            <li key={item.id}>
              <strong>{item.id}</strong>
              <ul>
                {item.differences.map(diffItem => (
                  <li key={diffItem.field}>
                    {diffItem.field}: {diffItem.from} → {diffItem.to}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {!diff.changed.length && <li>No hay cambios en tareas comunes.</li>}
        </ul>
      </section>
    </div>
  );
};

function calculateDiff(v1: TaskRow[], v2: TaskRow[]) {
  const v1Map = new Map(v1.map(task => [task.id, task]));
  const v2Map = new Map(v2.map(task => [task.id, task]));
  const added = v2.filter(task => !v1Map.has(task.id));
  const removed = v1.filter(task => !v2Map.has(task.id));
  const changed = v2
    .filter(task => v1Map.has(task.id))
    .map(task => {
      const previous = v1Map.get(task.id)!;
      const differences: { field: string; from: unknown; to: unknown }[] = [];
      ['name', 'duration', 'dependsOn', 'status'].forEach(field => {
        if ((previous as any)[field] !== (task as any)[field]) {
          differences.push({ field, from: (previous as any)[field] ?? '—', to: (task as any)[field] ?? '—' });
        }
      });
      return { id: task.id, differences };
    })
    .filter(item => item.differences.length > 0);
  return { added, removed, changed };
}

const Stat: React.FC<{ label: string; value: number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div
    style={{
      padding: '1rem',
      borderRadius: '0.75rem',
      background: highlight ? 'rgba(34,197,94,0.2)' : 'rgba(148,163,184,0.1)',
      minWidth: '120px'
    }}
  >
    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{label}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
  </div>
);

export const buildScopeMarkdown = (v1: TaskRow[], v2: TaskRow[]) => {
  const diff = calculateDiff(v1, v2);
  const lines: string[] = [];
  lines.push('# Scope Diff');
  lines.push('');
  lines.push(`- Total V1: ${v1.length}`);
  lines.push(`- Total V2: ${v2.length}`);
  lines.push(`- Nuevas: ${diff.added.length}`);
  lines.push(`- Removidas: ${diff.removed.length}`);
  lines.push(`- Modificadas: ${diff.changed.length}`);
  lines.push('');
  lines.push('## Nuevas');
  diff.added.forEach(task => lines.push(`- ${task.id} ${task.name}`));
  if (!diff.added.length) lines.push('- No hay');
  lines.push('');
  lines.push('## Removidas');
  diff.removed.forEach(task => lines.push(`- ${task.id} ${task.name}`));
  if (!diff.removed.length) lines.push('- No hay');
  lines.push('');
  lines.push('## Modificadas');
  diff.changed.forEach(item => {
    lines.push(`- ${item.id}`);
    item.differences.forEach(diffItem => {
      lines.push(`  - ${diffItem.field}: ${diffItem.from} -> ${diffItem.to}`);
    });
  });
  if (!diff.changed.length) lines.push('- No hay');
  return lines.join('\n');
};

export default ScopeDiff;
