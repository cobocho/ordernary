// schema.ts
import { sql } from 'drizzle-orm';
import {
	sqliteTable,
	text,
	integer,
	primaryKey,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

// store_role
export const STORE_ROLES = ['owner', 'manager', 'staff', 'viewer'] as const;
export type StoreRole = (typeof STORE_ROLES)[number];

export const STORE_LOCK_REASONS = [
	'PLAN_DOWNGRADE_EXCESS_STORES',
	'PLAN_EXPIRED',
	'MANUAL',
	'PAYMENT_ISSUE',
] as const;
export type StoreLockReason = (typeof STORE_LOCK_REASONS)[number];

export const STORE_STATES = ['operation', 'paused', 'closed'] as const;
export type StoreState = (typeof STORE_STATES)[number];

export const STORE_MEMBER_STATUSES = [
	'pending',
	'active',
	'revoked',
	'locked',
] as const;
export type StoreMemberStatus = (typeof STORE_MEMBER_STATUSES)[number];

export const stores = sqliteTable('stores', {
	storeId: text('store_id').primaryKey().notNull(),
	storeName: text('store_name').notNull(),
	createdBy: text('created_by').notNull(),
	state: text('state', { enum: STORE_STATES }).notNull().default('operation'),
	description: text('description'),
	address: text('address'),
	addressDetail: text('address_detail'),
	phone: text('phone'),
	businessHours: text('business_hours'),
	payoutBankName: text('payout_bank_name'),
	payoutAccountNumber: text('payout_account_number'),
	payoutAccountHolder: text('payout_account_holder'),
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(strftime('%s','now'))`),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`(strftime('%s','now'))`),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
	isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
	lockReason: text('lock_reason', { enum: STORE_LOCK_REASONS }),
});

export const storeInsertSchema = createInsertSchema(stores, {
	storeName: z
		.string()
		.min(1, '매장 이름은 필수 입력 항목입니다.')
		.max(30, '매장 이름은 최대 30자 이하여야 합니다.'),
	createdBy: z.string().min(1, '생성자는 필수 입력 항목입니다.'),
	description: z
		.string()
		.max(1000, '설명은 최대 1000자 이하여야 합니다.')
		.nullish(),
	address: z.string().max(100, '주소는 최대 100자 이하여야 합니다.').nullish(),
	addressDetail: z
		.string()
		.max(100, '상세 주소는 최대 100자 이하여야 합니다.')
		.nullish(),
	phone: z.string().max(20, '전화번호는 최대 20자 이하여야 합니다.').nullish(),
	businessHours: z.string().nullish(),
	payoutBankName: z
		.string()
		.max(100, '출금 은행 이름은 최대 100자 이하여야 합니다.')
		.nullish(),
	payoutAccountNumber: z
		.string()
		.max(100, '출금 계좌 번호는 최대 100자 이하여야 합니다.')
		.nullish(),
	payoutAccountHolder: z
		.string()
		.max(100, '출금 예금주는 최대 100자 이하여야 합니다.')
		.nullish(),
});

export type StoreInsert = z.infer<typeof storeInsertSchema>;

export const storeUpdateSchema = storeInsertSchema.extend({
	storeId: z.string().min(1, '매장 ID는 필수 입력 항목입니다.'),
});

export type StoreUpdate = z.infer<typeof storeUpdateSchema>;

export const storeMembers = sqliteTable(
	'store_members',
	{
		storeId: text('store_id')
			.notNull()
			.references(() => stores.storeId),
		userId: text('user_id').notNull(),
		role: text('role', { enum: STORE_ROLES }).notNull().default('viewer'),
		status: text('status', { enum: STORE_MEMBER_STATUSES }).notNull(),
		joinedAt: integer('joined_at')
			.notNull()
			.default(sql`(strftime('%s','now'))`),
	},
	(table) => [primaryKey({ columns: [table.storeId, table.userId] })],
);

export const storeMemberInsertSchema = createInsertSchema(storeMembers, {
	storeId: z.string().min(1, '매장 ID는 필수 입력 항목입니다.'),
	userId: z.string().min(1, '사용자 ID는 필수 입력 항목입니다.'),
	role: z.enum(STORE_ROLES),
	status: z.enum(STORE_MEMBER_STATUSES),
});

export type StoreMemberInsert = z.infer<typeof storeMemberInsertSchema>;

export const storeMemberUpdateSchema = storeMemberInsertSchema.extend({
	storeId: z.string().min(1, '매장 ID는 필수 입력 항목입니다.'),
	userId: z.string().min(1, '사용자 ID는 필수 입력 항목입니다.'),
});

export type StoreMemberUpdate = z.infer<typeof storeMemberUpdateSchema>;

export const storeTables = sqliteTable(
	'tables',
	{
		storeId: text('store_id')
			.notNull()
			.references(() => stores.storeId),
		tableId: text('table_id').notNull(),
		tableCode: text('table_code').notNull(),
		capacity: integer('capacity').notNull().default(2),
		createdAt: integer('created_at')
			.notNull()
			.default(sql`(strftime('%s','now'))`),
		updatedAt: integer('updated_at')
			.notNull()
			.default(sql`(strftime('%s','now'))`),
		isActive: integer('is_active', { mode: 'boolean' })
			.notNull()
			.default(false),
		isEnabled: integer('is_enabled', { mode: 'boolean' })
			.notNull()
			.default(true),
	},
	(table) => [primaryKey({ columns: [table.storeId, table.tableId] })],
);

export const storeTableInsertSchema = createInsertSchema(storeTables, {
	storeId: z.string().min(1, '매장 ID는 필수 입력 항목입니다.'),
	tableCode: z.string().min(1, '테이블 코드는 필수 입력 항목입니다.'),
	capacity: z.number().min(1, '테이블 정원은 필수 입력 항목입니다.'),
});

export type StoreTableInsert = z.infer<typeof storeTableInsertSchema>;

export const storeTableUpdateSchema = storeTableInsertSchema.extend({
	storeId: z.string().min(1, '매장 ID는 필수 입력 항목입니다.'),
	tableId: z.string().min(1, '테이블 ID는 필수 입력 항목입니다.'),
});

export type StoreTableUpdate = z.infer<typeof storeTableUpdateSchema>;
