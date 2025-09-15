import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq, and, desc } from 'drizzle-orm';
import {
	workspaces,
	workspaceMembers,
	type Workspace,
	type WorkspaceMember,
	type Role,
} from '@/db/schema';
import { nanoid } from 'nanoid';

export class WorkspaceService {
	constructor(private db: DrizzleD1Database) {}

	async createWorkspace(
		workspaceName: string,
		createdBy: string,
	): Promise<Workspace> {
		const workspaceId = nanoid();
		const now = Date.now();

		await this.db.batch([
			this.db.insert(workspaces).values({
				workspaceId,
				workspaceName,
				createdBy,
				createdAt: now,
				updatedAt: now,
			}),
			this.db.insert(workspaceMembers).values({
				workspaceId,
				userId: createdBy,
				role: 'owner',
				joinedAt: now,
			}),
		]);

		const [workspace] = await this.db
			.select()
			.from(workspaces)
			.where(eq(workspaces.workspaceId, workspaceId));

		return workspace;
	}

	async getWorkspace(workspaceId: string): Promise<Workspace | null> {
		const [workspace] = await this.db
			.select()
			.from(workspaces)
			.where(eq(workspaces.workspaceId, workspaceId));

		return workspace || null;
	}

	async getUserWorkspaces(
		userId: string,
	): Promise<(Workspace & { role: Role })[]> {
		const result = await this.db
			.select({
				workspaceId: workspaces.workspaceId,
				workspaceName: workspaces.workspaceName,
				createdBy: workspaces.createdBy,
				createdAt: workspaces.createdAt,
				updatedAt: workspaces.updatedAt,
				role: workspaceMembers.role,
			})
			.from(workspaces)
			.innerJoin(
				workspaceMembers,
				eq(workspaces.workspaceId, workspaceMembers.workspaceId),
			)
			.where(eq(workspaceMembers.userId, userId))
			.orderBy(desc(workspaces.createdAt));

		return result;
	}

	async updateWorkspace(
		workspaceId: string,
		workspaceName: string,
		userId: string,
	): Promise<Workspace | null> {
		const member = await this.getWorkspaceMember(workspaceId, userId);
		if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
			throw new Error('Insufficient permissions to update workspace');
		}

		await this.db
			.update(workspaces)
			.set({
				workspaceName,
				updatedAt: Date.now(),
			})
			.where(eq(workspaces.workspaceId, workspaceId));

		return this.getWorkspace(workspaceId);
	}

	async deleteWorkspace(workspaceId: string, userId: string): Promise<boolean> {
		const member = await this.getWorkspaceMember(workspaceId, userId);

		if (!member || member.role !== 'owner') {
			throw new Error('Only workspace owner can delete workspace');
		}

		await this.db.transaction(async (tx) => {
			await tx
				.delete(workspaceMembers)
				.where(eq(workspaceMembers.workspaceId, workspaceId));
			await tx
				.delete(workspaces)
				.where(eq(workspaces.workspaceId, workspaceId));
		});

		return true;
	}

	async addMember(
		workspaceId: string,
		userId: string,
		targetUserId: string,
		role: Role = 'viewer',
	): Promise<WorkspaceMember> {
		const requesterMember = await this.getWorkspaceMember(workspaceId, userId);
		if (
			!requesterMember ||
			(requesterMember.role !== 'owner' && requesterMember.role !== 'admin')
		) {
			throw new Error('Insufficient permissions to add members');
		}

		const existingMember = await this.getWorkspaceMember(
			workspaceId,
			targetUserId,
		);
		if (existingMember) {
			throw new Error('User is already a member of this workspace');
		}

		const memberData = {
			workspaceId,
			userId: targetUserId,
			role,
			joinedAt: Date.now(),
		};

		await this.db.insert(workspaceMembers).values(memberData);

		const [member] = await this.db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, targetUserId),
				),
			);

		return member;
	}

	async removeMember(
		workspaceId: string,
		userId: string,
		targetUserId: string,
	): Promise<boolean> {
		const requesterMember = await this.getWorkspaceMember(workspaceId, userId);
		if (
			!requesterMember ||
			(requesterMember.role !== 'owner' && requesterMember.role !== 'admin')
		) {
			throw new Error('Insufficient permissions to remove members');
		}

		const targetMember = await this.getWorkspaceMember(
			workspaceId,
			targetUserId,
		);
		if (!targetMember) {
			throw new Error('User is not a member of this workspace');
		}

		if (targetMember.role === 'owner') {
			throw new Error('Cannot remove workspace owner');
		}

		await this.db
			.delete(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, targetUserId),
				),
			);

		return true;
	}

	async updateMemberRole(
		workspaceId: string,
		userId: string,
		targetUserId: string,
		newRole: Role,
	): Promise<WorkspaceMember | null> {
		const requesterMember = await this.getWorkspaceMember(workspaceId, userId);
		if (!requesterMember || requesterMember.role !== 'owner') {
			throw new Error('Only workspace owner can update member roles');
		}

		const targetMember = await this.getWorkspaceMember(
			workspaceId,
			targetUserId,
		);
		if (!targetMember) {
			throw new Error('User is not a member of this workspace');
		}

		if (targetMember.role === 'owner') {
			throw new Error('Cannot change owner role');
		}

		await this.db
			.update(workspaceMembers)
			.set({ role: newRole })
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, targetUserId),
				),
			);

		const [updatedMember] = await this.db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, targetUserId),
				),
			);

		return updatedMember || null;
	}

	async getWorkspaceMembers(
		workspaceId: string,
		userId: string,
	): Promise<WorkspaceMember[]> {
		const requesterMember = await this.getWorkspaceMember(workspaceId, userId);
		if (!requesterMember) {
			throw new Error('You are not a member of this workspace');
		}

		return this.db
			.select()
			.from(workspaceMembers)
			.where(eq(workspaceMembers.workspaceId, workspaceId))
			.orderBy(workspaceMembers.joinedAt);
	}

	async getWorkspaceMember(
		workspaceId: string,
		userId: string,
	): Promise<WorkspaceMember | null> {
		const [member] = await this.db
			.select()
			.from(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, userId),
				),
			);

		return member || null;
	}

	async leaveWorkspace(workspaceId: string, userId: string): Promise<boolean> {
		const member = await this.getWorkspaceMember(workspaceId, userId);
		if (!member) {
			throw new Error('You are not a member of this workspace');
		}

		if (member.role === 'owner') {
			throw new Error(
				'Workspace owner cannot leave workspace. Transfer ownership or delete workspace instead.',
			);
		}

		await this.db
			.delete(workspaceMembers)
			.where(
				and(
					eq(workspaceMembers.workspaceId, workspaceId),
					eq(workspaceMembers.userId, userId),
				),
			);

		return true;
	}
}
