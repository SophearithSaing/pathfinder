import { apiFetch, RequestMethod } from './client';
import type {
  ProjectProgressListResponse,
  ProjectProgressResponse,
} from '../models/projectProgress';

/**
 * Gets project progress records for the authenticated user.
 *
 * @returns Project progress list response.
 */
export async function getProjectProgress(): Promise<ProjectProgressListResponse> {
  return await apiFetch<ProjectProgressListResponse>('/projects/progress', {
    method: RequestMethod.Get,
  });
}

/**
 * Gets one project progress record by id for the authenticated user.
 *
 * @param progressId Project progress id.
 * @returns Project progress response.
 */
export async function getProjectProgressById(progressId: string): Promise<ProjectProgressResponse> {
  return await apiFetch<ProjectProgressResponse>(`/projects/progress/${progressId}`, {
    method: RequestMethod.Get,
  });
}
