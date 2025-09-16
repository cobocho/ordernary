import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

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
	createdAt: integer('created_at')
		.notNull()
		.default(sql`(strftime('%s','now'))`),
	updatedAt: integer('updated_at')
		.notNull()
		.default(sql`(strftime('%s','now'))`),
	withdrawAt: integer('withdraw_at'),
});

export const userSelectSchema = createSelectSchema(users);

export type User = typeof userSelectSchema;

export const userInsertSchema = createInsertSchema(users, {
	userId: z.string().min(1, '사용자 ID는 필수 입력 항목입니다.'),
	provider: z.enum(providers),
	providerId: z.string().min(1, '프로바이더 ID는 필수 입력 항목입니다.'),
	name: z.string().min(1, '이름은 필수 입력 항목입니다.'),
	email: z.string().min(1, '이메일은 필수 입력 항목입니다.'),
	phone: z.string().min(1, '전화번호는 필수 입력 항목입니다.').nullish(),
	avatarUrl: z.string().min(1, '아바타 URL은 필수 입력 항목입니다.').nullish(),
});

export type UserInsert = z.infer<typeof userInsertSchema>;

export const userUpdateSchema = userInsertSchema.extend({
	userId: z.string().min(1, '사용자 ID는 필수 입력 항목입니다.'),
});

export type UserUpdate = z.infer<typeof userUpdateSchema>;
