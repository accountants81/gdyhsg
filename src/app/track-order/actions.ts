"use server";

import type { Order } from '@/lib/types';
import { getMockOrderById } from '@/data/orders';

export async function findOrderByIdAction(orderId: string, verificationDetail: string): Promise<{ success: boolean; order?: Order; message?: string }> {
    if (!orderId || !verificationDetail) {
        return { success: false, message: "الرجاء إدخال رقم الطلب وتفاصيل التحقق (رقم الهاتف أو البريد الإلكتروني)." };
    }
    const order = getMockOrderById(orderId.trim());

    if (!order) {
        return { success: false, message: "لم يتم العثور على طلب بهذا الرقم." };
    }

    const trimmedVerificationDetail = verificationDetail.trim().toLowerCase();
    const emailMatches = order.customerDetails.email?.toLowerCase() === trimmedVerificationDetail;
    const phoneMatches = order.customerDetails.phone === trimmedVerificationDetail || (order.customerDetails.alternatePhone && order.customerDetails.alternatePhone === trimmedVerificationDetail);

    if (emailMatches || phoneMatches) {
        return { success: true, order };
    } else {
        return { success: false, message: "تفاصيل التحقق (رقم الهاتف أو البريد الإلكتروني) غير متطابقة مع الطلب. يرجى التأكد من البيانات والمحاولة مرة أخرى." };
    }
}
