
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { getSiteSettings, updateSiteSettingsAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/types';

const initialState = {
  success: false,
  message: '',
  settings: undefined as SiteSettings | undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
    </Button>
  );
}

export default function AdminSettingsPage() {
  const [state, formAction] = useFormState(updateSiteSettingsAction, initialState);
  const { toast } = useToast();
  const [currentSettings, setCurrentSettings] = useState<SiteSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoadingSettings(true);
      const fetchedSettings = await getSiteSettings();
      setCurrentSettings(fetchedSettings);
      setIsLoadingSettings(false);
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (state.message) {
      if (state.success && state.settings) {
        toast({ title: 'نجاح', description: state.message });
        setCurrentSettings(state.settings); // Update local state with returned data
      } else if (!state.success) {
        toast({ title: 'خطأ', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast]);

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ms-2">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  if (!currentSettings) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-destructive mb-4">لم يتم العثور على إعدادات الموقع.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>معلومات التواصل والروابط</CardTitle>
            <CardDescription>قم بتحديث معلومات التواصل وروابط الشبكات الاجتماعية التي تظهر في الموقع.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">اسم الموقع (اختياري)</Label>
              <Input id="siteName" name="siteName" defaultValue={currentSettings.siteName || ''} placeholder="اسم متجرك" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني للتواصل</Label>
              <Input id="email" name="email" type="email" required defaultValue={currentSettings.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" defaultValue={currentSettings.phoneNumber} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">رقم واتساب (مع رمز الدولة)</Label>
              <Input id="whatsappNumber" name="whatsappNumber" type="tel" defaultValue={currentSettings.whatsappNumber} placeholder="+201234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">رابط صفحة فيسبوك</Label>
              <Input id="facebookUrl" name="facebookUrl" type="url" defaultValue={currentSettings.facebookUrl} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">رابط حساب انستجرام</Label>
              <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={currentSettings.instagramUrl} />
            </div>
            {/* Add more fields as needed, e.g., Twitter, LinkedIn, Address etc. */}
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
