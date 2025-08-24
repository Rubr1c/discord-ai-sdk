import { tool, type Tool } from 'ai';
import type { Guild } from 'discord.js';
import { PermissionsBitField } from 'discord.js';
import z from 'zod';

const PermissionSchema = z
  .object({
    administrator: z
      .boolean()
      .optional()
      .describe('Full admin access (overrides all other permissions)'),
    manageGuild: z.boolean().optional().describe('Manage server settings'),
    manageRoles: z
      .boolean()
      .optional()
      .describe('Manage roles and permissions'),
    manageChannels: z.boolean().optional().describe('Manage channels'),
    kickMembers: z.boolean().optional().describe('Kick members'),
    banMembers: z.boolean().optional().describe('Ban members'),
    moderateMembers: z.boolean().optional().describe('Timeout members'),
    manageMessages: z.boolean().optional().describe('Delete and pin messages'),
    viewAuditLog: z.boolean().optional().describe('View audit logs'),
    sendMessages: z.boolean().optional().describe('Send messages in channels'),
    manageNicknames: z.boolean().optional().describe('Change others nicknames'),
    mentionEveryone: z
      .boolean()
      .optional()
      .describe('Mention @everyone and @here'),
    useSlashCommands: z.boolean().optional().describe('Use slash commands'),
    connect: z.boolean().optional().describe('Connect to voice channels'),
    speak: z.boolean().optional().describe('Speak in voice channels'),
    muteMembers: z.boolean().optional().describe('Mute members in voice'),
    deafenMembers: z.boolean().optional().describe('Deafen members in voice'),
    moveMembers: z
      .boolean()
      .optional()
      .describe('Move members between voice channels'),
  })
  .optional()
  .describe(
    'Role permissions (if admin is true, other permissions are automatically granted)'
  );

export function createRoleTool(guild: Guild): Tool {
  return tool({
    description: 'create a role with colors',
    inputSchema: z.object({
      name: z.string().describe('name of role'),
      primaryColor: z
        .string()
        .regex(/[0-9A-Fa-f]+/g)
        .describe('primary color in hex format like #ff0000 for red'),
      secondaryColor: z
        .string()
        .regex(/[0-9A-Fa-f]+/g)
        .optional()
        .describe('secondary color in hex format (optional)'),
      tertiaryColor: z
        .string()
        .regex(/[0-9A-Fa-f]+/g)
        .optional()
        .describe('tertiary color in hex format (optional)'),
      mentionable: z
        .boolean()
        .default(true)
        .describe('should the role be mentionable (defualt true)'),
      permissions: PermissionSchema,
    }),
    execute: async ({
      name,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      mentionable,
      permissions,
    }) => {
      const colors: any = {
        primaryColor: primaryColor,
      };

      if (secondaryColor) colors.secondaryColor = secondaryColor;
      if (tertiaryColor) colors.tertiaryColor = tertiaryColor;

      let rolePermissions: bigint[] = [];

      if (permissions?.administrator) {
        // If admin is requested, give administrator permission
        rolePermissions = [PermissionsBitField.Flags.Administrator];
      } else if (permissions) {
        // Build permissions array based on selected permissions
        const permissionMap = {
          manageGuild: PermissionsBitField.Flags.ManageGuild,
          manageRoles: PermissionsBitField.Flags.ManageRoles,
          manageChannels: PermissionsBitField.Flags.ManageChannels,
          kickMembers: PermissionsBitField.Flags.KickMembers,
          banMembers: PermissionsBitField.Flags.BanMembers,
          moderateMembers: PermissionsBitField.Flags.ModerateMembers,
          manageMessages: PermissionsBitField.Flags.ManageMessages,
          viewAuditLog: PermissionsBitField.Flags.ViewAuditLog,
          sendMessages: PermissionsBitField.Flags.SendMessages,
          manageNicknames: PermissionsBitField.Flags.ManageNicknames,
          mentionEveryone: PermissionsBitField.Flags.MentionEveryone,
          useSlashCommands: PermissionsBitField.Flags.UseApplicationCommands,
          connect: PermissionsBitField.Flags.Connect,
          speak: PermissionsBitField.Flags.Speak,
          muteMembers: PermissionsBitField.Flags.MuteMembers,
          deafenMembers: PermissionsBitField.Flags.DeafenMembers,
          moveMembers: PermissionsBitField.Flags.MoveMembers,
        };

        rolePermissions = Object.entries(permissions)
          .filter(([key, value]) => value === true && key in permissionMap)
          .map(([key]) => permissionMap[key as keyof typeof permissionMap]);
      }

      const role = await guild.roles.create({
        name,
        colors,
        mentionable,
        permissions: rolePermissions,
      });

      console.log(rolePermissions);

      const permCount = permissions?.administrator
        ? 'Administrator (all permissions)'
        : `${rolePermissions.length} permissions`;
      return `Created role: ${role.name} with ${permCount}`;
    },
  });
}
