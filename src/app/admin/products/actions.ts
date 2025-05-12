
"use server";

import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/data/products'; // Import mock products
import { generatePlaceholderUrl } from '@/lib/utils'; // Import from utils

// Initialize productsStore with a mutable copy of MOCK_PRODUCTS
// This allows actions to modify the list in memory for demo purposes.
let productsStore: Product[] = MOCK_PRODUCTS.map(p => ({...p, imageUrls: [...p.imageUrls]}));


export async function getProductById(productId: string): Promise<Product | undefined> {
  const product = productsStore.find(p => p.id === productId);
  if (product) {
    return JSON.parse(JSON.stringify(product));
  }
  return undefined;
}

export async function addProductAction(formData: FormData): Promise<{ success: boolean; message: string; product?: Product }> {
  try {
    const imageUrls: string[] = [];

    const mainImageFile = formData.get('mainImageFile') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      imageUrls.push(generatePlaceholderUrl('main'));
    }

    for (let i = 0; i < 4; i++) {
      const otherImageFile = formData.get(`otherImageFile${i}`) as File | null;
      if (otherImageFile && otherImageFile.size > 0) {
        imageUrls.push(generatePlaceholderUrl(`other_${i}`));
      }
    }
    
    if (imageUrls.length === 0) {
        imageUrls.push(generatePlaceholderUrl('default_product')); 
    }
    
    // Limit to 5 images total
    const finalImageUrls = imageUrls.slice(0, 5);

    const newProduct: Product = {
      id: `prod_${Date.now()}`, 
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrls: finalImageUrls,
      categorySlug: formData.get('categorySlug') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };

    if (!newProduct.name || !newProduct.price || !newProduct.categorySlug || isNaN(newProduct.stock)) {
        return { success: false, message: "بيانات المنتج غير كاملة أو غير صالحة." };
    }

    productsStore.push(newProduct);
    console.log("Product added:", newProduct);

    revalidatePath('/admin/products'); 
    revalidatePath('/'); 
    revalidatePath(`/category/${newProduct.categorySlug}`);

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
    const existingProduct = productsStore[productIndex];
    const newImageUrls: string[] = [];

    // Main image
    const mainImageFile = formData.get('mainImageFile') as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      newImageUrls.push(generatePlaceholderUrl('main_updated'));
    } else if (existingProduct.imageUrls[0]) {
      newImageUrls.push(existingProduct.imageUrls[0]);
    }

    // Other images (up to 4)
    for (let i = 0; i < 4; i++) {
      if (newImageUrls.length >= 5) break; // Max 5 images total
      const otherImageFile = formData.get(`otherImageFile${i}`) as File | null;
      const existingOtherImageIndex = i + 1; // existingProduct.imageUrls[0] is main, [1] is other0, etc.

      if (otherImageFile && otherImageFile.size > 0) {
        newImageUrls.push(generatePlaceholderUrl(`other_updated_${i}`));
      } else if (existingProduct.imageUrls[existingOtherImageIndex]) {
        newImageUrls.push(existingProduct.imageUrls[existingOtherImageIndex]);
      }
    }
    
    if (newImageUrls.length === 0) {
      newImageUrls.push(generatePlaceholderUrl('default_updated_product'));
    }

    const finalImageUrls = newImageUrls.slice(0, 5);

    const updatedProductData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrls: finalImageUrls,
      categorySlug: formData.get('categorySlug') as string,
      stock: parseInt(formData.get('stock') as string, 10),
    };
    
    if (!updatedProductData.name || !updatedProductData.price || !updatedProductData.categorySlug || isNaN(updatedProductData.stock)) {
        return { success: false, message: "بيانات المنتج المحدثة غير كاملة أو غير صالحة." };
    }

    productsStore[productIndex] = { ...existingProduct, ...updatedProductData };
    console.log("Product updated:", productsStore[productIndex]);
    
    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/products/edit/${productId}`);
    revalidatePath(`/products/${productId}`); 
    revalidatePath('/');
    revalidatePath(`/category/${updatedProductData.categorySlug}`);
    if (existingProduct.categorySlug !== updatedProductData.categorySlug) {
        revalidatePath(`/category/${existingProduct.categorySlug}`); 
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
    revalidatePath(`/products/${productId}`); 
    revalidatePath(`/category/${categorySlug}`);

    return { success: true, message: "تم حذف المنتج بنجاح." };
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء حذف المنتج: ${errorMessage}` };
  }
}

export async function getAllProducts(): Promise<Product[]> {
  return Promise.resolve(productsStore.map(p => JSON.parse(JSON.stringify(p))));
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return Promise.resolve(productsStore.filter(p => p.categorySlug === categorySlug).map(p => JSON.parse(JSON.stringify(p))));
}
