
"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Loader2, Save, UserCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { useFormStatus } from 'react-dom'; // If using server action
// import { useActionState } from 'react'; // If using server action

// Placeholder for form state if using client-side handling or server actions
// const initialState = { success: false, message: '' };

// function SubmitButton() {
//   const { pending } = useFormStatus();
//   return (
//     <Button type="submit" disabled={pending}>
//       {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
//       {pending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
//     </Button>
//   );
// }

export default function EditProfilePage() {
  const { user, loading: authLoading /* updateUser, */ } = useAuth(); // Assuming an updateUser function might exist in AuthContext
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  // Add other fields like phone, address as needed
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    // Here you would typically call an action or API endpoint to update user data
    // For example: const result = await updateUser({ ...user, name, email });
    // Simulating an update for now:
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    // MOCK: In a real app, AuthContext's login/setUser would update the stored user or a new action would.
    // For this placeholder, we'll just show a toast.
    // updateUserInLocalStorage({ ...user, name, email }); // This would be part of updateUser
    
    toast({
      title: "تم تحديث البيانات (محاكاة)",
      description: "تم حفظ التغييرات على ملفك الشخصي بنجاح (هذه محاكاة).",
    });
    setIsSubmitting(false);
  };

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-15rem)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ms-4 text-lg">جاري تحميل بياناتك...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
     return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">غير مصرح لك بالدخول</h1>
          <p className="text-muted-foreground mb-6">يجب تسجيل الدخول لتعديل بيانات حسابك.</p>
          <Button asChild>
            <Link href="/login?redirect=/profile/edit">تسجيل الدخول</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserCircle className="h-7 w-7 text-primary" />
              تعديل بيانات الحساب
            </CardTitle>
            <CardDescription>قم بتحديث معلوماتك الشخصية هنا.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">الاسم</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />
              </div>
              {/* Add fields for phone, address, password change etc. */}
              {/* Example for password - would need current and new password fields
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input id="newPassword" type="password" />
              </div>
              */}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6">
                <Button type="button" variant="outline" asChild>
                    <Link href="/profile">إلغاء</Link>
                </Button>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
