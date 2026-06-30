import { apiFetch, RequestMethod } from './client';
import type {
  CompletedItemsUpdateBody,
  ProjectProgressListResponse,
  ProjectProgressResponse,
  UpdateProjectProgressPayload,
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

/**
 * Updates progress state for a project progress record.
 *
 * @param progressId Project progress id.
 * @param body Updated project progress body.
 * @returns Updated project progress response.
 */
export async function updateProjectProgress(
  progressId: string,
  body: UpdateProjectProgressPayload,
): Promise<ProjectProgressResponse> {
  return await apiFetch<ProjectProgressResponse>(`/projects/progress/${progressId}`, {
    method: RequestMethod.Patch,
    body,
  });
}

/**
 * Updates completed item states for a project progress record.
 *
 * @param progressId Project progress id.
 * @param body Completed item state changes keyed by item id.
 * @returns Updated project progress response.
 */
export async function updateCompletedItems(
  progressId: string,
  body: CompletedItemsUpdateBody,
): Promise<ProjectProgressResponse> {
  return await apiFetch<ProjectProgressResponse>(
    `/projects/progress/${progressId}/completed-items`,
    {
      method: RequestMethod.Patch,
      body,
    },
  );
}
