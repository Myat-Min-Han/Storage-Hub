"use client";

import { useRouter } from "next/navigation";

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
}

export default function ProductTabel({
    products
}: { products: Product[] }) {

    const router = useRouter();

    return (
        <table className="bg-white rounded-lg shadow-md w-full">
                    <thead>
                        <tr>
                            <th className="text-left px-6 py-3 font-semibold text-lg">Name</th>
                            <th className="text-left px-6 py-3 font-semibold text-lg">Sku</th>
                            <th className="text-left px-6 py-3 font-semibold text-lg">Price</th>
                            <th className="text-left px-6 py-3 font-semibold text-lg">Quantity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                       {products.map(product => {
                        return (
                            <tr 
                                key={product.id} 
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={_ => router.push(`/inventory/${product.id}`)}
                            >
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">{product.sku}</td>
                                <td className="px-6 py-4">{product.price}</td>
                                <td className="px-6 py-4">{product.quantity}</td>
                            </tr>
                        )
                       })}
                    </tbody>
        </table>
    )
}