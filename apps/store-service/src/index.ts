import { WorkerEntrypoint } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { StoreService } from './services/store-service';

interface Env {
	STORE_DB: D1Database;
}

class StoreServiceWorker extends WorkerEntrypoint<Env> {
	private storeService: StoreService;

	private db = drizzle(this.env.STORE_DB);

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);
		this.storeService = new StoreService(this.db);
	}

	async fetch() {
		return Response.json({
			message: 'Store Service is running',
			version: '1.0.0',
			status: 'healthy',
		});
	}

	async createStore(storeName: string, createdBy: string) {
		// return this.storeService.createStore(storeName, createdBy);
	}

	async getStore(storeId: string) {
		// return this.storeService.getStore(storeId);
	}

	async getUsersStores(userId: string) {
		// return this.storeService.getUsersStores(userId);
	}
}

export default StoreServiceWorker;
