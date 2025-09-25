import { assignRoleTool } from './assign';
import { createRoleTool } from './create';
import { deleteRoleTool } from './delete';
import { getRolesTool } from './fetch';
import { removeRoleTool } from './remove';
import { updateRoleTool } from './update';
import type { ToolFactory } from '@/tools/types';

export const roleTools = {
  createRole: createRoleTool,
  getRoles: getRolesTool,
  deleteRole: deleteRoleTool,
  updateRole: updateRoleTool,
  assignRole: assignRoleTool,
  removeRole: removeRoleTool,
} satisfies Record<string, ToolFactory>;
