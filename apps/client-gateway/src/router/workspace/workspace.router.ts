import { publicProcedure, protectedProcedure, router } from '@/lib/trpc';
import {
	createWorkspaceSchema,
	updateWorkspaceSchema,
	deleteWorkspaceSchema,
	getWorkspaceSchema,
	addMemberSchema,
	removeMemberSchema,
	updateMemberRoleSchema,
	getWorkspaceMembersSchema,
	leaveWorkspaceSchema,
} from './workspace.model';

export const workspaceRouter = router({
	create: protectedProcedure
		.input(createWorkspaceSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.createWorkspace(
				input.workspaceName,
				userId,
			);
		}),

	get: publicProcedure
		.input(getWorkspaceSchema)
		.query(async ({ input, ctx }) => {
			return ctx.env.WORKSPACE_SERVICE.getWorkspace(input.workspaceId);
		}),

	getUserWorkspaces: protectedProcedure.query(async ({ ctx }) => {
		// TODO: Get userId from auth context
		const userId = 'temp-user-id';
		return ctx.env.WORKSPACE_SERVICE.getUserWorkspaces(userId);
	}),

	update: publicProcedure
		.input(updateWorkspaceSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.updateWorkspace(
				input.workspaceId,
				input.workspaceName,
				userId,
			);
		}),

	delete: publicProcedure
		.input(deleteWorkspaceSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.deleteWorkspace(
				input.workspaceId,
				userId,
			);
		}),

	addMember: publicProcedure
		.input(addMemberSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.addMember(
				input.workspaceId,
				userId,
				input.targetUserId,
				input.role,
			);
		}),

	removeMember: publicProcedure
		.input(removeMemberSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.removeMember(
				input.workspaceId,
				userId,
				input.targetUserId,
			);
		}),

	updateMemberRole: publicProcedure
		.input(updateMemberRoleSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.updateMemberRole(
				input.workspaceId,
				userId,
				input.targetUserId,
				input.newRole,
			);
		}),

	getMembers: publicProcedure
		.input(getWorkspaceMembersSchema)
		.query(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.getWorkspaceMembers(
				input.workspaceId,
				userId,
			);
		}),

	leave: publicProcedure
		.input(leaveWorkspaceSchema)
		.mutation(async ({ input, ctx }) => {
			// TODO: Get userId from auth context
			const userId = 'temp-user-id';
			return ctx.env.WORKSPACE_SERVICE.leaveWorkspace(
				input.workspaceId,
				userId,
			);
		}),
});
