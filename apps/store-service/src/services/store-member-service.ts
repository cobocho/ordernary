import { DrizzleD1Database } from 'drizzle-orm/d1';
import {
	StoreInsert,
	StoreLockReason,
	StoreMemberInsert,
	storeMembers,
	StoreMemberUpdate,
	stores,
	StoreState,
	StoreUpdate,
} from '../db/schema';
import { and, eq } from 'drizzle-orm';

export class StoreMemberService {
	constructor(private db: DrizzleD1Database) {}

	async addStoreMember(storeMember: StoreMemberInsert) {
		const [newStoreMember] = await this.db
			.insert(storeMembers)
			.values(storeMember)
			.returning();
		return newStoreMember;
	}

	async updateStoreMember(storeMember: StoreMemberUpdate) {
		const [updatedStoreMember] = await this.db
			.update(storeMembers)
			.set(storeMember)
			.where(
				and(
					eq(storeMembers.storeId, storeMember.storeId),
					eq(storeMembers.userId, storeMember.userId),
				),
			)
			.returning();
		return updatedStoreMember;
	}

	async getStoreMembers(storeId: string) {
		const currentStoreMembers = await this.db
			.select()
			.from(storeMembers)
			.where(eq(storeMembers.storeId, storeId));
		return currentStoreMembers;
	}

	async deleteStoreMember(storeId: string, userId: string) {
		await this.db
			.delete(storeMembers)
			.where(
				and(eq(storeMembers.storeId, storeId), eq(storeMembers.userId, userId)),
			);

		return true;
	}
}
