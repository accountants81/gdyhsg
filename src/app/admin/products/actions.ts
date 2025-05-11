
"use server";

import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
// In a real app, you'd interact with a database here.
// For this demo, we might manipulate an in-memory store or just log.

// Placeholder for actual data store (e.g., in-memory array or database client)
let productsStore: Product[] = []; // Initialize with MOCK_PRODUCTS if needed

export async function addProductAction(formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const newProduct: Product = {
      id: `prod_${Date.now()}`, // Simple ID generation
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string || 'https://picsum.photos/seed/new_product/400/400', // Default or handle upload
      categorySlug: formData.get('categorySlug') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };

    // Validate newProduct data (e.g., using Zod)

    // Simulate saving to data store
    productsStore.push(newProduct);
    console.log("Product added:", newProduct);

    revalidatePath('/admin/products'); // Revalidate product list page
    revalidatePath('/'); // Revalidate homepage if products are shown there

    return { success: true, message: "تمت إضافة المنتج بنجاح!", product: newProduct };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, message: "حدث خطأ أثناء إضافة المنتج." };
  }
}

export async function updateProductAction(productId: string, formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const productIndex = productsStore.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return { success: false, message: "المنتج غير موجود." };
    }

    const updatedProductData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string || productsStore[productIndex].imageUrl,
      categorySlug: formData.get('categorySlug') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };
    
    // Validate updatedProductData

    productsStore[productIndex] = { ...productsStore[productIndex], ...updatedProductData };
    console.log("Product updated:", productsStore[productIndex]);
    
    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/products/edit/${productId}`);
    revalidatePath(`/products/${productId}`); // If there's a product detail page
    revalidatePath('/');

    return { success: true, message: "تم تحديث المنتج بنجاح!", product: productsStore[productIndex] };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "حدث خطأ أثناء تحديث المنتج." };
  }
}


export async function deleteProductAction(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate deleting from data store
    const initialLength = productsStore.length;
    productsStore = productsStore.filter(p => p.id !== productId);
    
    if (productsStore.length === initialLength) {
        // For demo, if MOCK_PRODUCTS is used and not updated in this store
        console.warn("Product not found in mutable store, assuming deleted from source if applicable.");
    }

    console.log("Product deleted, ID:", productId);
    
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true, message: "تم حذف المنتج بنجاح." };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "حدث خطأ أثناء حذف المنتج." };
  }
}
