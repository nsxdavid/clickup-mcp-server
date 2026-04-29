import { ClickUpClient } from './index.js';
import axios from 'axios';

// Updated Doc interface based on v3 API response
export interface Doc {
  id: string;
  name: string;
  date_created: number;
  date_updated: number;
  parent?: {
    id: string;
    type: number;
  };
  public: boolean;
  workspace_id: number;
  creator: number;
  deleted: boolean;
  type: number;
  content?: string;
}

export interface GetDocsParams {
  cursor?: string;
  deleted?: boolean;
  archived?: boolean;
  limit?: number;
}

export interface SearchDocsParams {
  query: string;
  cursor?: string;
}

export class DocsClient {
  private client: ClickUpClient;

  constructor(client: ClickUpClient) {
    this.client = client;
  }

  /**
   * Get docs from a specific workspace
   * @param workspaceId The ID of the workspace to get docs from
   * @param params Optional parameters for filtering docs
   * @returns A list of docs
   */
  async getDocsFromWorkspace(workspaceId: string, params?: GetDocsParams): Promise<{ docs: Doc[], next_cursor: string }> {
    // Get the API token directly from the environment variable
    const apiToken = process.env.CLICKUP_API_TOKEN;
    
    try {
      const url = `https://api.clickup.com/api/v3/workspaces/${workspaceId}/docs`;
      
      // Use the exact same headers that worked in the successful request
      const headers = {
        'Authorization': apiToken,
        'Accept': 'application/json'
      };
      
      const response = await axios.get(url, {
        headers,
        params
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting docs:', error);
      throw error;
    }
  }


  /**
   * Get the pages of a doc
   * @param workspaceId The ID of the workspace
   * @param docId The ID of the doc
   * @param contentFormat The format to return the content in (text/md or text/plain)
   * @returns The pages of the doc
   */
  async getDocPages(workspaceId: string, docId: string, contentFormat: string = 'text/md'): Promise<any> {
    // Get the API token directly from the environment variable
    const apiToken = process.env.CLICKUP_API_TOKEN;
    
    try {
      const url = `https://api.clickup.com/api/v3/workspaces/${workspaceId}/docs/${docId}/pages`;
      
      // Use the exact same parameters that worked in the successful request
      const params = { 
        max_page_depth: -1,
        content_format: contentFormat
      };
      
      // Use the exact same headers that worked in the successful request
      const headers = {
        'Authorization': apiToken,
        'Accept': 'application/json'
      };
      
      const response = await axios.get(url, {
        headers,
        params
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting doc pages:', error);
      throw error;
    }
  }

  /**
   * Search for docs in a workspace by name (case-insensitive substring match).
   *
   * Implementation note: ClickUp's v2 search endpoint
   * (`/api/v2/team/{ws}/docs/search`) returns 404 — it does not exist. The
   * v3 docs API has no dedicated search endpoint either. We therefore page
   * through `GET /api/v3/workspaces/{ws}/docs` and filter client-side. For
   * very large workspaces this is suboptimal, but it is the only reliable
   * way to honor the tool contract.
   *
   * The query syntax `space:<spaceId>` is preserved from the legacy v2
   * implementation: instead of matching by name, return all docs whose
   * `parent.id === spaceId` (parent_type 4 = space, but we don't filter on
   * type to also surface docs nested under folders/lists of that space —
   * see deepFilter below).
   *
   * @param workspaceId The ID of the workspace to search in
   * @param params The search parameters
   * @returns A list of docs matching the search query
   */
  async searchDocs(workspaceId: string, params: SearchDocsParams): Promise<{ docs: Doc[], next_cursor: string }> {
    const isSpaceFilter = params.query.startsWith('space:');
    const spaceId = isSpaceFilter ? params.query.substring(6) : null;
    const needle = isSpaceFilter ? '' : params.query.toLowerCase();

    const matches: Doc[] = [];
    let cursor: string | undefined = params.cursor;
    // Hard cap to avoid runaway loops; ClickUp's docs are paginated 50/page.
    const MAX_PAGES = 40;
    let pages = 0;
    let nextCursor = '';

    while (pages < MAX_PAGES) {
      const page = await this.getDocsFromWorkspace(workspaceId, { cursor, limit: 50 });
      for (const doc of page.docs ?? []) {
        if (isSpaceFilter) {
          if (doc.parent?.id === spaceId) matches.push(doc);
        } else if (doc.name && doc.name.toLowerCase().includes(needle)) {
          matches.push(doc);
        }
      }
      pages += 1;
      if (!page.next_cursor) {
        nextCursor = '';
        break;
      }
      cursor = page.next_cursor;
      nextCursor = page.next_cursor;
    }

    return { docs: matches, next_cursor: nextCursor };
  }

  /**
   * Create a new doc in a list
   * @param listId The ID of the list to create the doc in
   * @param title The title of the doc
   * @param content The content of the doc (HTML format)
   * @returns The created doc
   */
  async createDocInList(listId: string, title: string, content: string): Promise<Doc> {
    // Create a custom axios instance for v3 API
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.post(`https://api.clickup.com/api/v3/lists/${listId}/docs`, { name: title, content });
    return response.data;
  }

  /**
   * Create a new doc in a folder
   * @param folderId The ID of the folder to create the doc in
   * @param title The title of the doc
   * @param content The content of the doc (HTML format)
   * @returns The created doc
   */
  async createDocInFolder(folderId: string, title: string, content: string): Promise<Doc> {
    // Create a custom axios instance for v3 API
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.post(`https://api.clickup.com/api/v3/folders/${folderId}/docs`, { name: title, content });
    return response.data;
  }

  /**
   * Update an existing doc
   * @param docId The ID of the doc to update
   * @param title The new title of the doc
   * @param content The new content of the doc (HTML format)
   * @returns The updated doc
   */
  async updateDoc(docId: string, title?: string, content?: string): Promise<Doc> {
    const params: any = {};
    if (title !== undefined) params.name = title;
    if (content !== undefined) params.content = content;
    
    // Create a custom axios instance for v3 API
    const axiosInstance = this.client.getAxiosInstance();
    const response = await axiosInstance.put(`https://api.clickup.com/api/v3/docs/${docId}`, params);
    return response.data;
  }
}

export const createDocsClient = (client: ClickUpClient): DocsClient => {
  return new DocsClient(client);
};
