"use client";

import { addNewProduct } from "@/lib/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { ro } from "@faker-js/faker";

type NewProductInputs = {
    name: string
    quantity: number;
    price: number;
    sku: string;
}

export default function AddFormBox() {

    const { register, handleSubmit, formState: { errors } } = useForm<NewProductInputs>();
    const user = useUser({ or: "redirect"});
    const router = useRouter();

    const onSubmit: SubmitHandler<NewProductInputs> = async (data: NewProductInputs) => {
        const newProductData = {
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            sku: data.sku,
            userId: user?.id!
        };

        await addNewProduct(newProductData);
        router.push('/inventory');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[500px] mt-4" >
                <span className="flex flex-col mb-5">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name"  
                        className="px-3 py-2 rounded-lg border-2 border-black focus:border-blue-600 focus:outline-none"
                        {...register("name", { required: true })}
                    />
                    {errors.name && <span className="text-red-600">This field is required</span>}
                </span>
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <span className="flex flex-col">
                        <label htmlFor="quantity">Quantity</label>
                        <input 
                            type="number" 
                            id="quantity" 
                            min="0" 
                            className="px-3 py-2 rounded-lg border-2 border-black focus:border-blue-600 focus:outline-none"
                            {...register("quantity", { required: true, min: 0 })}
                        />
                        {errors.quantity && <span className="text-red-600">This field is required</span>}
                    </span>
                    <span className="flex flex-col">
                        <label htmlFor="price">Price</label>
                        <input 
                            type="number" 
                            id="price" 
                            placeholder="0.00" 
                            step="0.01" 
                            min="0"
                            className="px-3 py-2 rounded-lg border-2 border-black focus:border-blue-600 focus:outline-none"
                            {...register("price", { required: true, min: 0.01 })}
                        />
                        {errors.price && <span className="text-red-600">This field is required</span>}
                    </span>
                </div>
                <span className="flex flex-col mb-5">
                        <label htmlFor="sku">Sku</label>
                        <input 
                            type="text" 
                            id="sku" 
                            className="px-3 py-2 rounded-lg border-2 border-black focus:border-blue-600 focus:outline-none"
                            {...register("sku", {required: true})}
                        />
                        {errors.sku && <span className="text-red-600">This field is required</span>}
                </span>
                <span className="flex flex-col">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:cursor-pointer w-fit">Add Product</button>
                </span>
        </form>
    )
}