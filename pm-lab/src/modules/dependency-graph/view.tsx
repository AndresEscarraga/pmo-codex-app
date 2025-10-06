import React, { useEffect, useMemo, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { useProjects } from '../../app/project-context';
import { edgeCache } from './index';

cytoscape.use(dagre);

interface EdgeRow {
  From: string;
  To: string;
  Type?: string;
}

const DependencyGraph: React.FC = () => {
  const { currentProjectId } = useProjects();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [edges, setEdges] = useState<EdgeRow[]>([]);

  useEffect(() => {
    if (!currentProjectId) return;
    const stored = edgeCache.get(currentProjectId) ?? JSON.parse(sessionStorage.getItem(`pm-lab-deps-${currentProjectId}`) ?? '[]');
    setEdges(stored);
  }, [currentProjectId]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (cyRef.current) {
      cyRef.current.destroy();
    }
    cyRef.current = cytoscape({
      container: containerRef.current,
      style: [
        { selector: 'node', style: { label: 'data(id)', 'text-valign': 'center', 'text-halign': 'center', 'background-color': '#38bdf8', color: '#0f172a', 'font-size': '12px' } },
        { selector: 'edge', style: { width: 2, 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'line-color': '#94a3b8', 'target-arrow-color': '#94a3b8', label: 'data(label)', 'font-size': '10px', color: '#e2e8f0', 'text-background-color': '#0f172a', 'text-background-opacity': 0.6, 'text-rotation': 'autorotate' } }
      ]
    });
    return () => {
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().remove();
    const nodes = new Set<string>();
    edges.forEach(edge => {
      nodes.add(edge.From);
      nodes.add(edge.To);
    });
    nodes.forEach(id => {
      cy.add({ group: 'nodes', data: { id } });
    });
    edges.forEach(edge => {
      cy.add({ group: 'edges', data: { id: `${edge.From}-${edge.To}`, source: edge.From, target: edge.To, label: edge.Type ?? '' } });
    });
    cy.layout({ name: 'dagre', rankDir: 'LR', nodeSep: 60, edgeSep: 40, rankSep: 80 }).run();
  }, [edges]);

  const metrics = useMemo(() => computeMetrics(edges), [edges]);

  return (
    <div data-module="dependency-graph" style={{ padding: '1rem', display: 'grid', gap: '1rem' }}>
      <h2>Dependency Graph</h2>
      <div className="graph-container" style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.3)' }} ref={containerRef}></div>
      <section>
        <h3>Centralidades básicas</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nodo</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Entradas</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Salidas</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Grado</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(row => (
                <tr key={row.node}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.node}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.in}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.out}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.degree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

function computeMetrics(edges: EdgeRow[]) {
  const nodes = new Map<string, { in: number; out: number }>();
  edges.forEach(edge => {
    if (!nodes.has(edge.From)) nodes.set(edge.From, { in: 0, out: 0 });
    if (!nodes.has(edge.To)) nodes.set(edge.To, { in: 0, out: 0 });
    nodes.get(edge.From)!.out += 1;
    nodes.get(edge.To)!.in += 1;
  });
  return Array.from(nodes.entries()).map(([node, value]) => ({ node, ...value, degree: value.in + value.out }));
}

export default DependencyGraph;
