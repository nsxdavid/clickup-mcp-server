import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createClickUpClient } from '../clickup-client/index.js';
import { createSpacesClient } from '../clickup-client/spaces.js';

// Create clients
const clickUpClient = createClickUpClient();
const spacesClient = createSpacesClient(clickUpClient);

export function setupSpaceTools(server: McpServer): void {
  // Register get_spaces tool
  server.tool(
    'get_spaces',
    'Get spaces from a ClickUp workspace. Returns space details including name, settings, and features.',
    { workspace_id: z.string().describe('The ID of the workspace to get spaces from') },
    async ({ workspace_id }) => {
      try {
        console.error(`[SpaceTools] Getting spaces for workspace ${workspace_id}...`);
        const spaces = await spacesClient.getSpacesFromWorkspace(workspace_id);
        console.error(`[SpaceTools] Got ${spaces.length} spaces`);
        
        return {
          content: [{ type: 'text', text: JSON.stringify(spaces, null, 2) }]
        };
      } catch (error: any) {
        console.error('Error getting spaces:', error);
        return {
          content: [{ type: 'text', text: `Error getting spaces: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Register get_space tool
  server.tool(
    'get_space',
    'Get details about a specific ClickUp space. Returns space name, settings, features, and metadata.',
    { space_id: z.string().describe('The ID of the space to get') },
    async ({ space_id }) => {
      try {
        console.error(`[SpaceTools] Getting space ${space_id}...`);
        const space = await spacesClient.getSpace(space_id);
        console.error(`[SpaceTools] Got space: ${space.name}`);

        return {
          content: [{ type: 'text', text: JSON.stringify(space, null, 2) }]
        };
      } catch (error: any) {
        console.error('Error getting space:', error);
        return {
          content: [{ type: 'text', text: `Error getting space: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Register update_space tool
  server.tool(
    'update_space',
    'Update a ClickUp space — rename, toggle multiple_assignees, or enable/disable ClickApps (priorities, milestones, time_tracking, tags, etc.). IMPORTANT: ClickUp\'s PUT /space/{id} NULLifies missing fields. The "name" parameter is required to avoid NULLification of the space name even when only toggling features.',
    {
      space_id: z.string().describe('The ID of the space to update'),
      name: z.string().describe('Space name (REQUIRED — pass the current name to avoid NULLification when toggling features)'),
      private: z.boolean().optional().describe('Whether the space is private'),
      multiple_assignees: z.boolean().optional().describe('Enable assigning multiple users to a single task'),
      enable_priorities: z.boolean().optional().describe('Enable the priorities ClickApp'),
      enable_milestones: z.boolean().optional().describe('Enable the milestones ClickApp (custom_item_id=1 task type)'),
      enable_time_tracking: z.boolean().optional().describe('Enable native time tracking'),
      enable_time_estimates: z.boolean().optional().describe('Enable time estimates'),
      enable_tags: z.boolean().optional().describe('Enable tags'),
      enable_checklists: z.boolean().optional().describe('Enable checklists'),
      enable_custom_fields: z.boolean().optional().describe('Enable custom fields'),
      enable_remap_dependencies: z.boolean().optional().describe('Enable remap dependencies'),
      enable_dependency_warning: z.boolean().optional().describe('Enable dependency warnings'),
      enable_portfolios: z.boolean().optional().describe('Enable portfolios'),
      enable_sprints: z.boolean().optional().describe('Enable sprints'),
      enable_points: z.boolean().optional().describe('Enable story points')
    },
    async (args) => {
      try {
        const { space_id, name, ...flags } = args;
        const features: any = {};
        if (flags.enable_priorities !== undefined) features.priorities = { enabled: flags.enable_priorities };
        if (flags.enable_milestones !== undefined) features.milestones = { enabled: flags.enable_milestones };
        if (flags.enable_time_tracking !== undefined) features.time_tracking = { enabled: flags.enable_time_tracking };
        if (flags.enable_time_estimates !== undefined) features.time_estimates = { enabled: flags.enable_time_estimates };
        if (flags.enable_tags !== undefined) features.tags = { enabled: flags.enable_tags };
        if (flags.enable_checklists !== undefined) features.checklists = { enabled: flags.enable_checklists };
        if (flags.enable_custom_fields !== undefined) features.custom_fields = { enabled: flags.enable_custom_fields };
        if (flags.enable_remap_dependencies !== undefined) features.remap_dependencies = { enabled: flags.enable_remap_dependencies };
        if (flags.enable_dependency_warning !== undefined) features.dependency_warning = { enabled: flags.enable_dependency_warning };
        if (flags.enable_portfolios !== undefined) features.portfolios = { enabled: flags.enable_portfolios };
        if (flags.enable_sprints !== undefined) features.sprints = { enabled: flags.enable_sprints };
        if (flags.enable_points !== undefined) features.points = { enabled: flags.enable_points };
        const params: any = { name };
        if (flags.private !== undefined) params.private = flags.private;
        if (flags.multiple_assignees !== undefined) params.multiple_assignees = flags.multiple_assignees;
        if (Object.keys(features).length > 0) params.features = features;
        const result = await spacesClient.updateSpace(space_id, params);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        console.error('Error updating space:', error);
        return {
          content: [{ type: 'text', text: `Error updating space: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Register create_space tool
  server.tool(
    'create_space',
    'Create a new space in a ClickUp workspace. Optionally enable ClickApps (priorities, milestones, time_tracking, tags, etc.) and toggle multiple_assignees at creation time. Use update_space afterwards to adjust further settings.',
    {
      workspace_id: z.string().describe('The ID of the workspace (team) to create the space in'),
      name: z.string().describe('Space name'),
      multiple_assignees: z.boolean().optional().describe('Enable assigning multiple users to a single task'),
      enable_priorities: z.boolean().optional().describe('Enable the priorities ClickApp'),
      enable_milestones: z.boolean().optional().describe('Enable the milestones ClickApp (custom_item_id=1 task type)'),
      enable_time_tracking: z.boolean().optional().describe('Enable native time tracking'),
      enable_time_estimates: z.boolean().optional().describe('Enable time estimates'),
      enable_tags: z.boolean().optional().describe('Enable tags'),
      enable_checklists: z.boolean().optional().describe('Enable checklists'),
      enable_custom_fields: z.boolean().optional().describe('Enable custom fields'),
      enable_remap_dependencies: z.boolean().optional().describe('Enable remap dependencies'),
      enable_dependency_warning: z.boolean().optional().describe('Enable dependency warnings'),
      enable_portfolios: z.boolean().optional().describe('Enable portfolios'),
      enable_sprints: z.boolean().optional().describe('Enable sprints'),
      enable_points: z.boolean().optional().describe('Enable story points')
    },
    async (args) => {
      try {
        const { workspace_id, name, ...flags } = args;
        const features: any = {};
        if (flags.enable_priorities !== undefined) features.priorities = { enabled: flags.enable_priorities };
        if (flags.enable_milestones !== undefined) features.milestones = { enabled: flags.enable_milestones };
        if (flags.enable_time_tracking !== undefined) features.time_tracking = { enabled: flags.enable_time_tracking };
        if (flags.enable_time_estimates !== undefined) features.time_estimates = { enabled: flags.enable_time_estimates };
        if (flags.enable_tags !== undefined) features.tags = { enabled: flags.enable_tags };
        if (flags.enable_checklists !== undefined) features.checklists = { enabled: flags.enable_checklists };
        if (flags.enable_custom_fields !== undefined) features.custom_fields = { enabled: flags.enable_custom_fields };
        if (flags.enable_remap_dependencies !== undefined) features.remap_dependencies = { enabled: flags.enable_remap_dependencies };
        if (flags.enable_dependency_warning !== undefined) features.dependency_warning = { enabled: flags.enable_dependency_warning };
        if (flags.enable_portfolios !== undefined) features.portfolios = { enabled: flags.enable_portfolios };
        if (flags.enable_sprints !== undefined) features.sprints = { enabled: flags.enable_sprints };
        if (flags.enable_points !== undefined) features.points = { enabled: flags.enable_points };
        const params: any = { name };
        if (flags.multiple_assignees !== undefined) params.multiple_assignees = flags.multiple_assignees;
        if (Object.keys(features).length > 0) params.features = features;
        const result = await spacesClient.createSpace(workspace_id, params);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      } catch (error: any) {
        console.error('Error creating space:', error);
        return {
          content: [{ type: 'text', text: `Error creating space: ${error.message}` }],
          isError: true
        };
      }
    }
  );

  // Register delete_space tool
  server.tool(
    'delete_space',
    'Permanently delete a ClickUp space. This is destructive — the space, its folders, lists, and tasks are removed. There is no undo.',
    { space_id: z.string().describe('The ID of the space to delete') },
    async ({ space_id }) => {
      try {
        await spacesClient.deleteSpace(space_id);
        return {
          content: [{ type: 'text', text: `Space ${space_id} deleted` }]
        };
      } catch (error: any) {
        console.error('Error deleting space:', error);
        return {
          content: [{ type: 'text', text: `Error deleting space: ${error.message}` }],
          isError: true
        };
      }
    }
  );
}
