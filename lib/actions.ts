"use server";

import db from "@/src";
import { productsTable } from "@/src/db/schema";
import { eq, sql} from "drizzle-orm";

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

export async function last6daysProducts() {
  const results = await db
                    .select({
                      day: sql<string>`TO_CHAR(${productsTable.createdAt}, 'Dy')`,
                      count: sql<number>`COUNT(*)`,
                    })
                    .from(productsTable)
                    .where(sql`${productsTable.createdAt} >= CURRENT_DATE - interval '6 days'`)
                    .groupBy(sql`DATE(${productsTable.createdAt})`)
                    .orderBy(sql`DATE(${productsTable.createdAt})`)

  const chartData = results.map((row) => {
    return {
      day: row.day.trim(),
      product: row.count,
    }
  });
  return chartData;
}

export async function getDailyStatus() {
  const todayProducts = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.createdAt} >= CURRENT_DATE`);

  const yesterdayProducts = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.createdAt} >= CURRENT_DATE - interval '1 day'
                AND ${productsTable.createdAt} < CURRENT_DATE`);

  return {
    products: {
      current: todayProducts.length,
      previous: yesterdayProducts.length,
    },
    value: {
      current: todayProducts.reduce((a, p) => a + p.price, 0),
      previous: yesterdayProducts.reduce((a, p) => a + p.price, 0),
    },
    low: {
      current: todayProducts.filter(p => p.quantity <= 5).length,
      previous: yesterdayProducts.filter(p => p.quantity <= 5).length,
    },
  };
}

export async function getMonthlyStatus() {
    // This month → all dates >= first day of this month
  const thisMonthProducts = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.createdAt} >= date_trunc('month', CURRENT_DATE)`);

    // Last month → between first day of last month and first day of this month
  const lastMonthProducts = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.createdAt} >= date_trunc('month', CURRENT_DATE - interval '1 month')
                AND ${productsTable.createdAt} < date_trunc('month', CURRENT_DATE)`);

  return {
    products: {
      current: thisMonthProducts.length,
      previous: lastMonthProducts.length,
    },
    value: {
      current: thisMonthProducts.reduce((a, p) => a + p.price, 0),
      previous: lastMonthProducts.reduce((a, p) => a + p.price, 0),
    },
    low: {
      current: thisMonthProducts.filter(p => p.quantity <= 5).length,
      previous: lastMonthProducts.filter(p => p.quantity <= 5).length,
    },
  };
}

export async function getYearlyStatus() {
    // This year → all dates >= first day of this year
  const thisYearProducts = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.createdAt} >= date_trunc('year', CURRENT_DATE)`);

    // Last year → between first day of last year and first day of this year
  const lastYearProducts = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.createdAt} >= date_trunc('year', CURRENT_DATE - interval '1 year')
                AND ${productsTable.createdAt} < date_trunc('year', CURRENT_DATE)`);

  return {
    products: {
      current: thisYearProducts.length,
      previous: lastYearProducts.length,
    },
    value: {
      current: thisYearProducts.reduce((a, p) => a + p.price, 0),
      previous: lastYearProducts.reduce((a, p) => a + p.price, 0),
    },
    low: {
      current: thisYearProducts.filter(p => p.quantity <= 5).length,
      previous: lastYearProducts.filter(p => p.quantity <= 5).length,
    },
  };
};


 