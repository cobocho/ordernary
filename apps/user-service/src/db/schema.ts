import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// enum 정의
export const userState = ['active', 'inactive', 'withdrawn'] as const;
export const providers = ['google', 'kakao', 'apple', 'naver'] as const;
export type ProviderType = (typeof providers)[number];

export const users = sqliteTable('users', {
	userId: text('user_id').primaryKey().notNull(),
	provider: text('provider', { enum: providers }).notNull(),
	providerId: text('provider_id').notNull(),
	name: text('name').notNull(),
	state: text('state', { enum: userState }).notNull(),
	email: text('email').notNull(),
	phone: text('phone'),
	avatarUrl: text('avata_url'),
	refreshToken: text('refresh_token'),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull(),
	withdrawAt: integer('withdraw_at'),
});

export type User = typeof users.$inferSelect;
