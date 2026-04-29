import { ClickUpClient } from './index.js';

// Space interface based on ClickUp API response
export interface Space {
  id: string;
  name: string;
  private: boolean;
  statuses: any[];
  multiple_assignees: boolean;
  features: {
    due_dates: {
      enabled: boolean;
      start_date: boolean;
      remap_due_dates: boolean;
      remap_closed_due_date: boolean;
    };
    time_tracking: {
      enabled: boolean;
    };
    tags: {
      enabled: boolean;
    };
    time_estimates: {
      enabled: boolean;
    };
    checklists: {
      enabled: boolean;
    };
    custom_fields: {
      enabled: boolean;
    };
    remap_dependencies: {
      enabled: boolean;
    };
    dependency_warning: {
      enabled: boolean;
    };
    portfolios: {
      enabled: boolean;
    };
  };
  archived: boolean;
}

export class SpacesClient {
  private client: ClickUpClient;

  constructor(client: ClickUpClient) {
    this.client = client;
  }

  /**
   * Get spaces from a specific workspace
   * @param workspaceId The ID of the workspace to get spaces from
   * @returns A list of spaces
   */
  async getSpacesFromWorkspace(workspaceId: string): Promise<Space[]> {
    // Use the v2 API endpoint for spaces
    const response = await this.client.get(`/team/${workspaceId}/space`);
    return response.spaces;
  }

  /**
   * Get a specific space by ID
   * @param spaceId The ID of the space to get
   * @returns The space details
   */
  async getSpace(spaceId: string): Promise<Space> {
    const response = await this.client.get(`/space/${spaceId}`);
    return response;
  }

  /**
   * Update an existing space (name, multiple_assignees, features/ClickApps).
   * GOTCHA: ClickUp's PUT /space/{id} endpoint NULLifies fields that are
   * absent from the body. Always include `name` when updating other fields,
   * otherwise the space will be renamed to null.
   * @param spaceId The ID of the space to update
   * @param params Update payload — must include name to avoid NULLification
   * @returns The updated space
   */
  async updateSpace(spaceId: string, params: UpdateSpaceParams): Promise<Space> {
    return this.client.put(`/space/${spaceId}`, params);
  }

  /**
   * Create a new space in a workspace.
   * @param workspaceId The ID of the workspace (team)
   * @param params Create payload — name is required
   * @returns The created space
   */
  async createSpace(workspaceId: string, params: CreateSpaceParams): Promise<Space> {
    return this.client.post(`/team/${workspaceId}/space`, params);
  }

  /**
   * Delete a space.
   * @param spaceId The ID of the space to delete
   */
  async deleteSpace(spaceId: string): Promise<void> {
    await this.client.delete(`/space/${spaceId}`);
  }
}

export interface CreateSpaceParams {
  name: string;
  multiple_assignees?: boolean;
  features?: UpdateSpaceParams['features'];
}

export interface UpdateSpaceParams {
  name: string; // required to avoid NULLification — see updateSpace doc
  private?: boolean;
  multiple_assignees?: boolean;
  features?: {
    due_dates?: { enabled?: boolean; start_date?: boolean; remap_due_dates?: boolean; remap_closed_due_date?: boolean };
    time_tracking?: { enabled?: boolean };
    tags?: { enabled?: boolean };
    time_estimates?: { enabled?: boolean };
    checklists?: { enabled?: boolean };
    custom_fields?: { enabled?: boolean };
    remap_dependencies?: { enabled?: boolean };
    dependency_warning?: { enabled?: boolean };
    portfolios?: { enabled?: boolean };
    sprints?: { enabled?: boolean };
    points?: { enabled?: boolean };
    custom_items?: { enabled?: boolean };
    priorities?: { enabled?: boolean; priorities?: any[] };
    milestones?: { enabled?: boolean };
    zoom?: { enabled?: boolean };
  };
}

export const createSpacesClient = (client: ClickUpClient): SpacesClient => {
  return new SpacesClient(client);
};
