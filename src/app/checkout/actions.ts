"use server";

import { revalidatePath } from 'next/cache';
import type { Order, CartItem } from '@/lib/types';
import { addMockOrder } from '@/data/orders'; 
import { EGYPTIAN_GOVERNORATES, PAYMENT_METHODS_AR } from '@/lib/constants';

export interface CreateOrderInput {
    userId: string | null;
    customerName: string;
    customerPhone: string;
    customerAlternatePhone?: string;
    customerAddress: string;
    customerLandmark?: string;
    customerEmail?: string;
    customerGovernorate: string;
    paymentMethod: Order['paymentMethod'];
    cartItems: CartItem[];
}

export async function createOrderAction(input: CreateOrderInput): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    if (!input.customerName || !input.customerPhone || !input.customerAddress || !input.customerGovernorate || !input.paymentMethod || input.cartItems.length === 0) {
      return { success: false, message: "بيانات الطلب غير كاملة. يرجى ملء جميع الحقول الإلزامية." };
    }
    if (!EGYPTIAN_GOVERNORATES.some(g => g.name === input.customerGovernorate)) {
        return { success: false, message: "محافظة الشحن غير مدعومة حاليًا." };
    }
    if (!PAYMENT_METHODS_AR[input.paymentMethod]) {
        return { success: false, message: "طريقة الدفع المختارة غير صالحة." };
    }
     // Validate phone numbers (basic Egyptian format)
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    if (!phoneRegex.test(input.customerPhone)) {
      return { success: false, message: "رقم الهاتف الرئيسي غير صحيح. يجب أن يكون 11 رقمًا ويبدأ بـ 010, 011, 012, أو 015." };
    }
    if (input.customerAlternatePhone && !phoneRegex.test(input.customerAlternatePhone)) {
      return { success: false, message: "رقم الهاتف الاحتياطي غير صحيح. يجب أن يكون 11 رقمًا ويبدأ بـ 010, 011, 012, أو 015." };
    }
    // Basic email validation if provided
    if (input.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail)) {
        return { success: false, message: "الرجاء إدخال عنوان بريد إلكتروني صحيح." };
    }


    const customerDetails = {
        name: input.customerName,
        phone: input.customerPhone,
        alternatePhone: input.customerAlternatePhone || undefined,
        address: input.customerAddress,
        landmark: input.customerLandmark || undefined,
        email: input.customerEmail || undefined,
        governorate: input.customerGovernorate,
    };

    const newOrder = addMockOrder(input.userId, customerDetails, input.cartItems, input.paymentMethod);
    
    revalidatePath('/admin/orders'); 
    revalidatePath('/track-order'); 
    revalidatePath(`/profile/orders`); // If user has an order history page

    return { success: true, message: "تم إنشاء طلبك بنجاح! رقم طلبك هو: " + newOrder.id, order: newOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء إنشاء الطلب: ${errorMessage}` };
  }
}
