"use server";

import { revalidatePath } from 'next/cache';
import type { Message } from '@/lib/types';
import { addMockMessage, getMockMessages, toggleMockMessageReadStatus, deleteMockMessage as deleteDataMessage } from '@/data/messages';

export async function submitContactFormAction(formData: FormData): Promise<{ success: boolean; message: string; messageData?: Message }> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const content = formData.get('content') as string;

    if (!name || !email || !subject || !content) {
      return { success: false, message: "يرجى ملء جميع الحقول المطلوبة." };
    }
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: "الرجاء إدخال عنوان بريد إلكتروني صحيح." };
    }

    const newMessage = addMockMessage({ name, email, subject, content });
    
    revalidatePath('/admin/messages');

    return { success: true, message: "تم إرسال رسالتك بنجاح. شكراً لتواصلك!", messageData: newMessage };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير معروف.";
    return { success: false, message: `حدث خطأ أثناء إرسال الرسالة: ${errorMessage}` };
  }
}

export async function getAllMessagesAction(): Promise<Message[]> {
  return getMockMessages();
}

export async function toggleMessageReadStatusAction(messageId: string): Promise<{ success: boolean; message?: string; updatedMessage?: Message }> {
  const updatedMessage = toggleMockMessageReadStatus(messageId);
  if (updatedMessage) {
    revalidatePath('/admin/messages');
    return { success: true, updatedMessage };
  }
  return { success: false, message: "لم يتم العثور على الرسالة." };
}

export async function deleteMessageAction(messageId: string): Promise<{ success: boolean; message: string }> {
  const deleted = deleteDataMessage(messageId);
  if (deleted) {
    revalidatePath('/admin/messages');
    return { success: true, message: "تم حذف الرسالة بنجاح." };
  }
  return { success: false, message: "فشل حذف الرسالة أو لم يتم العثور عليها." };
}
