import Link from "next/link";
import { Plus } from "lucide-react";
import db from "@/src";
import { productsTable } from "@/src/db/schema";
import { desc, ilike, count } from "drizzle-orm";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";
import { stackServerApp } from "@/stack/server";
import ProductTabel from "@/components/ProductTable";

export default async function Inventorypage({
    searchParams,
}: { 
    searchParams: Promise<{ n: string, page: string }>
}) {
    await stackServerApp.getUser({ or: 'redirect' });
    const productName = (await searchParams).n;
    const page = parseInt((await searchParams).page) || 1;
    const limit: number = 10; // items per page
    const offset: number = (page - 1) * limit; // items to skip

    let products; 
    if(productName) {
        products = await db.select().from(productsTable).where(ilike(productsTable.name, `%${productName}%`)).limit(limit).offset(offset);
    } else {
        products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt)).limit(limit).offset(offset)
    };

    // count total products
    let totalCountQuery;
    if(productName) {
        totalCountQuery = await db
            .select({ count: count() })
            .from(productsTable)
            .where(ilike(productsTable.name, `%${productName}%`));
    } else {
        totalCountQuery = await db
            .select({ count: count() })
            .from(productsTable);
    }

    const totalCount = Number(totalCountQuery[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    return (
        <section className="bg-gray-50 min-h-screen p-8">
            <Link href="/inventory/add" className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-800 ">
                <Plus className="w-5 h-5 inline-block mr-2"/>
                 Add
            </Link>
            <div className="my-5 ">
                <SearchBox />
            </div>
            <div>
                <ProductTabel products={products}/>
            </div>
            <div>
                <Pagination currentPage={page} totalPages={totalPages}/>
            </div>
        </section>
    )
}