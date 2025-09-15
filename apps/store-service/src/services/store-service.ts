import { DrizzleD1Database } from 'drizzle-orm/d1';

export class StoreService {
	constructor(private db: DrizzleD1Database) {}
}
