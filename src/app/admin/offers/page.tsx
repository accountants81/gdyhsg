
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Offer } from '@/lib/types';
import { getAllOffers, deleteOfferAction } from './actions'; // Assuming getAllOffers is created in actions
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OffersListClient from "./components/OffersListClient";


export default async function AdminOffersPage() {
  const initialOffers = await getAllOffers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة العروض</h1>
        <Link href="/admin/offers/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> إضافة عرض جديد
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة العروض</CardTitle>
          <CardDescription>عرض وتعديل وحذف العروض الحالية والمجدولة.</CardDescription>
        </CardHeader>
        <CardContent>
          <OffersListClient initialOffers={initialOffers} />
        </CardContent>
      </Card>
    </div>
  );
}
