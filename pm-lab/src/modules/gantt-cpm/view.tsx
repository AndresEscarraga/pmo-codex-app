import React, { useEffect, useMemo, useRef, useState } from 'react';
import { db, Task } from '../../core/db';
import { useProjects } from '../../app/project-context';
import { runWorker } from '../../core/workers';
import type { CPMOut } from '../../core/workers/cpm.worker';

const workerUrl = new URL('../../core/workers/cpm.worker.ts', import.meta.url);

interface EditableTask extends Task {}

const columns: { key: keyof EditableTask | 'dependsOnText'; label: string; type?: 'number' | 'text' }[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'duration', label: 'Duración', type: 'number' },
  { key: 'dependsOnText', label: 'Depende de' },
  { key: 'assignee', label: 'Responsable' },
  { key: 'status', label: 'Estado' },
  { key: 'start', label: 'Inicio' },
  { key: 'due', label: 'Fin' },
  { key: 'distribution', label: 'Distribución' }
];

const GanttCPMView: React.FC = () => {
  const { currentProjectId } = useProjects();
  const [tasks, setTasks] = useState<EditableTask[]>([]);
  const [cpm, setCpm] = useState<CPMOut | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProjectId) return;
    const load = async () => {
      const rows = await db.tasks.where('projectId').equals(currentProjectId).toArray();
      setTasks(rows);
    };
    load();
  }, [currentProjectId]);

  const criticalSet = useMemo(() => new Set(cpm?.critical ?? []), [cpm]);

  const updateTask = async (id: string, partial: Partial<EditableTask>) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !currentProjectId) return;
    const updated: EditableTask = { ...task, ...partial };
    updated.dependsOn = (partial as any).dependsOn ?? updated.dependsOn;
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    if (partial.id && partial.id !== id) {
      await db.tasks.delete(id);
    }
    await db.tasks.put({ ...updated, projectId: currentProjectId });
  };

  const addTask = async () => {
    if (!currentProjectId) return;
    const id = crypto.randomUUID().slice(0, 8);
    const newTask: EditableTask = {
      id,
      projectId: currentProjectId,
      name: 'Nueva tarea',
      dependsOn: [],
      duration: 1
    };
    await db.tasks.put(newTask);
    const rows = await db.tasks.where('projectId').equals(currentProjectId).toArray();
    setTasks(rows);
  };

  const deleteTask = async (id: string) => {
    if (!currentProjectId) return;
    await db.tasks.delete(id);
    const rows = await db.tasks.where('projectId').equals(currentProjectId).toArray();
    setTasks(rows);
  };

  const runCPM = async () => {
    if (!tasks.length) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nodes: tasks.map(task => ({ id: task.id, duration: task.duration ?? 0 })),
        edges: tasks.flatMap(task => task.dependsOn.map(dep => ({ from: dep, to: task.id })))
      };
      const result = await runWorker<typeof payload, CPMOut>(workerUrl, payload as any);
      setCpm(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCPM();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjectId]);

  const maxEf = useMemo(() => (cpm ? Math.max(...Object.values(cpm.ef)) : 0), [cpm]);

  return (
    <div className="module" data-module="gantt-cpm" ref={containerRef} style={{ padding: '1rem', color: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
        <h2>Plan de tareas</h2>
        <button onClick={addTask}>Agregar tarea</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem' }}>
                  {col.label}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const dependsOnText = task.dependsOn.join(';');
              return (
                <tr key={task.id} style={{ background: criticalSet.has(task.id) ? 'rgba(248,113,113,0.2)' : 'transparent' }}>
                  {columns.map(col => {
                    const key = col.key === 'dependsOnText' ? 'dependsOn' : col.key;
                    const value = col.key === 'dependsOnText' ? dependsOnText : (task as any)[col.key];
                    return (
                      <td key={col.key} style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <input
                          type={col.type ?? 'text'}
                          value={value ?? ''}
                          onChange={event => {
                            const nextValue = event.target.value;
                            if (key === 'dependsOn') {
                              updateTask(task.id, { dependsOn: nextValue.split(';').map(v => v.trim()).filter(Boolean) } as any);
                            } else if (col.type === 'number') {
                              const parsed = nextValue === '' ? undefined : Number(nextValue);
                              updateTask(task.id, { [key]: parsed } as any);
                            } else {
                              updateTask(task.id, { [key]: nextValue } as any);
                            }
                          }}
                          style={{ width: '100%' }}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={runCPM} disabled={loading}>
          {loading ? 'Calculando…' : 'Run CPM'}
        </button>
        {error && <span style={{ marginLeft: '1rem', color: '#f87171' }}>{error}</span>}
      </div>
      {cpm && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <section>
            <h3>Camino crítico</h3>
            <p>
              Duración total: <strong>{maxEf.toFixed(2)}</strong> días
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {cpm.critical.map(id => (
                <span key={id} style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '999px' }}>
                  {id}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h3>Gantt simplificado</h3>
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}>
              {tasks.map(task => {
                const es = cpm.es[task.id] ?? 0;
                const ef = cpm.ef[task.id] ?? 0;
                const width = maxEf ? ((ef - es) / maxEf) * 100 : 0;
                const offset = maxEf ? (es / maxEf) * 100 : 0;
                return (
                  <div key={task.id} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>{task.name}</div>
                    <div style={{ position: 'relative', background: 'rgba(148,163,184,0.2)', height: '1.5rem', borderRadius: '0.75rem' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: `${offset}%`,
                          width: `${width}%`,
                          top: 0,
                          bottom: 0,
                          borderRadius: '0.75rem',
                          background: criticalSet.has(task.id) ? '#ef4444' : '#38bdf8'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section>
            <h3>Fechas calculadas</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Tarea</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>ES</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>EF</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>LS</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>LF</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Holgura</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{task.name}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{cpm.es[task.id]?.toFixed(2)}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{cpm.ef[task.id]?.toFixed(2)}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{cpm.ls[task.id]?.toFixed(2)}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{cpm.lf[task.id]?.toFixed(2)}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{cpm.float[task.id]?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default GanttCPMView;
