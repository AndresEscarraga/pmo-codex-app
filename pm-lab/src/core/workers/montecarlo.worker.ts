type SimulationTask = {
  id: string;
  baseDuration: number;
  distribution?: string;
  predecessors: string[];
};

export interface MonteCarloIn {
  iterations: number;
  tasks: SimulationTask[];
}

export interface MonteCarloOut {
  histogram: { bucket: number; count: number }[];
  percentiles: { p50: number; p80: number };
  drivers: { id: string; correlation: number }[];
}

type CPMResult = { duration: number; es: Record<string, number>; ef: Record<string, number> };

function parseDistribution(distribution?: string) {
  if (!distribution) return null;
  const match = distribution.match(/(triangular|pert)\(([^)]+)\)/i);
  if (!match) return null;
  const [, type, args] = match;
  const [a, m, b] = args.split(',').map(v => parseFloat(v.trim()));
  if ([a, m, b].some(v => Number.isNaN(v))) return null;
  return { type: type.toLowerCase(), a, m, b } as const;
}

function sampleDuration(task: SimulationTask): number {
  const parsed = parseDistribution(task.distribution);
  if (!parsed) return task.baseDuration;
  const { a, m, b } = parsed;
  if (parsed.type === 'triangular') {
    const u = Math.random();
    const c = (m - a) / (b - a);
    if (u < c) {
      return a + Math.sqrt(u * (b - a) * (m - a));
    }
    return b - Math.sqrt((1 - u) * (b - a) * (b - m));
  }
  // pert: beta distribution approximation
  const alpha = 1 + 4 * ((m - a) / (b - a));
  const beta = 1 + 4 * ((b - m) / (b - a));
  const x = sampleBeta(alpha, beta);
  return a + x * (b - a);
}

function sampleBeta(alpha: number, beta: number) {
  const x = sampleGamma(alpha);
  const y = sampleGamma(beta);
  return x / (x + y);
}

function sampleGamma(k: number) {
  if (k < 1) {
    const c = 1 / k;
    const d = 1 / (1 - k);
    while (true) {
      const u = Math.random();
      const v = Math.random();
      const z = -Math.log(u);
      const e = Math.pow(v, d);
      if (z + e >= c) {
        return Math.pow(z, c);
      }
    }
  }
  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x: number;
    let v: number;
    do {
      x = gaussian();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function gaussian() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function runCPM(tasks: { id: string; duration: number; predecessors: string[] }[]): CPMResult {
  const es: Record<string, number> = {};
  const ef: Record<string, number> = {};
  const order: string[] = [];
  const incoming: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};
  const indegree: Record<string, number> = {};
  tasks.forEach(t => {
    incoming[t.id] = t.predecessors;
    outgoing[t.id] = [];
  });
  tasks.forEach(t => {
    t.predecessors.forEach(p => {
      outgoing[p] = outgoing[p] ?? [];
      outgoing[p].push(t.id);
    });
  });
  tasks.forEach(t => {
    indegree[t.id] = t.predecessors.filter(Boolean).length;
  });
  const queue = Object.keys(indegree).filter(id => indegree[id] === 0);
  while (queue.length) {
    const current = queue.shift()!;
    order.push(current);
    const preds = incoming[current];
    const earliest = preds.length ? Math.max(...preds.map(p => ef[p] ?? 0)) : 0;
    es[current] = earliest;
    ef[current] = earliest + (tasks.find(t => t.id === current)?.duration ?? 0);
    for (const next of outgoing[current] ?? []) {
      indegree[next] -= 1;
      if (indegree[next] === 0) queue.push(next);
    }
  }
  const duration = Math.max(0, ...Object.values(ef));
  return { duration, es, ef };
}

self.onmessage = (event: MessageEvent<MonteCarloIn>) => {
  const { iterations, tasks } = event.data;
  const durationsMatrix: Record<string, number[]> = {};
  const totals: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const sampledTasks = tasks.map(task => ({
      id: task.id,
      predecessors: task.predecessors,
      duration: sampleDuration(task)
    }));
    const result = runCPM(sampledTasks);
    totals.push(result.duration);
    sampledTasks.forEach(task => {
      durationsMatrix[task.id] = durationsMatrix[task.id] ?? [];
      durationsMatrix[task.id].push(task.duration);
    });
  }

  const sorted = [...totals].sort((a, b) => a - b);
  const percentile = (p: number) => {
    if (!sorted.length) return 0;
    const idx = Math.floor(p * (sorted.length - 1));
    return sorted[idx];
  };

  const histogram = buildHistogram(totals, 10);
  const correlations = Object.entries(durationsMatrix).map(([id, values]) => ({
    id,
    correlation: pearson(values, totals)
  }));
  correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));

  postMessage({
    histogram,
    percentiles: { p50: percentile(0.5), p80: percentile(0.8) },
    drivers: correlations.slice(0, 5)
  } satisfies MonteCarloOut);
};

function buildHistogram(values: number[], buckets: number) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / buckets || 1;
  const hist = Array.from({ length: buckets }, (_, i) => ({ bucket: min + i * step, count: 0 }));
  values.forEach(v => {
    const index = Math.min(buckets - 1, Math.floor((v - min) / step));
    hist[index].count += 1;
  });
  return hist;
}

function pearson(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  const meanA = a.reduce((sum, v, i) => (i < n ? sum + v : sum), 0) / n;
  const meanB = b.reduce((sum, v, i) => (i < n ? sum + v : sum), 0) / n;
  let num = 0;
  let denomA = 0;
  let denomB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denomA += da * da;
    denomB += db * db;
  }
  return num / Math.sqrt(denomA * denomB || 1);
}
