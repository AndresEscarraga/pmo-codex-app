import type React from 'react';
import type { Project } from '../core/db';

export type ProjectPartial = Partial<Project> & { name: string };

export type Importer = {
  id: string;
  label: string;
  accept: string[];
  run: (file: File, projectId: string) => Promise<void>;
};

export type Exporter = {
  id: string;
  label: string;
  run: (projectId: string) => Promise<void>;
};

export interface ModulePlugin {
  id: string;
  title: string;
  route: string;
  icon?: string;
  importers: Importer[];
  exporters: Exporter[];
  view: React.ComponentType;
  loadSample?: (projectId: string) => Promise<void>;
}

export const registry: ModulePlugin[] = [];
