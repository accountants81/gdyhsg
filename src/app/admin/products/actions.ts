
"use server";

import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/data/products'; // Import mock products

// Initialize productsStore with a mutable copy of MOCK_PRODUCTS
// This allows actions to modify the list in memory for demo purposes.
let productsStore: Product[] = [...MOCK_PRODUCTS.map(p => ({...p, imageUrls: [...p.imageUrls]}))];

export async function getProductById(productId: string): Promise<Product | undefined> {
  return productsStore.find(p => p.id === productId);
}

export async function addProductAction(formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const mainImageUrl = formData.get('mainImageUrl') as string;
    const otherImageUrlsString = formData.get('otherImageUrls') as string;
    
    let imageUrls: string[] = [];
    if (mainImageUrl) {
      imageUrls.push(mainImageUrl);
    }
    if (otherImageUrlsString) {
      imageUrls.push(...otherImageUrlsString.split(',').map(url => url.trim()).filter(url => url));
    }
    if (imageUrls.length === 0) {
        imageUrls.push('https://picsum.photos/seed/new_product_placeholder/400/400'); // Default placeholder
    }
    
    // Limit to 5 images
    imageUrls = imageUrls.slice(0, 5);


    const newProduct: Product = {
      id: `prod_${Date.now()}`, // Simple ID generation
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrls: imageUrls,
      categorySlug: formData.get('categorySlug') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };

    // Basic validation (can be expanded with Zod)
    if (!newProduct.name || !newProduct.price || !newProduct.categorySlug || isNaN(newProduct.stock)) {
        return { success: false, message: "بيانات المنتج غير كاملة أو غير صالحة." };
    }


    productsStore.push(newProduct);
    console.log("Product added:", newProduct);

    revalidatePath('/admin/products'); 
    revalidatePath('/'); 

    return { success: true, message: "تمت إضافة المنتج بنجاح!", product: newProduct };
  } catch (error) {
    console.error("Error adding product:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء إضافة المنتج: ${errorMessage}` };
  }
}

export async function updateProductAction(productId: string, formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const productIndex = productsStore.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return { success: false, message: "المنتج غير موجود." };
    }

    const mainImageUrl = formData.get('mainImageUrl') as string;
    const otherImageUrlsString = formData.get('otherImageUrls') as string;

    let imageUrls: string[] = [];
    if (mainImageUrl) {
      imageUrls.push(mainImageUrl);
    }
    if (otherImageUrlsString) {
      imageUrls.push(...otherImageUrlsString.split(',').map(url => url.trim()).filter(url => url));
    }
    
    // If no new URLs provided, keep existing ones. If new ones are provided, use them.
    // If new ones are empty string, it means user wants to clear them.
    if (imageUrls.length === 0 && productsStore[productIndex].imageUrls.length > 0 && !mainImageUrl && !otherImageUrlsString) {
      // No new image URLs provided, keep the old ones.
      imageUrls = [...productsStore[productIndex].imageUrls];
    } else if (imageUrls.length === 0) {
      // New image URLs are empty or not provided, and old ones might be empty. Use placeholder.
      imageUrls.push('https://picsum.photos/seed/updated_product_placeholder/400/400');
    }

    // Limit to 5 images
    imageUrls = imageUrls.slice(0, 5);

    const updatedProductData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrls: imageUrls,
      categorySlug: formData.get('categorySlug') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };
    
    if (!updatedProductData.name || !updatedProductData.price || !updatedProductData.categorySlug || isNaN(updatedProductData.stock)) {
        return { success: false, message: "بيانات المنتج المحدثة غير كاملة أو غير صالحة." };
    }

    productsStore[productIndex] = { ...productsStore[productIndex], ...updatedProductData };
    console.log("Product updated:", productsStore[productIndex]);
    
    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/products/edit/${productId}`);
    revalidatePath(`/products/${productId}`); 
    revalidatePath('/');

    return { success: true, message: "تم تحديث المنتج بنجاح!", product: productsStore[productIndex] };
  } catch (error) {
    console.error("Error updating product:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء تحديث المنتج: ${errorMessage}` };
  }
}


export async function deleteProductAction(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const initialLength = productsStore.length;
    productsStore = productsStore.filter(p => p.id !== productId);
    
    if (productsStore.length === initialLength) {
        console.warn("Product not found in mutable store with ID:", productId);
        return { success: false, message: "المنتج غير موجود ليتم حذفه." };
    }

    console.log("Product deleted, ID:", productId);
    
    revalidatePath('/admin/products');
    revalidatePath('/');

    return { success: true, message: "تم حذف المنتج بنجاح." };
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء حذف المنتج: ${errorMessage}` };
  }
}
