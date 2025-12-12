import db from "@/src";
import { productsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import ProductBox from "@/components/ProductBox";
import { stackServerApp } from "@/stack/server";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: { params: Promise<{ id: string }>}): Promise<Metadata> {
    const id: number = parseInt((await params).id);
    const [ product ] = await db.select().from(productsTable).where(eq(productsTable.id, id));

    return {
        title: product.name
    }
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