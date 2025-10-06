## Welcome to GitHub Pages
---
layout: default
title: Portfolio Command Center
---

You can use the [editor on GitHub](https://github.com/AndresEscarraga/portfolio/edit/master/index.md) to maintain and preview the content for your website in Markdown files.
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.
<style>
:root {
  color-scheme: light dark;
  --bg: #0f172a;
  --bg-card: rgba(15, 23, 42, 0.65);
  --bg-card-light: #ffffff;
  --border: rgba(148, 163, 184, 0.3);
  --accent: #38bdf8;
  --accent-strong: #0ea5e9;
  --positive: #22c55e;
  --warning: #fbbf24;
  --danger: #f87171;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

### Markdown
body {
  margin: 0;
  padding: 0;
  background: radial-gradient(circle at top, rgba(14, 165, 233, 0.18), transparent 40%),
              radial-gradient(circle at bottom, rgba(34, 197, 94, 0.12), transparent 45%),
              var(--bg);
  color: var(--text);
  line-height: 1.5;
}

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}

```markdown
Syntax highlighted code block
h1, h2, h3 {
  font-weight: 600;
  margin-top: 0;
}

# Header 1
## Header 2
### Header 3
.dashboard-card {
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.55), rgba(14, 165, 233, 0.35));
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 22px;
  padding: 3rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.4);
  margin-bottom: 2.5rem;
}

- Bulleted
- List
.dashboard-card h1 {
  font-size: 2.8rem;
  margin-bottom: 0.75rem;
}

1. Numbered
2. List
.dashboard-card p.lead {
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

**Bold** and _Italic_ and `Code` text
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

[Link](url) and ![Image](src)
```
.summary-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).
.summary-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.25), transparent 45%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

### Jekyll Themes
.summary-item:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 189, 248, 0.55);
}

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/AndresEscarraga/portfolio/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.
.summary-item:hover::after {
  opacity: 1;
}

### Support or Contact
.summary-item h3 {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.summary-item .value {
  font-size: 2rem;
  font-weight: 600;
}

.section-card {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 22px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.35);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
}

.section-header span {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 18px;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.chart-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.alert-card {
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.58);
}

