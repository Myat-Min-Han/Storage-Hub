import AddFormBox from "@/components/AddFormBox";
import { stackServerApp } from "@/stack/server";

export default async function AddProductPage() {
    await stackServerApp.getUser({ or: 'redirect' })
    return (
        <section className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-semibold text-gray-700">Add Product To Storage</h1>
            <AddFormBox />
        </section>
    )
}