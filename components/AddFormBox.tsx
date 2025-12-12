"use client";

import { addNewProduct } from "@/lib/actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

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
        toast.success("Successfully added a product")
        router.push('/inventory');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[500px] mt-4" >
                <span className="flex flex-col mb-5">
                    <label htmlFor="name">Name</label>
                    <Input 
                        type="text" 
                        id="name"  
                        {...register("name", { required: true })}
                    />
                    {errors.name && <span className="text-red-600">This field is required</span>}
                </span>
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <span className="flex flex-col">
                        <label htmlFor="quantity">Quantity</label>
                        <Input 
                            type="number" 
                            id="quantity" 
                            min="0" 
                            {...register("quantity", { required: true, min: 0 })}
                        />
                        {errors.quantity && <span className="text-red-600">This field is required</span>}
                    </span>
                    <span className="flex flex-col">
                        <label htmlFor="price">Price</label>
                        <Input 
                            type="number" 
                            id="price" 
                            placeholder="0.00" 
                            step="0.01" 
                            min="0"
                            {...register("price", { required: true, min: 0.01 })}
                        />
                        {errors.price && <span className="text-red-600">This field is required</span>}
                    </span>
                </div>
                <span className="flex flex-col mb-5">
                        <label htmlFor="sku">Sku</label>
                        <Input 
                            type="text" 
                            id="sku" 
                            {...register("sku", {required: true})}
                        />
                        {errors.sku && <span className="text-red-600">This field is required</span>}
                </span>
                <span className="flex gap-3">
                    <Button type="submit">Add</Button>
                    <Button variant="outline" type="button" onClick={() => router.push("/inventory")}>Cancel</Button>
                </span>
        </form>
    )
}