.alert-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.alert-card ul {
  margin: 0;
  padding-left: 1rem;
  color: var(--text-muted);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.filter-bar input,
.filter-bar select {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  color: var(--text);
  min-width: 160px;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table thead {
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.projects-table th,
.projects-table td {
  padding: 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  text-align: left;
}

.projects-table tbody tr {
  cursor: pointer;
  transition: background 0.2s ease;
}

.projects-table tbody tr:hover {
  background: rgba(56, 189, 248, 0.08);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
}

.badge.on-track { background: rgba(34, 197, 94, 0.18); color: var(--positive); }
.badge.at-risk { background: rgba(251, 191, 36, 0.2); color: var(--warning); }
.badge.off-track { background: rgba(248, 113, 113, 0.2); color: var(--danger); }
.badge.low { background: rgba(34, 197, 94, 0.15); color: var(--positive); }
.badge.medium { background: rgba(251, 191, 36, 0.18); color: var(--warning); }
.badge.high { background: rgba(248, 113, 113, 0.2); color: var(--danger); }

.detail-panel {
  margin-top: 1.5rem;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.56);
  padding: 1.75rem;
}

.detail-panel h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.detail-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.progress-bar {
  height: 9px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
  overflow: hidden;
}

.progress-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
}

.chat-card {
  display: grid;
  gap: 1rem;
}

.chat-log {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 1rem;
  max-height: 320px;
  overflow-y: auto;
  display: grid;
  gap: 0.75rem;
}

.chat-message {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.chat-message .avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
}

.chat-message.user .avatar { background: rgba(56, 189, 248, 0.22); color: var(--accent); }
.chat-message.ai .avatar { background: rgba(94, 234, 212, 0.22); color: #5eead4; }

.chat-message .bubble {
  flex: 1;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.chat-input {
  display: flex;
  gap: 0.75rem;
}

.chat-input input {
  flex: 1;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  color: var(--text);
}

.chat-input button {
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #0f172a;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-input button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.35);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 720px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-card {
    padding: 2rem;
  }
}

.light-mode body {
  background: #f8fafc;
  color: #0f172a;
}
</style>

<main>
  <section class="dashboard-card">
    <h1>Strategic Projects Portfolio Command Center</h1>
    <p class="lead">Real-time visibility across the enterprise roadmap with predictive risk intelligence and an analyst-in-the-loop AI copilot.</p>
    <p class="lead">Last portfolio refresh: <span id="portfolio-refresh">&mdash;</span></p>
  </section>

  <section class="section-card">
    <div class="section-header">
      <h2>Portfolio pulse</h2>
      <span id="portfolio-summary-subtitle">&nbsp;</span>
    </div>
    <div class="summary-grid" id="summary-grid"></div>
  </section>

  <section class="section-card">
    <div class="section-header">
      <h2>Performance intelligence</h2>
      <span>Portfolio-wide trends generated from the project telemetry feed.</span>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Status distribution</h3>
        <canvas id="statusChart" height="220"></canvas>
      </div>
      <div class="chart-card">
        <h3>Budget vs. forecast ($M)</h3>
        <canvas id="budgetChart" height="220"></canvas>
      </div>
      <div class="chart-card">
        <h3>Delivery velocity forecast</h3>
        <canvas id="velocityChart" height="220"></canvas>
      </div>
    </div>
  </section>

  <section class="section-card">
    <div class="section-header">
      <h2>Predictive risk & trend alerts</h2>
      <span>Combines schedule variance, spend trajectory, and qualitative risk indicators.</span>
    </div>
    <div class="alerts-grid">
      <article class="alert-card">
        <h3>Portfolio alerts</h3>
        <ul id="portfolio-alerts"></ul>
      </article>
      <article class="alert-card">
        <h3>High-attention projects</h3>
        <ul id="high-attention"></ul>
      </article>
      <article class="alert-card">
        <h3>Upcoming milestones</h3>
        <ul id="upcoming-milestones"></ul>
      </article>
    </div>
  </section>

  <section class="section-card">
    <div class="section-header">
      <h2>Portfolio explorer</h2>
      <span>Filter, search, and drill into projects. Click a row for more detail.</span>
    </div>
    <div class="filter-bar">
      <input type="search" id="searchInput" placeholder="Search by name, ID, sponsor, manager…" aria-label="Search projects">
      <select id="statusFilter" aria-label="Filter by status">
        <option value="">All statuses</option>
      </select>
      <select id="riskFilter" aria-label="Filter by risk level">
        <option value="">All risk levels</option>
      </select>
      <select id="categoryFilter" aria-label="Filter by category">
        <option value="">All categories</option>
      </select>
    </div>
    <div class="table-wrapper">
      <table class="projects-table" id="projectsTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Project</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Progress</th>
            <th>Budget</th>
            <th>Forecast variance</th>
            <th>Manager</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div class="detail-panel" id="detailPanel" hidden>
      <h3 id="detailTitle"></h3>
      <p id="detailDescription"></p>
      <div class="detail-meta" id="detailMeta"></div>
      <div>
        <strong>Progress</strong>
        <div class="progress-bar"><span id="detailProgress"></span></div>
      </div>
      <div id="detailLists"></div>
    </div>
  </section>

  <section class="section-card chat-card">
    <div class="section-header">
      <h2>AI project analyst</h2>
      <span>The embedded copilot understands your portfolio data and surfaces actionable guidance.</span>
    </div>
    <div class="chat-log" id="chatLog" aria-live="polite"></div>
    <form class="chat-input" id="chatForm">
      <label class="sr-only" for="chatInput">Ask the portfolio analyst</label>
      <input id="chatInput" type="text" placeholder="Ask about a project, risk, or trend…" autocomplete="off" required>
      <button type="submit">Send</button>
    </form>
  </section>
</main>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" integrity="sha384-KGhT3YJd9NDr5OCxzLUa4FYlUDed4t9k6y6p4XiX7yCSfYEHX/OkPgHsNFFjaNO7" crossorigin="anonymous"></script>
<script>
const projects = [
  {
    id: 'PRJ-001',
    name: 'Digital Transformation Platform',
    manager: 'Ariana Patel',
    sponsor: 'Global Operations',
    status: 'On Track',
    health: 82,
    riskLevel: 'Medium',
    progress: 68,
    budget: 1200000,
    actualCost: 840000,
    forecastCost: 1180000,
    startDate: '2023-01-09',
    endDate: '2024-11-30',
    lastUpdated: '2024-04-22',
    teamSize: 14,
    category: 'Technology',
    region: 'North America',
    risks: ['Integration dependencies with ERP rollout', 'Pending cybersecurity audit findings'],
    trend: { velocity: 1.05, confidence: 0.72, comment: 'Throughput trending 5% higher than baseline for three consecutive sprints.' },
    milestones: [
      { name: 'MVP launch', date: '2023-09-18', status: 'Complete' },
      { name: 'Enterprise pilot', date: '2024-03-15', status: 'Complete' },
      { name: 'Global rollout', date: '2024-10-01', status: 'At risk' }
    ],
    notes: 'Process re-engineering in APAC requires extra change enablement. Keep security review on radar.',
    strategicObjective: 'Improve operational efficiency by 18% through unified workflow platform.'
  },
  {
    id: 'PRJ-002',
    name: 'Customer 360 Personalization',
    manager: 'Miguel Chen',
    sponsor: 'Chief Marketing Officer',
    status: 'At Risk',
    health: 61,
    riskLevel: 'High',
    progress: 54,
    budget: 890000,
    actualCost: 620000,
    forecastCost: 1020000,
    startDate: '2023-05-01',
    endDate: '2024-08-12',
    lastUpdated: '2024-04-18',
    teamSize: 11,
    category: 'Customer Experience',
    region: 'Europe',
    risks: ['Data quality remediation impacting analytics timeline', 'Vendor contract renegotiation outstanding'],
    trend: { velocity: 0.92, confidence: 0.64, comment: 'Velocity dipped below plan due to dependency on master data cleanse workstream.' },
    milestones: [
      { name: 'Unified profile design', date: '2023-12-01', status: 'Complete' },
      { name: 'AI recommendation engine', date: '2024-05-20', status: 'At risk' },
      { name: 'Global launch', date: '2024-08-12', status: 'Upcoming' }
    ],
    notes: 'Steerco wants proactive mitigation for personalization backlog. Recommend shifting analytics engineers from PRJ-005 temporarily.',
    strategicObjective: 'Increase digital revenue per user by 12% with next-best-action experiences.'
  },
  {
    id: 'PRJ-003',
    name: 'Supply Chain Control Tower',
    manager: 'Jamal Edwards',
    sponsor: 'Chief Supply Chain Officer',
    status: 'On Track',
    health: 88,
    riskLevel: 'Low',
    progress: 74,
    budget: 1500000,
    actualCost: 980000,
    forecastCost: 1460000,
    startDate: '2022-11-14',
    endDate: '2024-07-30',
    lastUpdated: '2024-04-20',
    teamSize: 18,
    category: 'Operations',
    region: 'Global',
    risks: ['Awaiting IoT sensor firmware update from vendor'],
    trend: { velocity: 1.08, confidence: 0.81, comment: 'Automation squads exceeding throughput while defect rate remains low.' },
    milestones: [
      { name: 'Command center build', date: '2023-08-01', status: 'Complete' },
      { name: 'Predictive ETA engine', date: '2024-03-08', status: 'Complete' },
      { name: 'Autonomous planning pilot', date: '2024-07-30', status: 'Upcoming' }
    ],
    notes: 'Strong executive sponsorship; maintain momentum on change management for LATAM distribution hubs.',
    strategicObjective: 'Reduce working capital by 10% via predictive inventory and logistics orchestration.'
  },
  {
    id: 'PRJ-004',
    name: 'Workforce Skills Cloud',
    manager: 'Lina Kostova',
    sponsor: 'Chief Human Resources Officer',
    status: 'On Track',
    health: 76,
    riskLevel: 'Medium',
    progress: 63,
    budget: 640000,
    actualCost: 430000,
    forecastCost: 665000,
    startDate: '2023-03-06',
    endDate: '2024-12-19',
    lastUpdated: '2024-04-21',
    teamSize: 9,
    category: 'People & Culture',
    region: 'North America',
    risks: ['Adoption risk in manufacturing division'],
    trend: { velocity: 1.01, confidence: 0.69, comment: 'Maintaining steady burn; training content workstream catching up to plan.' },
    milestones: [
      { name: 'Skills taxonomy sign-off', date: '2023-11-15', status: 'Complete' },
      { name: 'Learning journeys beta', date: '2024-06-05', status: 'Upcoming' },
      { name: 'Global enablement', date: '2024-12-19', status: 'Upcoming' }
    ],
    notes: 'Change enablement kit drafted; coordinate with communications for next release cycle.',
    strategicObjective: 'Upskill 60% of workforce in strategic capabilities within 24 months.'
  },
  {
    id: 'PRJ-005',
    name: 'Sustainability Reporting Automation',
    manager: 'Priya Desai',
    sponsor: 'Chief Sustainability Officer',
    status: 'On Track',
    health: 83,
    riskLevel: 'Low',
    progress: 71,
    budget: 520000,
    actualCost: 355000,
    forecastCost: 508000,
    startDate: '2023-02-10',
    endDate: '2024-09-02',
    lastUpdated: '2024-04-16',
    teamSize: 7,
    category: 'Governance & Compliance',
    region: 'Global',
    risks: ['Awaiting clarity on EU CSRD data model update'],
    trend: { velocity: 1.12, confidence: 0.78, comment: 'RPA squad accelerating thanks to reusable components from phase one.' },
    milestones: [
      { name: 'Carbon data ingestion', date: '2023-10-11', status: 'Complete' },
      { name: 'Regulatory reporting pack', date: '2024-04-28', status: 'Upcoming' },
      { name: 'Global compliance launch', date: '2024-09-02', status: 'Upcoming' }
    ],
    notes: 'Expand training coverage for finance controllers; automation center ready to support.',
    strategicObjective: 'Automate 85% of ESG disclosure workflows across all markets.'
  },
  {
    id: 'PRJ-006',
    name: 'Next-Gen Commerce Infrastructure',
    manager: 'Diego Fernández',
    sponsor: 'Chief Digital Officer',
    status: 'Off Track',
    health: 48,
    riskLevel: 'High',
    progress: 46,
    budget: 2100000,
    actualCost: 1320000,
    forecastCost: 2350000,
    startDate: '2022-10-24',
    endDate: '2024-10-15',
    lastUpdated: '2024-04-19',
    teamSize: 21,
    category: 'Commerce',
    region: 'North America',
    risks: ['Legacy platform sunset pressure', 'Critical talent gaps in cloud architecture'],
    trend: { velocity: 0.84, confidence: 0.58, comment: 'Production incidents consumed capacity; velocity declining for third month.' },
    milestones: [
      { name: 'Core services refactor', date: '2023-07-30', status: 'Complete' },
      { name: 'Omnichannel API gateway', date: '2024-03-10', status: 'Delayed' },
      { name: 'Unified checkout', date: '2024-09-01', status: 'At risk' }
    ],
    notes: 'Escalate hiring support and evaluate partnering with PRJ-001 cloud engineers.',
    strategicObjective: 'Enable 25% YoY eCommerce growth via resilient microservices backbone.'
  }
];

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 });

