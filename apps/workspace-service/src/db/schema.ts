import { sql } from 'drizzle-orm';
import {
	sqliteTable,
	text,
	integer,
	primaryKey,
} from 'drizzle-orm/sqlite-core';

export const workspaceRoles = ['owner', 'admin', 'member', 'viewer'] as const;
export type Role = (typeof workspaceRoles)[number];

export const workspaces = sqliteTable('workspaces', {
	workspaceId: text('workspace_id').primaryKey().notNull(),
	workspaceName: text('workspace_name').notNull(),
	createdBy: text('created_by').notNull(),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const workspaceMembers = sqliteTable('workspace_members', {
	workspaceId: text('workspace_id')
		.primaryKey()
		.notNull()
		.references(() => workspaces.workspaceId),
	userId: text('user_id').notNull(),
	role: text('role', { enum: workspaceRoles }).notNull().default('viewer'),
	joinedAt: integer('joined_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export type Workspace = typeof workspaces.$inferSelect;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
