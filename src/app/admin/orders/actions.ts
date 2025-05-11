"use server";

import { revalidatePath } from 'next/cache';
import type { Order } from '@/lib/types';
import { getMockOrders, getMockOrderById, updateMockOrderStatus as updateStoreOrderStatus } from '@/data/orders';
import { ORDER_STATUSES_AR } from '@/lib/constants';

export async function getAllOrdersAdminAction(): Promise<Order[]> {
  return getMockOrders();
}

export async function getOrderByIdAdminAction(orderId: string): Promise<Order | undefined> {
  return getMockOrderById(orderId);
}

export async function updateOrderStatusAdminAction(orderId: string, newStatus: Order['status']): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    if (!Object.keys(ORDER_STATUSES_AR).includes(newStatus)) {
        return { success: false, message: "حالة الطلب المحددة غير صالحة." };
    }

    const updatedOrder = updateStoreOrderStatus(orderId, newStatus);
    if (!updatedOrder) {
      return { success: false, message: "لم يتم العثور على الطلب." };
    }
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/view/${orderId}`); 
    revalidatePath('/track-order'); 
    revalidatePath(`/profile/orders`); // If user has an order history page

    return { success: true, message: "تم تحديث حالة الطلب بنجاح.", order: updatedOrder };
  } catch (error) {
    console.error("Error updating order status:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ: ${errorMessage}` };
  }
}