function portfolioLastUpdated(data) {
  return data.reduce((latest, project) => {
    const date = new Date(project.lastUpdated);
    return date > latest ? date : latest;
  }, new Date('1970-01-01'));
}

function computeSummary(data) {
  const totalBudget = data.reduce((sum, project) => sum + project.budget, 0);
  const totalForecast = data.reduce((sum, project) => sum + project.forecastCost, 0);
  const avgHealth = Math.round(data.reduce((sum, project) => sum + project.health, 0) / data.length);
  const highRisk = data.filter(p => p.riskLevel === 'High').length;
  const onTrack = data.filter(p => p.status === 'On Track').length;
  const upcomingMilestones = data.flatMap(p => p.milestones)
    .filter(m => ['Upcoming', 'At risk'].includes(m.status));

  return {
    totalProjects: data.length,
    totalBudget,
    forecastVariance: totalForecast - totalBudget,
    avgHealth,
    highRisk,
    onTrack,
    upcomingMilestones
  };
}

function renderSummaryCards(summary) {
  const summaryGrid = document.getElementById('summary-grid');
  summaryGrid.innerHTML = '';

  const cards = [
    { label: 'Active projects', value: summary.totalProjects, helper: `${summary.onTrack} on track` },
    { label: 'Portfolio budget', value: currencyFormatter.format(summary.totalBudget), helper: `Forecast variance ${currencyFormatter.format(summary.forecastVariance)}` },
    { label: 'Average health score', value: `${summary.avgHealth}/100`, helper: summary.avgHealth >= 75 ? 'Healthy trajectory' : 'Needs attention' },
    { label: 'High-risk workstreams', value: summary.highRisk, helper: `${summary.upcomingMilestones.length} milestones approaching` }
  ];

  for (const card of cards) {
    const div = document.createElement('div');
    div.className = 'summary-item';
    div.innerHTML = `
      <h3>${card.label}</h3>
      <div class="value">${card.value}</div>
      <p style="color: var(--text-muted); margin: 0.35rem 0 0;">${card.helper}</p>
    `;
    summaryGrid.appendChild(div);
  }

  const subtitle = document.getElementById('portfolio-summary-subtitle');
  subtitle.textContent = `Forecast variance is ${summary.forecastVariance >= 0 ? 'over' : 'under'} budget by ${currencyFormatter.format(Math.abs(summary.forecastVariance))}.`;
}

