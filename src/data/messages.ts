import type { Message } from '@/lib/types';

export let MOCK_MESSAGES: Message[] = [
    {
        id: `msg_${Date.now() - 100000}`,
        name: "عميل تجريبي",
        email: "test_customer@example.com",
        subject: "استفسار عن منتج",
        content: "مرحباً، أود الاستفسار عن توفر الجراب السيليكون لآيفون 15 برو باللون الأزرق. شكراً لكم.",
        createdAt: new Date(Date.now() - 100000).toISOString(),
        isRead: false,
    },
    {
        id: `msg_${Date.now() - 200000}`,
        name: "زائر مهتم",
        email: "visitor@example.com",
        subject: "مشكلة في تتبع الطلب",
        content: "أواجه مشكلة في تتبع طلبي رقم ORD12345. هل يمكنكم المساعدة؟",
        createdAt: new Date(Date.now() - 200000).toISOString(),
        isRead: true,
    }
];

// Function to add a message
export function addMockMessage(message: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message {
  const newMessage: Message = {
    ...message,
    id: `msg_${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  MOCK_MESSAGES.unshift(newMessage); // Add to the beginning of the array
  return newMessage;
}

// Function to get all messages
export function getMockMessages(): Message[] {
  return [...MOCK_MESSAGES].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Function to mark a message as read/unread
export function toggleMockMessageReadStatus(messageId: string): Message | undefined {
  const messageIndex = MOCK_MESSAGES.findIndex(msg => msg.id === messageId);
  if (messageIndex > -1) {
    MOCK_MESSAGES[messageIndex].isRead = !MOCK_MESSAGES[messageIndex].isRead;
    return MOCK_MESSAGES[messageIndex];
  }
  return undefined;
}

// Function to delete a message
export function deleteMockMessage(messageId: string): boolean {
  const initialLength = MOCK_MESSAGES.length;
  MOCK_MESSAGES = MOCK_MESSAGES.filter(msg => msg.id !== messageId);
  return MOCK_MESSAGES.length < initialLength;
}
