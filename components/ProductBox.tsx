"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdatedProduct, updateProduct, removeProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner"

type Product = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    sku: string;
    userId: string;
    createdAt: string;
};

type ProductFormValues = {
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

export default function ProductBox({ product }: { product: Product }) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const router = useRouter();

  const { register, handleSubmit } = useForm<ProductFormValues>({
    defaultValues: {
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity,
    },
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    const diff: UpdatedProduct = { id: product.id };
    if (data.name !== product.name) diff.name = data.name;
    if (data.sku !== product.sku) diff.sku = data.sku;
    if (Number(data.price) !== product.price) diff.price = Number(data.price);
    if (Number(data.quantity) !== product.quantity)
      diff.quantity = Number(data.quantity);

    if (Object.keys(diff).length > 1) {
      await updateProduct(diff);
      toast.success("Successfully edited")
      Object.assign(product, diff);
    }

    setIsEditMode(false);
  };

  const handleDelete = async () => {
    await removeProduct(product.id);
    toast.success("Successfully deleted")
    setIsEditMode(false);
    router.push("/inventory");
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">Name</span>
              {isEditMode ? (
                <Input {...register("name", { required: true })} className="ml-4"/>
              ) : (
                <span className="text-gray-900">{product.name}</span>
              )}
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">SKU</span>
              {isEditMode ? (
                <Input {...register("sku", { required: true })} className="ml-4"/>
              ) : (
                <span className="text-gray-900">{product.sku}</span>
              )}
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-600">Price</span>
              {isEditMode ? (
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  className="ml-4"
                  {...register("price", { required: true, min: 0.01 })}
                />
              ) : (
                <span className="text-green-600 font-medium">
                  ${product.price}
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Quantity</span>
              {isEditMode ? (
                <Input
                  type="number"
                  min="0"
                  className="ml-4"
                  {...register("quantity", { required: true, min: 0 })}
                />
              ) : (
                <span className="text-gray-900">{product.quantity}</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)}>Edit</Button>
            )}
            {isEditMode && (
              <>
                <Button type="submit" variant="default">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </Button>
              </>
            )}
            {!isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowAlert(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </form>
      </div>

      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <p className="text-sm text-gray-600">
              This process cannot be undone.
            </p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setShowAlert(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}