function populateFilters(data) {
  const statusFilter = document.getElementById('statusFilter');
  const riskFilter = document.getElementById('riskFilter');
  const categoryFilter = document.getElementById('categoryFilter');

  const statuses = Array.from(new Set(data.map(project => project.status)));
  const risks = Array.from(new Set(data.map(project => project.riskLevel)));
  const categories = Array.from(new Set(data.map(project => project.category)));

  for (const value of statuses) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    statusFilter.appendChild(option);
  }

  for (const value of risks) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${value} risk`;
    riskFilter.appendChild(option);
  }

  for (const value of categories) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    categoryFilter.appendChild(option);
  }
}

function renderTable(data) {
  const tbody = document.querySelector('#projectsTable tbody');
  tbody.innerHTML = '';

  data.forEach(project => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${project.id}</td>
      <td>${project.name}</td>
      <td><span class="badge ${project.status.toLowerCase().replace(' ', '-')}" aria-label="${project.status}">${project.status}</span></td>
      <td><span class="badge ${project.riskLevel.toLowerCase()}" aria-label="${project.riskLevel} risk">${project.riskLevel}</span></td>
      <td>${project.progress}%</td>
      <td>${currencyFormatter.format(project.budget)}</td>
      <td>${currencyFormatter.format(project.forecastCost - project.budget)}</td>
      <td>${project.manager}</td>
    `;
    tr.addEventListener('click', () => showDetails(project));
    tbody.appendChild(tr);
  });
}

