export interface ProjectCurriculumItem {
  id: string;
  title: string;
  description: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  type: string;
  difficulty: number;
  summary: string;
  concepts: ProjectCurriculumItem[];
  tools: ProjectCurriculumItem[];
  practice: ProjectCurriculumItem[];
  masteryChecks: string[];
  prerequisites: string[];
}

export interface ProjectCapstone {
  id: string;
  title: string;
  difficulty: number;
  summary: string;
  build: string[];
  concepts: ProjectCurriculumItem[];
  tools: ProjectCurriculumItem[];
  prerequisites: string[];
}

export interface ProjectProgressProject {
  _id: string;
  title: string;
  description: string;
  legend: Record<string, Record<string, string>>;
  phases: ProjectPhase[];
  capstones: ProjectCapstone[];
  recommendedOrder: string[];
  masteryDefinitions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProgressLink {
  text: string;
  url: string;
}

export interface ProjectProgressNote {
  text: string;
  timestamp: string;
}

export interface ProjectProgressEntry {
  notes: ProjectProgressNote[];
  links: ProjectProgressLink[];
}

export interface ProjectProgress {
  _id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string;
  progress: number;
  notes: Record<string, ProjectProgressEntry>;
  createdAt: string;
  updatedAt: string;
  project?: ProjectProgressProject;
}

export interface ProjectProgressListResponse {
  projectProgresses: ProjectProgress[];
}

export interface ProjectProgressResponse {
  projectProgress: ProjectProgress;
}
