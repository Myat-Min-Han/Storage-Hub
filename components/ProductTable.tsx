"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    createdAt: Date
}

export default function ProductTabel({
    products
}: { products: Product[] }) {

    const router = useRouter();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Sku</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id} onClick={() => router.push(`/inventory/${product.id}`)} className="cursor-pointer">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="text-right">{product.price}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}