function showDetails(project) {
  const panel = document.getElementById('detailPanel');
  panel.hidden = false;
  document.getElementById('detailTitle').textContent = `${project.name} (${project.id})`;
  document.getElementById('detailDescription').textContent = project.strategicObjective;

  const meta = document.getElementById('detailMeta');
  meta.innerHTML = `
    <div><strong>Manager</strong><br>${project.manager}</div>
    <div><strong>Sponsor</strong><br>${project.sponsor}</div>
    <div><strong>Timeline</strong><br>${formatDate(project.startDate)} – ${formatDate(project.endDate)}</div>
    <div><strong>Team size</strong><br>${project.teamSize}</div>
    <div><strong>Region</strong><br>${project.region}</div>
    <div><strong>Budget</strong><br>${currencyFormatter.format(project.budget)} (forecast ${currencyFormatter.format(project.forecastCost)})</div>
  `;

  const progress = document.getElementById('detailProgress');
  progress.style.width = `${project.progress}%`;
  progress.setAttribute('aria-valuenow', project.progress);

  const lists = document.getElementById('detailLists');
  lists.innerHTML = `
    <div style="margin-top: 1rem;">
      <strong>Active risks</strong>
      <ul>${project.risks.map(r => `<li>${r}</li>`).join('')}</ul>
    </div>
    <div style="margin-top: 1rem;">
      <strong>Milestones</strong>
      <ul>${project.milestones.map(m => `<li>${m.name} &mdash; ${formatDate(m.date)} (${m.status})</li>`).join('')}</ul>
    </div>
    <div style="margin-top: 1rem; color: var(--text-muted);">
      <strong>Notes</strong>
      <p>${project.notes}</p>
    </div>
  `;
}

