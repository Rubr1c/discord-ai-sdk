import { tool, type Tool } from 'ai';
import { type Guild } from 'discord.js';
import z from 'zod';
import type { ToolResult } from '../types';

/**
 * Creates a tool to rename the server.
 * @param guild - The guild.
 * @returns The tool binded to the guild.
 */
export function setServerNameTool(guild: Guild): Tool {
  return tool({
    description: 'Rename this Discord server (requires Manage Server permission).',
    inputSchema: z.object({
      name: z
        .string()
        .min(2, 'Server name must be at least 2 characters')
        .max(100, 'Server name must be at most 100 characters')
        .regex(/^[^\r\n]+$/, 'Server name cannot contain line breaks')
        .describe('New server name (2–100 chars)'),
    }),
    execute: async ({ name }): Promise<ToolResult> => {
      const newName = name.trim();

      if (newName === guild.name) {
        return { summary: `Server name is already '${newName}'.` };
      }

      try {
        await guild.setName(newName, 'Renamed by tool');
        return { summary: `Renamed server to ${newName}` };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { summary: `Failed to rename server: ${message}` };
      }
    },
  });
}
