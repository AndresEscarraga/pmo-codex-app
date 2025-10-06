import React, { useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../app/project-context';
import { db, Task } from '../../core/db';
import { runWorker } from '../../core/workers';
import type { MonteCarloOut } from '../../core/workers/montecarlo.worker';

const workerUrl = new URL('../../core/workers/montecarlo.worker.ts', import.meta.url);

const ScheduleMonteCarlo: React.FC = () => {
  const { currentProjectId } = useProjects();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [iterations, setIterations] = useState(500);
  const [result, setResult] = useState<MonteCarloOut | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProjectId) return;
    const load = async () => {
      const rows = await db.tasks.where('projectId').equals(currentProjectId).toArray();
      setTasks(rows);
      setResult(null);
    };
    load();
  }, [currentProjectId]);

  const updateTask = async (id: string, partial: Partial<Task>) => {
    const existing = tasks.find(t => t.id === id);
    if (!existing || !currentProjectId) return;
    const updated = { ...existing, ...partial };
    setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    await db.tasks.put({ ...updated, projectId: currentProjectId });
  };

  const runSimulation = async () => {
    if (!currentProjectId || !tasks.length) return;
    setRunning(true);
    setError(null);
    try {
      const payload = {
        iterations,
        tasks: tasks.map(task => ({
          id: task.id,
          baseDuration: task.duration ?? 1,
          distribution: task.distribution,
          predecessors: task.dependsOn
        }))
      };
      const output = await runWorker<typeof payload, MonteCarloOut>(workerUrl, payload as any);
      setResult(output);
      const summary = buildMarkdown(tasks, output);
      sessionStorage.setItem(`pm-lab-montecarlo-${currentProjectId}`, summary);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const histogramMax = useMemo(() => (result ? Math.max(...result.histogram.map(h => h.count)) : 0), [result]);

  return (
    <div data-module="schedule-montecarlo" style={{ padding: '1rem' }}>
      <h2>Simulación Monte Carlo</h2>
      <p>Define distribuciones de duración para cada tarea y ejecuta simulaciones para obtener fechas probables.</p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <label>
          Iteraciones
          <input
            type="number"
            min={100}
            max={5000}
            value={iterations}
            onChange={event => setIterations(Number(event.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
        </label>
        <button onClick={runSimulation} disabled={running}>
          {running ? 'Simulando…' : 'Ejecutar' }
        </button>
        {error && <span style={{ color: '#f87171' }}>{error}</span>}
      </div>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Tarea</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Duración base</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Distribución</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{task.name}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input
                    type="number"
                    value={task.duration ?? 1}
                    min={0}
                    onChange={event => updateTask(task.id, { duration: Number(event.target.value) })}
                  />
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input
                    type="text"
                    value={task.distribution ?? ''}
                    placeholder="triangular(a,m,b) o pert(a,m,b)"
                    onChange={event => updateTask(task.id, { distribution: event.target.value })}
                    style={{ width: '100%' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <section>
            <h3>Percentiles clave</h3>
            <ul>
              <li>P50: {result.percentiles.p50.toFixed(2)} días</li>
              <li>P80: {result.percentiles.p80.toFixed(2)} días</li>
            </ul>
          </section>
          <section>
            <h3>Histograma de duración</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '200px' }}>
              {result.histogram.map(bucket => (
                <div key={bucket.bucket} style={{ flex: 1 }}>
                  <div
                    style={{
                      background: '#38bdf8',
                      height: histogramMax ? `${(bucket.count / histogramMax) * 100}%` : 0,
                      borderRadius: '0.25rem 0.25rem 0 0'
                    }}
                  ></div>
                  <div style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '0.25rem' }}>{bucket.bucket.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3>Tareas que más impactan</h3>
            <ol>
              {result.drivers.map(driver => (
                <li key={driver.id}>
                  {driver.id}: {driver.correlation.toFixed(2)}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
};

function buildMarkdown(tasks: Task[], result: MonteCarloOut): string {
  const lines: string[] = [];
  lines.push('# Schedule Risk Monte Carlo');
  lines.push('');
  lines.push(`- P50: **${result.percentiles.p50.toFixed(2)}** días`);
  lines.push(`- P80: **${result.percentiles.p80.toFixed(2)}** días`);
  lines.push('');
  lines.push('## Top drivers');
  result.drivers.forEach(driver => {
    const task = tasks.find(t => t.id === driver.id);
    lines.push(`- ${task?.name ?? driver.id}: ${driver.correlation.toFixed(2)}`);
  });
  lines.push('');
  lines.push('## Distribuciones');
  lines.push('| Tarea | Distribución |');
  lines.push('| --- | --- |');
  tasks.forEach(task => {
    lines.push(`| ${task.name} | ${task.distribution ?? task.duration ?? ''} |`);
  });
  return lines.join('\n');
}

export default ScheduleMonteCarlo;
