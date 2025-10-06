import Dexie, { Table } from 'dexie';

export interface Project {
  id: string;
  name: string;
  timezone?: string;
  currency?: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  duration?: number;
  start?: string;
  due?: string;
  dependsOn: string[];
  assignee?: string;
  status?: string;
  labels?: string[];
  estimate?: number;
  distribution?: string;
  milestone?: boolean;
}

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  prob: number;
  impact: number;
  owner?: string;
  due?: string;
  notes?: string;
}

export class PMLabDB extends Dexie {
  projects!: Table<Project, string>;
  tasks!: Table<Task, string>;
  risks!: Table<Risk, string>;

  constructor() {
    super('pm-lab');
    this.version(1).stores({
      projects: 'id',
      tasks: 'id, projectId',
      risks: 'id, projectId'
    });
  }
}

export const db = new PMLabDB();
