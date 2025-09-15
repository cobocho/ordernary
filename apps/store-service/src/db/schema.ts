import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Enums ---
export const storeRole = ['owner', 'manager', 'staff', 'viewer'] as const;

export const storeLockReason = [
	'PLAN_DOWNGRADE_EXCESS_STORES',
	'PLAN_EXPIRED',
	'MANUAL',
	'PAYMENT_ISSUE',
] as const;

// --- Tables ---
export const stores = sqliteTable('stores', {
	storeId: text('store_id').primaryKey().notNull(),
	storeName: text('store_name').notNull(),
	state: text('state', { enum: ['operation', 'paused', 'closed'] })
		.notNull()
		.default('operation'),
	createdBy: text('created_by').notNull(),

	description: text('description'),
	address: text('address').notNull(),
	phone: text('phone'),
	businessHours: text('business_hours'),
	payoutBankName: text('payout_bank_name'),
	payoutAccountNumber: text('payout_account_number')
		.default('')
		.$type<string | null>(),
	payoutAccountHolder: text('payout_account_holder'),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});

export const storeMemberStatus = [
	'pending',
	'active',
	'revoked',
	'locked',
] as const;

export const storeMembers = sqliteTable('store_members', {
	storeId: text('store_id')
		.primaryKey()
		.notNull()
		.references(() => stores.storeId),
	userId: text('user_id').primaryKey().notNull(),
	role: text('role', { enum: storeRole }).notNull().default('viewer'),
	status: text('status', { enum: storeMemberStatus }).notNull(),
	joinedAt: integer('joined_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});
