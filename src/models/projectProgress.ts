export interface ProjectProgressProject {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectProgressLink {
  text: string;
  url: string;
}

export interface ProjectProgressEntry {
  notes: string[];
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
