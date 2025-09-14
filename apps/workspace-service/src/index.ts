import { WorkerEntrypoint } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { WorkspaceService } from '@/services/workspace-service';
import { type Role } from '@/db/schema';

interface Env {
	WORKSPACE_DB: D1Database;
}

class WorkspaceServiceWorker extends WorkerEntrypoint<Env> {
	private workspaceService: WorkspaceService;
	private db = drizzle(this.env.WORKSPACE_DB);

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		this.workspaceService = new WorkspaceService(this.db);
	}

	async fetch() {
		return Response.json({
			message: 'Workspace Service is running',
			version: '1.0.0',
			status: 'healthy',
		});
	}

	async createWorkspace(workspaceName: string, createdBy: string) {
		return this.workspaceService.createWorkspace(workspaceName, createdBy);
	}

	async getWorkspace(workspaceId: string) {
		return this.workspaceService.getWorkspace(workspaceId);
	}

	async getUserWorkspaces(userId: string) {
		return this.workspaceService.getUserWorkspaces(userId);
	}

	async updateWorkspace(
		workspaceId: string,
		workspaceName: string,
		userId: string,
	) {
		return this.workspaceService.updateWorkspace(
			workspaceId,
			workspaceName,
			userId,
		);
	}

	async deleteWorkspace(workspaceId: string, userId: string) {
		return this.workspaceService.deleteWorkspace(workspaceId, userId);
	}

	async addMember(
		workspaceId: string,
		userId: string,
		targetUserId: string,
		role: Role = 'viewer',
	) {
		return this.workspaceService.addMember(
			workspaceId,
			userId,
			targetUserId,
			role,
		);
	}

	async removeMember(
		workspaceId: string,
		userId: string,
		targetUserId: string,
	) {
		return this.workspaceService.removeMember(
			workspaceId,
			userId,
			targetUserId,
		);
	}

	async updateMemberRole(
		workspaceId: string,
		userId: string,
		targetUserId: string,
		newRole: Role,
	) {
		return this.workspaceService.updateMemberRole(
			workspaceId,
			userId,
			targetUserId,
			newRole,
		);
	}

	async getWorkspaceMembers(workspaceId: string, userId: string) {
		return this.workspaceService.getWorkspaceMembers(workspaceId, userId);
	}

	async getWorkspaceMember(workspaceId: string, userId: string) {
		return this.workspaceService.getWorkspaceMember(workspaceId, userId);
	}

	async leaveWorkspace(workspaceId: string, userId: string) {
		return this.workspaceService.leaveWorkspace(workspaceId, userId);
	}
}

export default WorkspaceServiceWorker;
