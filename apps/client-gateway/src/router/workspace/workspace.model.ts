import { z } from 'zod';

export const workspaceRoles = ['owner', 'admin', 'member', 'viewer'] as const;

export const createWorkspaceSchema = z.object({
	workspaceName: z.string().min(1, 'Workspace name is required'),
});

export const updateWorkspaceSchema = z.object({
	workspaceId: z.string(),
	workspaceName: z.string().min(1, 'Workspace name is required'),
});

export const deleteWorkspaceSchema = z.object({
	workspaceId: z.string(),
});

export const getWorkspaceSchema = z.object({
	workspaceId: z.string(),
});

export const addMemberSchema = z.object({
	workspaceId: z.string(),
	targetUserId: z.string(),
	role: z.enum(workspaceRoles).default('viewer'),
});

export const removeMemberSchema = z.object({
	workspaceId: z.string(),
	targetUserId: z.string(),
});

export const updateMemberRoleSchema = z.object({
	workspaceId: z.string(),
	targetUserId: z.string(),
	newRole: z.enum(workspaceRoles),
});

export const getWorkspaceMembersSchema = z.object({
	workspaceId: z.string(),
});

export const leaveWorkspaceSchema = z.object({
	workspaceId: z.string(),
});