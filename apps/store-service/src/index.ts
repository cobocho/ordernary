import { WorkerEntrypoint } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { StoreService } from './services/store-service';
import { StoreInsert, StoreUpdate } from './db/schema';
import { StoreMemberService } from './services/store-member-service';

interface Env {
	STORE_DB: D1Database;
}

class StoreServiceWorker extends WorkerEntrypoint<Env> {
	private storeService: StoreService;

	private storeMemberService: StoreMemberService;

	private db = drizzle(this.env.STORE_DB);

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		this.storeService = new StoreService(this.db);
		this.storeMemberService = new StoreMemberService(this.db);
	}

	async fetch() {
		return Response.json({
			message: 'Store Service is running',
			version: '1.0.0',
			status: 'healthy',
		});
	}

	async getUsersStores(userId: string) {
		const usersStores = await this.storeMemberService.getStoreMembers(userId);

		const storesList = await this.storeService.getStoresByIds(
			usersStores.map((storeMember) => storeMember.storeId),
		);

		const merged = usersStores.map((storeMember) => {
			const store = storesList.find(
				(store) => store.storeId === storeMember.storeId,
			);
			return {
				memberInfo: storeMember,
				storeInfo: store,
			};
		});

		return merged;
	}

	async updateStore(store: StoreUpdate) {
		return this.storeService.updateStore(store);
	}

	async createStore(store: StoreInsert) {
		return this.storeService.createStore(store);
	}

	async getStore(storeId: string) {
		return this.storeService.getStore(storeId);
	}

	async deleteStore(storeId: string) {
		return this.storeService.deleteStore(storeId);
	}
}

export default StoreServiceWorker;
