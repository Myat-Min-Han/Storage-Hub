import { pgTable, unique, integer, varchar, real, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "products_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 20 }).notNull(),
	quantity: integer().default(0),
	price: real().notNull(),
	sku: integer(),
	userId: integer().notNull(),
	createdAt: date(),
}, (table) => [
	unique("products_sku_key").on(table.sku),
]);
