import React, { useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../app/project-context';
import { db, Risk } from '../../core/db';

const probabilityScale = [1, 2, 3, 4, 5];
const impactScale = [1, 2, 3, 4, 5];

const RaidBoard: React.FC = () => {
  const { currentProjectId } = useProjects();
  const [risks, setRisks] = useState<Risk[]>([]);

  useEffect(() => {
    if (!currentProjectId) return;
    const load = async () => {
      const rows = await db.risks.where('projectId').equals(currentProjectId).toArray();
      setRisks(rows);
    };
    load();
  }, [currentProjectId]);

  const saveRisk = async (risk: Risk) => {
    if (!currentProjectId) return;
    await db.risks.put({ ...risk, projectId: currentProjectId });
    const rows = await db.risks.where('projectId').equals(currentProjectId).toArray();
    setRisks(rows);
  };

  const addRisk = async () => {
    if (!currentProjectId) return;
    const newRisk: Risk = {
      id: crypto.randomUUID(),
      projectId: currentProjectId,
      title: 'Nuevo riesgo',
      prob: 3,
      impact: 3,
      notes: ''
    };
    await db.risks.put(newRisk);
    const rows = await db.risks.where('projectId').equals(currentProjectId).toArray();
    setRisks(rows);
  };

  const deleteRisk = async (id: string) => {
    await db.risks.delete(id);
    if (!currentProjectId) return;
    const rows = await db.risks.where('projectId').equals(currentProjectId).toArray();
    setRisks(rows);
  };

  const heatmap = useMemo(() => {
    const grid: number[][] = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => 0));
    risks.forEach(risk => {
      const pIndex = Math.min(Math.max(risk.prob, 1), 5) - 1;
      const iIndex = Math.min(Math.max(risk.impact, 1), 5) - 1;
      grid[pIndex][iIndex] += 1;
    });
    return grid;
  }, [risks]);

  return (
    <div data-module="raid-board" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>RAID Board</h2>
        <button onClick={addRisk}>Agregar riesgo</button>
      </div>
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Título</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Prob</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Impacto</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Dueño</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Fecha</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Notas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {risks.map(risk => (
              <tr key={risk.id}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input value={risk.title} onChange={event => saveRisk({ ...risk, title: event.target.value })} style={{ width: '100%' }} />
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={risk.prob}
                    onChange={event => saveRisk({ ...risk, prob: Number(event.target.value) })}
                    style={{ width: '4rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={risk.impact}
                    onChange={event => saveRisk({ ...risk, impact: Number(event.target.value) })}
                    style={{ width: '4rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input value={risk.owner ?? ''} onChange={event => saveRisk({ ...risk, owner: event.target.value })} />
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="date" value={risk.due ?? ''} onChange={event => saveRisk({ ...risk, due: event.target.value })} />
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <textarea
                    value={risk.notes ?? ''}
                    onChange={event => saveRisk({ ...risk, notes: event.target.value })}
                    style={{ width: '100%' }}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <button onClick={() => deleteRisk(risk.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section>
        <h3>Heatmap probabilidad x impacto</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(60px, 1fr))', gap: '2px' }}>
          <div></div>
          {impactScale.map(impact => (
            <div key={`impact-${impact}`} style={{ textAlign: 'center', fontSize: '0.8rem' }}>
              Impacto {impact}
            </div>
          ))}
          {probabilityScale.map((prob, row) => (
            <React.Fragment key={`row-${prob}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>Prob {prob}</div>
              {impactScale.map((impact, col) => {
                const count = heatmap[row][col];
                const intensity = Math.min(1, count / 3);
                return (
                  <div
                    key={`cell-${row}-${col}`}
                    style={{
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`,
                      color: '#0f172a',
                      fontWeight: 600,
                      borderRadius: '0.25rem'
                    }}
                  >
                    {count || ''}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RaidBoard;
