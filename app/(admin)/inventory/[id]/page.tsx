import db from "@/src";
import { productsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import ProductBox from "@/components/ProductBox";
import { stackServerApp } from "@/stack/server";

export type Product = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    sku: string;
    userId: string;
    createdAt: string;
}

export default async function ProductPage({
    params,
}: { params: Promise<{ id: string }> }) {

    await stackServerApp.getUser({ or: 'redirect' });

    const id: number = parseInt((await params).id);
    const [ product ] = await db.select().from(productsTable).where(eq(productsTable.id, id));

    return (
        <section className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
            <ProductBox product={product} />
        </section>
    )
}