function filterData() {
  const term = document.getElementById('searchInput').value.trim().toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const risk = document.getElementById('riskFilter').value;
  const category = document.getElementById('categoryFilter').value;

  const filtered = projects.filter(project => {
    const matchesTerm = term
      ? [project.name, project.id, project.manager, project.sponsor, project.category, project.region]
          .some(value => value.toLowerCase().includes(term))
      : true;

    const matchesStatus = status ? project.status === status : true;
    const matchesRisk = risk ? project.riskLevel === risk : true;
    const matchesCategory = category ? project.category === category : true;

    return matchesTerm && matchesStatus && matchesRisk && matchesCategory;
  });

  renderTable(filtered);
}

function formatDate(dateString) {
  return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildCharts(data) {
  const statusCtx = document.getElementById('statusChart');
  const budgetCtx = document.getElementById('budgetChart');
  const velocityCtx = document.getElementById('velocityChart');

  const statusCounts = data.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#22c55e', '#fbbf24', '#f87171'],
        borderWidth: 0,
        hoverOffset: 12
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom', labels: { color: '#cbd5f5' } }
      }
    }
  });

  new Chart(budgetCtx, {
    type: 'bar',
    data: {
      labels: data.map(p => p.id),
      datasets: [
        {
          label: 'Budget',
          data: data.map(p => (p.budget / 1_000_000).toFixed(2)),
          backgroundColor: 'rgba(56, 189, 248, 0.65)'
        },
        {
          label: 'Forecast',
          data: data.map(p => (p.forecastCost / 1_000_000).toFixed(2)),
          backgroundColor: 'rgba(14, 165, 233, 0.35)'
        }
      ]
    },
    options: {
      plugins: { legend: { position: 'bottom', labels: { color: '#cbd5f5' } } },
      scales: {
        x: { ticks: { color: '#cbd5f5' }, grid: { display: false } },
        y: { ticks: { color: '#cbd5f5' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
      }
    }
  });

  const velocityDataset = data.map(project => ({
    x: project.progress,
    y: Math.round(project.trend.velocity * 100),
    label: project.id,
    backgroundColor: project.riskLevel === 'High' ? 'rgba(248, 113, 113, 0.8)' : project.riskLevel === 'Medium' ? 'rgba(251, 191, 36, 0.85)' : 'rgba(34, 197, 94, 0.8)',
    radius: 8 + (project.teamSize / 4)
  }));

  new Chart(velocityCtx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Velocity vs progress',
        data: velocityDataset,
        parsing: false,
        pointHoverRadius: 12
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Progress (%)', color: '#cbd5f5' }, ticks: { color: '#cbd5f5' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
        y: { title: { display: true, text: 'Velocity index', color: '#cbd5f5' }, ticks: { color: '#cbd5f5' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => `${context.raw.label}: velocity ${context.raw.y}%`
          }
        },
        legend: { display: false }
      }
    }
  });
}

