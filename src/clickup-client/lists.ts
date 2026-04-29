import { ClickUpClient } from './index.js';

export interface List {
  id: string;
  name: string;
  // ...other list properties...
}

export interface GetListsParams {
  // ...parameters for getting lists...
}

export interface CreateListParams {
  name: string;
  // ...other parameters for creating a list...
}

export interface UpdateListParams {
  name?: string;
  content?: string;
  // ...other parameters for updating a list...
}

export class ListsClient {
  private client: ClickUpClient;

  constructor(client: ClickUpClient) {
    this.client = client;
  }

  /**
   * Get lists from a specific space
   * @param spaceId The ID of the space to get lists from
   * @param params Optional parameters for filtering lists
   * @returns A list of lists
   */
  async getListsFromSpace(spaceId: string, params?: GetListsParams): Promise<{ lists: List[] }> {
    return this.client.get(`/space/${spaceId}/list`, params);
  }

  /**
   * Get lists from a specific folder
   * @param folderId The ID of the folder to get lists from
   * @param params Optional parameters for filtering lists
   * @returns A list of lists
   */
  async getListsFromFolder(folderId: string, params?: GetListsParams): Promise<{ lists: List[] }> {
    return this.client.get(`/folder/${folderId}/list`, params);
  }

  /**
   * Create a new list in a folder
   * @param folderId The ID of the folder to create the list in
   * @param params The list parameters
   * @returns The created list
   */
  async createListInFolder(folderId: string, params: CreateListParams): Promise<List> {
    return this.client.post(`/folder/${folderId}/list`, params);
  }

  /**
   * Create a new folderless list in a space
   * @param spaceId The ID of the space to create the list in
   * @param params The list parameters
   * @returns The created list
   */
  async createFolderlessList(spaceId: string, params: CreateListParams): Promise<List> {
    return this.client.post(`/space/${spaceId}/list`, params);
  }

  /**
   * Get a specific list by ID
   * @param listId The ID of the list to get
   * @returns The list details
   */
  async getList(listId: string): Promise<List> {
    return this.client.get(`/list/${listId}`);
  }

  /**
   * Update an existing list
   * @param listId The ID of the list to update
   * @param params The list parameters to update
   * @returns The updated list
   */
  async updateList(listId: string, params: UpdateListParams): Promise<List> {
    return this.client.put(`/list/${listId}`, params);
  }

  /**
   * Delete a list
   * @param listId The ID of the list to delete
   * @returns Success message
   */
  async deleteList(listId: string): Promise<{ success: boolean }> {
    return this.client.delete(`/list/${listId}`);
  }

  /**
   * Add a task to a list
   * @param listId The ID of the list to add the task to
   * @param taskId The ID of the task to add
   * @returns Success message
   */
  async addTaskToList(listId: string, taskId: string): Promise<{ success: boolean }> {
    return this.client.post(`/list/${listId}/task/${taskId}`);
  }

  /**
   * Remove a task from a list
   * @param listId The ID of the list to remove the task from
   * @param taskId The ID of the task to remove
   * @returns Success message
   */
  async removeTaskFromList(listId: string, taskId: string): Promise<{ success: boolean }> {
    return this.client.delete(`/list/${listId}/task/${taskId}`);
  }

  /**
   * Create a new list from a template in a folder
   * @param folderId The ID of the folder to create the list in
   * @param templateId The ID of the template to use
   * @param params The list parameters
   * @returns The created list
   */
  async createListFromTemplateInFolder(folderId: string, templateId: string, params: CreateListParams): Promise<List> {
    return this.client.post(`/folder/${folderId}/list/template/${templateId}`, params);
  }

  /**
   * Create a new list from a template in a space
   * @param spaceId The ID of the space to create the list in
   * @param templateId The ID of the template to use
   * @param params The list parameters
   * @returns The created list
   */
  async createListFromTemplateInSpace(spaceId: string, templateId: string, params: CreateListParams): Promise<List> {
    return this.client.post(`/space/${spaceId}/list/template/${templateId}`, params);
  }
}

export const createListsClient = (client: ClickUpClient): ListsClient => {
  return new ListsClient(client);
};