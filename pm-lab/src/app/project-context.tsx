import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { db, Project } from '../core/db';

interface ProjectContextValue {
  projects: Project[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
  createProject: (name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

async function ensureSeed(setProjects: (projects: Project[]) => void, setCurrentProjectId: (id: string) => void) {
  const all = await db.projects.toArray();
  if (!all.length) {
    const id = crypto.randomUUID();
    await db.projects.add({ id, name: 'Proyecto demo' });
    setProjects([{ id, name: 'Proyecto demo' }]);
    setCurrentProjectId(id);
  } else {
    setProjects(all);
    setCurrentProjectId(all[0].id);
  }
}

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    ensureSeed(setProjects, id => setCurrentProjectId(id));
  }, []);

  const reload = async () => {
    const all = await db.projects.toArray();
    setProjects(all);
    if (all.length && !all.find(p => p.id === currentProjectId)) {
      setCurrentProjectId(all[0].id);
    }
  };

  const value = useMemo<ProjectContextValue>(() => ({
    projects,
    currentProjectId,
    setCurrentProjectId,
    createProject: async (name: string) => {
      const id = crypto.randomUUID();
      await db.projects.add({ id, name });
      await reload();
      setCurrentProjectId(id);
    },
    deleteProject: async (id: string) => {
      await db.projects.delete(id);
      await db.tasks.where('projectId').equals(id).delete();
      await db.risks.where('projectId').equals(id).delete();
      await reload();
    },
    clearData: async () => {
      await db.delete();
      await db.open();
      await ensureSeed(setProjects, id => setCurrentProjectId(id));
    }
  }), [projects, currentProjectId]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error('useProjects debe usarse dentro de ProjectProvider');
  }
  return ctx;
};
