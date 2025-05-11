import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { getAllMessagesAction } from './actions';
import MessagesListClient from "./components/MessagesListClient";

export default async function AdminMessagesPage() {
  const initialMessages = await getAllMessagesAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <MessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">الرسائل الواردة</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>صندوق الوارد</CardTitle>
          <CardDescription>عرض وإدارة الرسائل المرسلة من صفحة "تواصل معنا".</CardDescription>
        </CardHeader>
        <CardContent>
          <MessagesListClient initialMessages={initialMessages} />
        </CardContent>
      </Card>
    </div>
  );
}
