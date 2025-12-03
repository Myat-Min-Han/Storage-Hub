"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { UpdatedProduct, updateProduct } from "@/lib/actions";
import { Product } from "@/app/(admin)/inventory/[id]/page";
import { removeProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";

type ProductFormValues = {
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

function AlertBox({
    onConfirm,
    onCancel
}: {
    onConfirm: () => void,
    onCancel: () => void
}) {
    return (
        <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
            <h1 className="text-xl font-semibold text-gray-900">Are you sure?</h1>
            <small className="text-gray-600">This process cannot be undone</small>
            <div className="mt-4 flex gap-3">
                <button 
                    className="px-4 py-2 bg-red-600 rounded-md text-white"
                    onClick={onConfirm}
                >
                    Delete
                </button>
                <button 
                    className="px-4 py-2 border rounded-md"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default function ProductBox({ product }: { product: Product }) {
    const [ isEditMode, setIsEditMode ] = useState<boolean>(false);
    const [ showAlert, setShowAlert ] = useState<boolean>(false);
    const router = useRouter();

    const { register, handleSubmit } = useForm<ProductFormValues>({
        defaultValues: {
            name: product.name,
            sku: product.sku,
            price: product.price,
            quantity: product.quantity
        }
    });

    const onSubmit: SubmitHandler<ProductFormValues> = async (data: ProductFormValues) => {
        const diff: UpdatedProduct = { id: product.id };
        if (data.name !== product.name) diff.name = data.name;
        if (data.sku !== product.sku) diff.sku = data.sku;
        if (Number(data.price) !== product.price) diff.price = Number(data.price);
        if (Number(data.quantity) !== product.quantity) diff.quantity = Number(data.quantity);

        if (Object.keys(diff).length > 1) {
            await updateProduct(diff);
            Object.assign(product, diff);
        }

        setIsEditMode(false);
    };

    const handleDelete = async () => {
        await removeProduct(product.id);
        setIsEditMode(false);
        router.push("/inventory")
    }

    return (
        <>
        <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">Name</span>
                        {
                            isEditMode 
                                ? <input 
                                    className="px-3 py-1 border rounded-md"
                                    type="text"
                                    {...register("name", { required: true })}
                                />
                                : <span className="text-gray-900">{product.name}</span> 
                        }
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">SKU</span>
                        {
                            isEditMode 
                                ? <input 
                                    className="px-3 py-1 border rounded-md"
                                    type="text"
                                    {...register("sku", { required: true })}
                                />
                                : <span className="text-gray-900">{product.sku}</span> 
                        }
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold text-gray-600">Price</span>
                        {
                            isEditMode 
                                ? <input 
                                    className="px-3 py-1 border rounded-md"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...register("price", { required: true, min: 0.01 })}
                                />
                                : <span className="text-green-600 font-medium">
                                    ${product.price}
                                </span>
                        }
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Quantity</span>
                        {
                            isEditMode 
                                ? <input 
                                    className="px-3 py-1 border rounded-md"
                                    type="number"
                                    min="0"
                                    {...register("quantity", { required: true, min: 0 })}
                                />
                                : <span className="text-gray-900">{product.quantity}</span> 
                        }
                    </div>
                </div>
                <div className="mt-6 flex gap-3">
                    {!isEditMode && <button 
                        type="button"
                        className="px-4 py-2 bg-blue-600  text-white rounded-md"
                        onClick={() => setIsEditMode(true)}
                    >
                        Edit
                    </button>}
                    { isEditMode && (
                        <>
                            <button className="px-4 py-2 border rounded-md bg-green-600 text-white" type="submit">
                                Save
                            </button>
                            <button className="px-4 py-2 border rounded-md" 
                                onClick={() => setIsEditMode(false)}
                            >
                                Cancel
                            </button>
                        </>
                        )
                    }
                    { !isEditMode && <button 
                        className="px-4 py-2 bg-red-600 rounded-md text-white" 
                        type="button" 
                        onClick={() => setShowAlert(true)}
                    >
                        Delete    
                    </button>}
                </div>
            </form>
        </div>
        { showAlert && <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
            <AlertBox onConfirm={handleDelete} onCancel={() => setIsEditMode(false)}/>
        </div> }
        </>
    )
}