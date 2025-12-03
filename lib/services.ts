import db from "@/src";
import { productsTable } from "@/src/db/schema";
import { sql } from "drizzle-orm";

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

export const getTrend = (currentNumber: number, previosNumber: number) => {
        const diff: number = currentNumber - previosNumber;
        return {
            diff,
            isUp: diff > 0,
            isDown: diff < 0
        }
};

const getLastFiveWeeksLabels = () => {
        const weeks: { week: string; products: number }[] = [];
        const today = new Date(); // get today's date

        for (let i = 4; i >= 0; i--) {
            const d = new Date(today);  // create a copy of today's date
            d.setDate(d.getDate() - i * 7); // go back i weeks
            const startOfWeek = new Date(d); // create a copy to find the start of the week
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // set to Monday
            weeks.push({
                week: startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                products: 0,
            }); 
        }
        return weeks;
};

export const getWeeklyProducts = async () => {
        const dbResults = await db.select({
            week: sql<string>`DATE_TRUNC('week', ${productsTable.createdAt})`,
            count: sql<number>`COUNT(*)`,
        })
        .from(productsTable)
        .where(sql`${productsTable.createdAt} >= NOW() - interval '4 weeks'`)
        .groupBy(sql`DATE_TRUNC('week', ${productsTable.createdAt})`)
        .orderBy(sql`DATE_TRUNC('week', ${productsTable.createdAt})`);
        
        const formatted = dbResults.map(r => ({
            week: new Date(r.week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            products: Number(r.count),
        }));

        const weeks = getLastFiveWeeksLabels(); // get last five weeks with zero products
        return weeks.map(w => {
            const found = formatted.find(f => f.week === w.week);
            return found ? found : w;
        });
    };



