"use server";

import db from "@/src";
import { productsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";

type NewProduct = {
    name: string;
    quantity: number;
    price: number;
    sku: string;
    userId: string;
};

export type UpdatedProduct = {
    id: number;
    name?: string;
    quantity?: number;
    price?: number;
    sku?: string;
}

export async function addNewProduct(newProductData: NewProduct) {
    const { name, quantity, price, sku, userId } = newProductData;
    await db.insert(productsTable).values({
        name,
        quantity,
        price,
        sku,
        userId
    });
};

export async function updateProduct(updatedProduct: UpdatedProduct) {
    const { id, ...fields } = updatedProduct;
    const updates: Partial<typeof productsTable.$inferInsert> = {};
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            updates[key as keyof typeof updates] = value as any
        }
    }
    if (Object.keys(updates).length === 0) return;
    await db.update(productsTable).set(updates).where(eq(productsTable.id, id));
};

export async function removeProduct(id: number) {
    await db.delete(productsTable).where(eq(productsTable.id, id))
}
 