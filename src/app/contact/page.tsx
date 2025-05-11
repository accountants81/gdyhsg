"use client";

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitContactFormAction } from '@/app/admin/messages/actions'; // Use the centralized action
import { useFormStatus } from 'react-dom';

const initialState = {
  success: false,
  message: '',
  messageData: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      {pending ? 'جارِ الإرسال...' : 'إرسال الرسالة'}
    </Button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactFormAction, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'نجاح', description: state.message });
        formRef.current?.reset(); // Reset form on success
      } else {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">تواصل معنا</CardTitle>
            <CardDescription>
              نحن هنا لمساعدتك. املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input id="name" name="name" required placeholder="اسمك" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" required placeholder="example@mail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع</Label>
                <Input id="subject" name="subject" required placeholder="عنوان رسالتك" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">الرسالة</Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  placeholder="اكتب رسالتك هنا..."
                  rows={5}
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              يمكنك أيضاً التواصل معنا مباشرة عبر قنواتنا الأخرى الموضحة في أسفل الصفحة.
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
