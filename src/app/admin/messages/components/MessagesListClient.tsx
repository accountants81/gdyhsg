"use client";

import React, { useState, useTransition, useActionState } from 'react';
import type { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Loader2, MailCheck, MailWarning, Search, MessageSquareText, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteMessageAction, toggleMessageReadStatusAction } from '../actions'; 
import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessagesListClientProps {
  initialMessages: Message[];
}

export default function MessagesListClient({ initialMessages }: MessagesListClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'desc' for newest first
  const [isProcessing, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedAndFilteredMessages = messages
    .filter(message =>
      message.name.toLowerCase().includes(searchTerm) ||
      message.email.toLowerCase().includes(searchTerm) ||
      message.subject.toLowerCase().includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه الرسالة؟ لا يمكن التراجع عن هذا الإجراء.")) {
      return;
    }
    startTransition(async () => {
      const result = await deleteMessageAction(messageId);
      if (result.success) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        toast({ title: "نجاح", description: result.message });
      } else {
        toast({ title: "خطأ", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleToggleReadStatus = async (messageId: string) => {
    startTransition(async () => {
      const result = await toggleMessageReadStatusAction(messageId);
      if (result.success && result.updatedMessage) {
        setMessages(prev => prev.map(m => m.id === messageId ? result.updatedMessage! : m));
        toast({ title: "نجاح", description: `تم تحديث حالة الرسالة.` });
      } else {
        toast({ title: "خطأ", description: result.message || "فشل تحديث حالة الرسالة.", variant: "destructive" });
      }
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: arSA });
    } catch {
      return 'تاريخ غير صالح';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
          <Input
            type="search"
            placeholder="ابحث في الرسائل..."
            value={searchTerm}
            onChange={handleSearch}
            className="ps-10 rtl:pr-10"
          />
        </div>
        <Button variant="outline" onClick={toggleSortOrder}>
          {sortOrder === 'asc' ? <ArrowUpAZ className="mr-2 h-4 w-4" /> : <ArrowDownAZ className="mr-2 h-4 w-4" />}
          {sortOrder === 'asc' ? 'الأقدم أولاً' : 'الأحدث أولاً'}
        </Button>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ms-2 rtl:mr-2">جاري المعالجة...</span>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">المرسل</TableHead>
              <TableHead>الموضوع</TableHead>
              <TableHead className="w-[150px]">تاريخ الإرسال</TableHead>
              <TableHead className="w-[100px]">الحالة</TableHead>
              <TableHead className="text-left w-[180px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredMessages.length > 0 ? (
              sortedAndFilteredMessages.map((message) => (
                <TableRow key={message.id} className={!message.isRead ? 'font-semibold bg-muted/30' : ''}>
                  <TableCell>
                    <div>{message.name}</div>
                    <div className="text-xs text-muted-foreground">{message.email}</div>
                  </TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={message.isRead ? "outline" : "default"}>
                      {message.isRead ? 'مقروءة' : 'جديدة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="icon" aria-label="عرض الرسالة" onClick={() => !message.isRead && handleToggleReadStatus(message.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                          <DialogHeader>
                            <DialogTitle>تفاصيل الرسالة: {message.subject}</DialogTitle>
                            <DialogDescription>
                               مرسلة من: {message.name} ({message.email}) - {format(new Date(message.createdAt), 'PPPp', { locale: arSA })}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[300px] mt-4 whitespace-pre-wrap border p-4 rounded-md">
                             {message.content}
                          </ScrollArea>
                          <DialogFooter className="sm:justify-start mt-4">
                             <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                إغلاق
                                </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                     
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleReadStatus(message.id)}
                        disabled={isProcessing}
                        aria-label={message.isRead ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}
                      >
                        {message.isRead ? <MailWarning className="h-4 w-4" /> : <MailCheck className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteMessage(message.id)}
                        disabled={isProcessing}
                        aria-label="حذف الرسالة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchTerm ? "لا توجد رسائل تطابق بحثك." : "لا توجد رسائل واردة حاليًا."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {sortedAndFilteredMessages.length === 0 && !searchTerm && (
         <div className="text-center py-8">
            <MessageSquareText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">صندوق الوارد فارغ.</p>
          </div>
       )}
    </div>
  );
}