function computeRiskScore(project) {
  const now = new Date(project.lastUpdated);
  const start = new Date(project.startDate);
  const end = new Date(project.endDate);
  const totalDays = (end - start) / (1000 * 60 * 60 * 24);
  const elapsedDays = Math.max((now - start) / (1000 * 60 * 60 * 24), 1);
  const expectedProgress = Math.min(100, (elapsedDays / totalDays) * 100);
  const scheduleVariance = expectedProgress - project.progress;
  const spendRatio = project.actualCost / project.budget;
  const expectedSpendRatio = Math.min(1, elapsedDays / totalDays);
  const spendVariance = spendRatio - expectedSpendRatio;

  const riskWeight = project.riskLevel === 'High' ? 28 : project.riskLevel === 'Medium' ? 18 : 8;
  const scheduleWeight = Math.max(0, scheduleVariance) * 0.45;
  const costWeight = Math.max(0, spendVariance * 100) * 0.35;
  const healthPenalty = Math.max(0, (70 - project.health)) * 0.25;

  return Math.min(100, Math.round(riskWeight + scheduleWeight + costWeight + healthPenalty));
}

function buildRiskAlerts(data) {
  const alerts = document.getElementById('portfolio-alerts');
  alerts.innerHTML = '';

  const overallForecast = data.reduce((sum, project) => sum + (project.forecastCost - project.budget), 0);
  const highRiskProjects = data.filter(project => computeRiskScore(project) >= 65);
  const improvingVelocity = data.filter(project => project.trend.velocity > 1);

  const statements = [
    `Portfolio forecast variance is ${currencyFormatter.format(overallForecast)} ${overallForecast > 0 ? 'over' : 'under'} the original budget baseline.`,
    `${highRiskProjects.length} project${highRiskProjects.length !== 1 ? 's are' : ' is'} triggering high risk thresholds.`,
    `${improvingVelocity.length} delivery pod${improvingVelocity.length !== 1 ? 's are' : ' is'} trending above baseline velocity.`
  ];

  statements.forEach(statement => {
    const li = document.createElement('li');
    li.textContent = statement;
    alerts.appendChild(li);
  });

  const highAttention = document.getElementById('high-attention');
  highAttention.innerHTML = '';

  highRiskProjects.sort((a, b) => computeRiskScore(b) - computeRiskScore(a)).slice(0, 3).forEach(project => {
    const { predictedEnd, varianceDays } = predictCompletion(project);
    const li = document.createElement('li');
    li.innerHTML = `<strong>${project.name}</strong>: risk score ${computeRiskScore(project)} / 100. Forecast completion ${formatDate(predictedEnd.toISOString().slice(0,10))} (${varianceDays >= 0 ? '+' : ''}${varianceDays} days vs plan).`;
    highAttention.appendChild(li);
  });

  const milestoneList = document.getElementById('upcoming-milestones');
  milestoneList.innerHTML = '';
  const upcoming = data.flatMap(project => project.milestones.map(m => ({ ...m, project: project.name })))
    .filter(m => ['Upcoming', 'At risk'].includes(m.status));

  upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
  upcoming.slice(0, 5).forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.project}</strong>: ${item.name} on ${formatDate(item.date)} (${item.status}).`;
    milestoneList.appendChild(li);
  });
}

function predictCompletion(project) {
  const now = new Date(project.lastUpdated);
  const start = new Date(project.startDate);
  const plannedFinish = new Date(project.endDate);
  const elapsedDays = Math.max((now - start) / (1000 * 60 * 60 * 24), 1);
  const progressRate = project.progress / elapsedDays;
  const remainingProgress = 100 - project.progress;
  const remainingDays = remainingProgress / Math.max(progressRate, 0.01);
  const predictedEnd = new Date(now.getTime() + remainingDays * 24 * 60 * 60 * 1000);
  const varianceDays = Math.round((predictedEnd - plannedFinish) / (1000 * 60 * 60 * 24));
  return { predictedEnd, varianceDays };
}

function initChat(data) {
  const chatLog = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  function addMessage(role, text) {
    const message = document.createElement('div');
    message.className = `chat-message ${role}`;
    message.innerHTML = `
      <div class="avatar">${role === 'user' ? 'You' : 'AI'}</div>
      <div class="bubble">${text}</div>
    `;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function buildResponse(prompt) {
    const normalized = prompt.toLowerCase();

    if (normalized.includes('high risk')) {
      const risky = data.filter(project => project.riskLevel === 'High' || computeRiskScore(project) >= 65);
      if (risky.length === 0) {
        return 'No projects are triggering the high-risk threshold right now.';
      }
      return `High-risk focus: ${risky.map(project => `${project.name} (${project.id}) is ${project.status.toLowerCase()} with a predicted completion variance of ${predictCompletion(project).varianceDays} days.`).join(' ')}`;
    }

    const projectMatch = data.find(project => normalized.includes(project.id.toLowerCase()) || normalized.includes(project.name.toLowerCase()));
    if (projectMatch) {
      const { predictedEnd, varianceDays } = predictCompletion(projectMatch);
      return `${projectMatch.name} is currently ${projectMatch.status.toLowerCase()} at ${projectMatch.progress}% progress. Forecast cost is ${currencyFormatter.format(projectMatch.forecastCost)} and predicted completion is ${formatDate(predictedEnd.toISOString().slice(0,10))} (${varianceDays >= 0 ? '+' : ''}${varianceDays} days vs plan). Key risks: ${projectMatch.risks.join('; ')}.`;
    }

    if (normalized.includes('budget') || normalized.includes('spend')) {
      const spend = data.reduce((acc, project) => acc + project.actualCost, 0);
      return `Portfolio spend-to-date is ${currencyFormatter.format(spend)} against a budget baseline of ${currencyFormatter.format(data.reduce((acc, project) => acc + project.budget, 0))}.`;
    }

    if (normalized.includes('milestone')) {
      const nextMilestone = data.flatMap(project => project.milestones.map(m => ({ ...m, project })))
        .filter(item => ['Upcoming', 'At risk'].includes(item.status))
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
      if (nextMilestone) {
        return `Next milestone: ${nextMilestone.name} for ${nextMilestone.project.name} on ${formatDate(nextMilestone.date)} (${nextMilestone.status}).`;
      }
    }

    const avgHealth = Math.round(data.reduce((sum, project) => sum + project.health, 0) / data.length);
    return `Portfolio health is averaging ${avgHealth}/100 with ${data.filter(project => project.status === 'On Track').length} projects on track. Ask about a specific project, risk exposure, or budget to dive deeper.`;
  }

  addMessage('ai', 'Hi, I\'m the portfolio analyst. Ask me about project status, risks, budget exposure, or upcoming milestones.');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    const response = buildResponse(text);
    addMessage('ai', response);
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const latest = portfolioLastUpdated(projects);
  document.getElementById('portfolio-refresh').textContent = latest.toLocaleString();

  const summary = computeSummary(projects);
  renderSummaryCards(summary);
  populateFilters(projects);
  renderTable(projects);
  buildCharts(projects);
  buildRiskAlerts(projects);
  initChat(projects);

  document.getElementById('searchInput').addEventListener('input', filterData);
  document.getElementById('statusFilter').addEventListener('change', filterData);
  document.getElementById('riskFilter').addEventListener('change', filterData);
  document.getElementById('categoryFilter').addEventListener('change', filterData);
});
</script>