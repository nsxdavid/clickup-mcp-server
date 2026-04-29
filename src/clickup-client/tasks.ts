import { ClickUpClient } from './index.js';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status?: {
    status: string;
    color: string;
  };
  date_created?: string;
  date_updated?: string;
  date_closed?: string;
  creator?: {
    id: number;
    username: string;
    email: string;
  };
  assignees?: Array<{
    id: number;
    username: string;
    email: string;
  }>;
  priority?: {
    id: string;
    priority: string;
    color: string;
  };
  due_date?: string | null;
  start_date?: string | null;
  time_estimate?: number | null;
  time_spent?: number | null;
  custom_fields?: Array<any>;
  list?: {
    id: string;
    name: string;
  };
  folder?: {
    id: string;
    name: string;
  };
  space?: {
    id: string;
    name: string;
  };
  url: string;
  subtasks?: Task[]; // Add subtasks property
  parent?: string; // Add parent property
  top_level_parent?: string; // Add top_level_parent property
}

export interface CreateTaskParams {
  name: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;
  links_to?: string;
  check_required_custom_fields?: boolean;
  custom_fields?: Array<{
    id: string;
    value: any;
  }>;
}

export interface UpdateTaskParams {
  name?: string;
  description?: string;
  assignees?: number[];
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;
  custom_fields?: Array<{
    id: string;
    value: any;
  }>;
}

export interface GetTasksParams {
  page?: number;
  order_by?: string;
  reverse?: boolean;
  subtasks?: boolean;
  statuses?: string[];
  include_closed?: boolean;
  assignees?: number[];
  due_date_gt?: number;
  due_date_lt?: number;
  date_created_gt?: number;
  date_created_lt?: number;
  date_updated_gt?: number;
  date_updated_lt?: number;
  custom_fields?: Array<{
    field_id: string;
    operator: string;
    value: any;
  }>;
}

export class TasksClient {
  private client: ClickUpClient;

  constructor(client: ClickUpClient) {
    this.client = client;
  }

  /**
   * Get tasks from a specific list
   * @param listId The ID of the list to get tasks from
   * @param params Optional parameters for filtering tasks
   * @returns A list of tasks
   */
  async getTasksFromList(listId: string, params?: GetTasksParams): Promise<{ tasks: Task[] }> {
    return this.client.get(`/list/${listId}/task`, params);
  }

  // Removed pseudo endpoints for getting tasks from spaces and folders

  /**
   * Get a specific task by ID
   * @param taskId The ID of the task to get
   * @param params Optional parameters (include_subtasks)
   * @returns The task details
   */
  async getTask(taskId: string, params?: { include_subtasks?: boolean }): Promise<Task> {
    return this.client.get(`/task/${taskId}`, params);
  }

  /**
   * Create a new task in a list
   * @param listId The ID of the list to create the task in
   * @param params The task parameters
   * @returns The created task
   */
  async createTask(listId: string, params: CreateTaskParams): Promise<Task> {
    return this.client.post(`/list/${listId}/task`, params);
  }

  /**
   * Update an existing task
   * @param taskId The ID of the task to update
   * @param params The task parameters to update
   * @returns The updated task
   */
  async updateTask(taskId: string, params: UpdateTaskParams): Promise<Task> {
    return this.client.put(`/task/${taskId}`, params);
  }

  /**
   * Delete a task
   * @param taskId The ID of the task to delete
   * @returns Success message
   */
  async deleteTask(taskId: string): Promise<{ success: boolean }> {
    return this.client.delete(`/task/${taskId}`);
  }

  /**
   * Set the value of a custom field on a task.
   * For drop_down fields, value is the option UUID.
   * For labels fields, value is an array of option UUIDs.
   * For text/number/date/etc., the type-appropriate primitive.
   * Pass null to clear the field.
   * GOTCHA: API accepts UUIDs (or arrays of UUIDs for labels) on input but
   * returns the option's orderindex (integer) when reading the task back.
   * @param taskId The ID of the task
   * @param fieldId The UUID of the custom field
   * @param value The value to set (UUID for drop_down, array for labels, primitive otherwise, or null to clear)
   * @returns Success message
   */
  async setCustomFieldValue(taskId: string, fieldId: string, value: any): Promise<{ success: boolean }> {
    return this.client.post(`/task/${taskId}/field/${fieldId}`, { value });
  }

  /**
   * Remove (clear) the value of a custom field on a task.
   * Equivalent to setCustomFieldValue with value=null but uses the explicit
   * DELETE endpoint.
   * @param taskId The ID of the task
   * @param fieldId The UUID of the custom field
   * @returns Success message
   */
  async removeCustomFieldValue(taskId: string, fieldId: string): Promise<{ success: boolean }> {
    return this.client.delete(`/task/${taskId}/field/${fieldId}`);
  }

  /**
   * Move a task to another list. Uses the v3 endpoint
   * (PUT /api/v3/workspaces/{workspace_id}/tasks/{task_id}/home_list/{list_id}).
   * Note: only root tasks can be moved — sub-tasks must be promoted to root first.
   * @param workspaceId The workspace (team) ID
   * @param taskId The ID of the task to move
   * @param listId The ID of the destination list
   * @returns The moved task
   */
  async moveTaskToList(workspaceId: string, taskId: string, listId: string): Promise<Task> {
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.put(
      `https://api.clickup.com/api/v3/workspaces/${workspaceId}/tasks/${taskId}/home_list/${listId}`,
      {}
    );
    return response.data;
  }

  /**
   * Get subtasks of a specific task
   * @param taskId The ID of the task to get subtasks for
   * @returns A list of subtasks
   */
  async getSubtasks(taskId: string): Promise<Task[]> {
    try {
      // First, we need to get the task to find its list ID
      const task = await this.getTask(taskId);
      if (!task.list || !task.list.id) {
        throw new Error('Task does not have a list ID');
      }
      
      // Then, get all tasks from the list with subtasks included
      const result = await this.getTasksFromList(task.list.id, { subtasks: true });
      
      // Filter tasks to find those that have the specified task as parent
      return result.tasks.filter(task => task.parent === taskId);
    } catch (error) {
      console.error(`Error getting subtasks for task ${taskId}:`, error);
      return [];
    }
  }
}

export const createTasksClient = (client: ClickUpClient): TasksClient => {
  return new TasksClient(client);
};
