import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClickUpClient } from '../clickup-client/index.js';
import { createSpacesClient } from '../clickup-client/spaces.js';

// Create clients
const clickUpClient = createClickUpClient();
const spacesClient = createSpacesClient(clickUpClient);

export function setupSpaceResources(server: McpServer): void {
  // Register workspace spaces resource
  server.resource(
    'workspace-spaces',
    new ResourceTemplate('clickup://workspace/{workspace_id}/spaces', { list: undefined }),
    async (uri, params) => {
      try {
        const workspace_id = params.workspace_id as string;
        console.error(`[SpaceResources] Fetching spaces for workspace: ${workspace_id}`);
        const spaces = await spacesClient.getSpacesFromWorkspace(workspace_id);
        console.error(`[SpaceResources] Got spaces count: ${spaces.length}`);
        
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'application/json',
              text: JSON.stringify(spaces, null, 2),
            },
          ],
        };
      } catch (error: any) {
        console.error(`[SpaceResources] Error fetching workspace spaces:`, error);
        throw new Error(`Error fetching workspace spaces: ${error.message}`);
      }
    }
  );

  // Register space details resource
  server.resource(
    'space-details',
    new ResourceTemplate('clickup://space/{space_id}', { list: undefined }),
    async (uri, params) => {
      try {
        const space_id = params.space_id as string;
        console.error(`[SpaceResources] Fetching space: ${space_id}`);
        const space = await spacesClient.getSpace(space_id);
        console.error(`[SpaceResources] Got space: ${space.name}`);
        
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'application/json',
              text: JSON.stringify(space, null, 2),
            },
          ],
        };
      } catch (error: any) {
        console.error(`[SpaceResources] Error fetching space:`, error);
        throw new Error(`Error fetching space: ${error.message}`);
      }
    }
  );

  // Add some example static resources for discoverability
  server.resource(
    'example-workspace-spaces',
    'clickup://workspace/9011839976/spaces',
    async (uri) => {
      try {
        const workspace_id = '9011839976';
        console.error(`[SpaceResources] Fetching spaces for example workspace: ${workspace_id}`);
        const spaces = await spacesClient.getSpacesFromWorkspace(workspace_id);
        console.error(`[SpaceResources] Got example spaces count: ${spaces.length}`);
        
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'application/json',
              text: JSON.stringify(spaces, null, 2),
            },
          ],
        };
      } catch (error: any) {
        console.error(`[SpaceResources] Error fetching example workspace spaces:`, error);
        throw new Error(`Error fetching example workspace spaces: ${error.message}`);
      }
    }
  );

  server.resource(
    'example-space',
    'clickup://space/90113637923',
    async (uri) => {
      try {
        const space_id = '90113637923';
        console.error(`[SpaceResources] Fetching example space: ${space_id}`);
        const space = await spacesClient.getSpace(space_id);
        console.error(`[SpaceResources] Got example space: ${space.name}`);
        
        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: 'application/json',
              text: JSON.stringify(space, null, 2),
            },
          ],
        };
      } catch (error: any) {
        console.error(`[SpaceResources] Error fetching example space:`, error);
        throw new Error(`Error fetching example space: ${error.message}`);
      }
    }
  );
}
