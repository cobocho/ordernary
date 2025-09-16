import { DrizzleD1Database } from 'drizzle-orm/d1';
import {
	StoreInsert,
	StoreLockReason,
	stores,
	StoreState,
	StoreUpdate,
} from '../db/schema';
import { eq, inArray } from 'drizzle-orm';

export class StoreService {
	constructor(private db: DrizzleD1Database) {}

	async createStore(store: StoreInsert) {
		const [newStore] = await this.db.insert(stores).values(store).returning();

		return newStore;
	}

	async updateStore(store: StoreUpdate) {
		const [updatedStore] = await this.db
			.update(stores)
			.set(store)
			.where(eq(stores.storeId, store.storeId))
			.returning();

		return updatedStore;
	}

	async getStore(storeId: string) {
		const store = await this.db
			.select()
			.from(stores)
			.where(eq(stores.storeId, storeId));
		return store;
	}

	async getStoresByIds(storeIds: string[]) {
		const storesList = await this.db
			.select()
			.from(stores)
			.where(inArray(stores.storeId, storeIds));

		return storesList;
	}

	async deleteStore(storeId: string) {
		await this.db.delete(stores).where(eq(stores.storeId, storeId));
	}

	async setStoreState(storeId: string, state: StoreState) {
		await this.db
			.update(stores)
			.set({ state })
			.where(eq(stores.storeId, storeId));
	}

	async lockStore(storeId: string, lockReason: StoreLockReason) {
		await this.db
			.update(stores)
			.set({ isLocked: true, lockReason })
			.where(eq(stores.storeId, storeId));
	}

	async unlockStore(storeId: string) {
		await this.db
			.update(stores)
			.set({ isLocked: false, lockReason: null })
			.where(eq(stores.storeId, storeId));
	}
}
