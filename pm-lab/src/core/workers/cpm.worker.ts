export type Edge = { from: string; to: string };
export type Node = { id: string; duration: number };
export type CPMIn = { nodes: Node[]; edges: Edge[] };
export type CPMOut = {
  es: Record<string, number>;
  ef: Record<string, number>;
  ls: Record<string, number>;
  lf: Record<string, number>;
  float: Record<string, number>;
  critical: string[];
};

self.onmessage = (event: MessageEvent<CPMIn>) => {
  const { nodes, edges } = event.data;
  const durations = Object.fromEntries(nodes.map(n => [n.id, n.duration ?? 0]));
  const incoming: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};
  nodes.forEach(node => {
    incoming[node.id] = [];
    outgoing[node.id] = [];
  });
  edges.forEach(edge => {
    outgoing[edge.from]?.push(edge.to);
    incoming[edge.to]?.push(edge.from);
  });

  const indeg: Record<string, number> = Object.fromEntries(
    nodes.map(node => [node.id, incoming[node.id].length])
  );
  const queue = Object.keys(indeg).filter(key => indeg[key] === 0);
  const topo: string[] = [];
  while (queue.length) {
    const v = queue.shift()!;
    topo.push(v);
    for (const next of outgoing[v]) {
      indeg[next] -= 1;
      if (indeg[next] === 0) queue.push(next);
    }
  }

  const es: Record<string, number> = {};
  const ef: Record<string, number> = {};
  topo.forEach(node => {
    const predecessors = incoming[node];
    const earliest = predecessors.length ? Math.max(...predecessors.map(p => ef[p] ?? 0)) : 0;
    es[node] = earliest;
    ef[node] = earliest + (durations[node] ?? 0);
  });

  const lf: Record<string, number> = {};
  const ls: Record<string, number> = {};
  const projectEnd = Math.max(...Object.values(ef));
  [...topo].reverse().forEach(node => {
    const successors = outgoing[node];
    lf[node] = successors.length ? Math.min(...successors.map(s => ls[s])) : projectEnd;
    ls[node] = lf[node] - (durations[node] ?? 0);
  });

  const float: Record<string, number> = {};
  Object.keys(durations).forEach(id => {
    float[id] = (ls[id] ?? 0) - (es[id] ?? 0);
  });
  const critical = Object.keys(float).filter(id => Math.abs(float[id]) < 1e-9);

  postMessage({ es, ef, ls, lf, float, critical } satisfies CPMOut);
};
