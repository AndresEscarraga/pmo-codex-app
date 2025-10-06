import React, { useMemo, useState } from 'react';
import { registry } from './plugins';
import { useProjects } from './project-context';
import '../modules/gantt-cpm';
import '../modules/schedule-montecarlo';
import '../modules/raid-board';
import '../modules/scope-diff';
import '../modules/dependency-graph';

const App: React.FC = () => {
  const { projects, currentProjectId, setCurrentProjectId, createProject, deleteProject, clearData } = useProjects();
  const [moduleFilter, setModuleFilter] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(() => registry[0]?.id ?? '');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const [status, setStatus] = useState<string | null>(null);

  const activeModule = registry.find(module => module.id === activeModuleId) ?? registry[0];
  const filteredModules = useMemo(() => {
    const text = moduleFilter.toLowerCase();
    return registry.filter(module => module.title.toLowerCase().includes(text));
  }, [moduleFilter]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === 'light') {
      document.documentElement.style.setProperty('--app-bg', '#f8fafc');
      document.documentElement.style.setProperty('--app-fg', '#0f172a');
    } else {
      document.documentElement.style.setProperty('--app-bg', '#0f172a');
      document.documentElement.style.setProperty('--app-fg', '#e2e8f0');
    }
  }, [theme]);

  const handleImport = (importerId: string) => {
    const importer = activeModule?.importers.find(i => i.id === importerId);
    if (!importer || !currentProjectId) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = importer.accept.join(',');
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await importer.run(file, currentProjectId);
        setStatus('Importación completada');
      } catch (error) {
        setStatus((error as Error).message);
      }
    };
    input.click();
  };

  const handleExport = async (exporterId: string) => {
    const exporter = activeModule?.exporters.find(e => e.id === exporterId);
    if (!exporter || !currentProjectId) return;
    try {
      await exporter.run(currentProjectId);
      setStatus('Exportación lista');
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const handleSample = async () => {
    if (!activeModule?.loadSample || !currentProjectId) return;
    await activeModule.loadSample(currentProjectId);
    setStatus('Datos de muestra listos');
  };

  const handleDeleteProject = async (id: string) => {
    if (projects.length <= 1) {
      alert('Necesitas al menos un proyecto.');
      return;
    }
    if (confirm('¿Eliminar proyecto y datos asociados?')) {
      await deleteProject(id);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh', background: 'var(--app-bg)', color: 'var(--app-fg)' }}>
      <aside style={{ borderRight: '1px solid rgba(148,163,184,0.3)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>PM Lab</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>Suite todo-en-uno para PM/PMO</p>
        </div>
        <input
          type="search"
          placeholder="Buscar módulos"
          value={moduleFilter}
          onChange={event => setModuleFilter(event.target.value)}
          style={{ padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(148,163,184,0.5)', background: 'transparent', color: 'inherit' }}
        />
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
            {filteredModules.map(module => (
              <li key={module.id}>
                <button
                  onClick={() => setActiveModuleId(module.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: module.id === activeModule?.id ? 'rgba(56,189,248,0.2)' : 'transparent',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>{module.icon ?? '•'}</span>
                  <span>{module.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ flex: 1 }}>
            Tema: {theme === 'light' ? '🌞' : '🌙'}
          </button>
          <button onClick={() => clearData()} style={{ flex: 1 }}>
            Borrar datos
          </button>
        </div>
      </aside>
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(148,163,184,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label>
              Proyecto
              <select
                value={currentProjectId ?? ''}
                onChange={event => setCurrentProjectId(event.target.value)}
                style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '0.5rem' }}
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={async () => {
                const name = prompt('Nombre del nuevo proyecto');
                if (name) await createProject(name);
              }}
            >
              Nuevo proyecto
            </button>
            {currentProjectId && (
              <button onClick={() => handleDeleteProject(currentProjectId)}>Eliminar proyecto</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {activeModule?.importers.map(importer => (
              <button key={importer.id} onClick={() => handleImport(importer.id)}>
                {importer.label}
              </button>
            ))}
            {activeModule?.loadSample && (
              <button onClick={handleSample}>Try sample</button>
            )}
            {activeModule?.exporters.map(exporter => (
              <button key={exporter.id} onClick={() => handleExport(exporter.id)}>
                {exporter.label}
              </button>
            ))}
          </div>
        </header>
        {status && (
          <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(34,197,94,0.15)', color: 'inherit' }}>
            {status}
          </div>
        )}
        <section style={{ flex: 1, overflowY: 'auto' }}>{activeModule && <activeModule.view />}</section>
      </main>
    </div>
  );
};

export default App;
