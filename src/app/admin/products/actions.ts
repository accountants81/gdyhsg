
"use server";

import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/data/products'; // Import mock products

// Initialize productsStore with a mutable copy of MOCK_PRODUCTS
// This allows actions to modify the list in memory for demo purposes.
let productsStore: Product[] = MOCK_PRODUCTS.map(p => ({...p, imageUrls: [...p.imageUrls]}));

export async function getProductById(productId: string): Promise<Product | undefined> {
  const product = productsStore.find(p => p.id === productId);
  if (product) {
    // Return a deep copy to prevent accidental mutation of the store if needed elsewhere
    // and to ensure consistent data structure, especially for imageUrls.
    return JSON.parse(JSON.stringify(product));
  }
  return undefined;
}

export async function addProductAction(formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const mainImageUrl = formData.get('mainImageUrl') as string;
    const otherImageUrlsString = formData.get('otherImageUrls') as string;
    
    let imageUrls: string[] = [];
    if (mainImageUrl && mainImageUrl.trim()) {
      imageUrls.push(mainImageUrl.trim());
    }
    if (otherImageUrlsString) {
      imageUrls.push(...otherImageUrlsString.split(',').map(url => url.trim()).filter(url => url));
    }
    if (imageUrls.length === 0) {
        imageUrls.push('https://picsum.photos/seed/new_product/400/400'); // Default placeholder
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
    revalidatePath(`/category/${newProduct.categorySlug}`);
    // No need to revalidate product detail page for a new product

    return { success: true, message: "تمت إضافة المنتج بنجاح!", product: JSON.parse(JSON.stringify(newProduct)) };
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
    if (mainImageUrl && mainImageUrl.trim()) {
      imageUrls.push(mainImageUrl.trim());
    }
    if (otherImageUrlsString) {
      imageUrls.push(...otherImageUrlsString.split(',').map(url => url.trim()).filter(url => url));
    }
    
    // If no new URLs provided via form fields (mainImageUrl and otherImageUrlsString are empty/whitespace), keep existing ones.
    if (imageUrls.length === 0 && productsStore[productIndex].imageUrls.length > 0 && !(mainImageUrl && mainImageUrl.trim()) && !otherImageUrlsString) {
      imageUrls = [...productsStore[productIndex].imageUrls];
    } else if (imageUrls.length === 0) {
      // New image URLs are empty or not provided, and old ones might be empty or user cleared them. Use placeholder.
      imageUrls.push('https://picsum.photos/seed/updated_product/400/400');
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
    revalidatePath(`/category/${updatedProductData.categorySlug}`);
    if (productsStore[productIndex].categorySlug !== updatedProductData.categorySlug) {
        revalidatePath(`/category/${productsStore[productIndex].categorySlug}`); // Revalidate old category too
    }


    return { success: true, message: "تم تحديث المنتج بنجاح!", product: JSON.parse(JSON.stringify(productsStore[productIndex])) };
  } catch (error) {
    console.error("Error updating product:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء تحديث المنتج: ${errorMessage}` };
  }
}


export async function deleteProductAction(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const productToDelete = productsStore.find(p => p.id === productId);
    if (!productToDelete) {
        console.warn("Product not found in mutable store with ID:", productId);
        return { success: false, message: "المنتج غير موجود ليتم حذفه." };
    }
    const categorySlug = productToDelete.categorySlug;

    productsStore = productsStore.filter(p => p.id !== productId);
    
    console.log("Product deleted, ID:", productId);
    
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath(`/products/${productId}`); // To show notFound page or similar
    revalidatePath(`/category/${categorySlug}`);


    return { success: true, message: "تم حذف المنتج بنجاح." };
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء حذف المنتج: ${errorMessage}` };
  }
}

// Helper to get all products for public display, ensuring they are read from the current state of productsStore
export async function getAllProducts(): Promise<Product[]> {
  return Promise.resolve(productsStore.map(p => JSON.parse(JSON.stringify(p))));
}

// Helper to get products by category for public display
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return Promise.resolve(productsStore.filter(p => p.categorySlug === categorySlug).map(p => JSON.parse(JSON.stringify(p))));
}
