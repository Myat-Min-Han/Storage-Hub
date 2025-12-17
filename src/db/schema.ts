import { integer, pgTable, varchar, date, real, uuid, timestamp } from "drizzle-orm/pg-core"

export const productsTable = pgTable("products", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 200 }).notNull(),
    quantity: integer().default(0).notNull(),
    price: real().notNull(),
    sku: varchar({ length: 10 }).unique().notNull(),
    userId: uuid().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull()
});