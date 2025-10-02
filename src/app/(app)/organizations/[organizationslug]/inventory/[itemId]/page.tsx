'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useFirestore, useDoc, useCollection } from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import {
  type Account,
  type Item,
  type Warehouse,
  type Stock,
} from '@/lib/types';
import { useDialogStore } from '@/hooks/use-dialog-store';

export default function ItemStockPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string; itemId: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { organizationslug, itemId } = params;
  const [organization, setOrganization] = useState<Account | null>(null);
  const { open: openDialog } = useDialogStore();


  // Fetch organization by slug to get its ID
  useEffect(() => {
    if (!firestore || !organizationslug) return;
    const fetchOrg = async () => {
      const orgsRef = collection(firestore, 'accounts');
      const q = query(
        orgsRef,
        where('slug', '==', organizationslug),
        where('type', '==', 'organization')
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setOrganization({
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as Account);
      }
    };
    fetchOrg();
  }, [firestore, organizationslug]);

  const orgId = organization?.id;

  // Get Item Details
  const itemDocRef = useMemo(
    () => (firestore && orgId ? doc(firestore, 'accounts', orgId, 'items', itemId) : null),
    [firestore, orgId, itemId]
  );
  const { data: item, isLoading: itemLoading } = useDoc<Item>(itemDocRef);

  // Get All Warehouses for the Org
  const warehousesQuery = useMemo(
    () => (firestore && orgId ? collection(firestore, 'accounts', orgId, 'warehouses') : null),
    [firestore, orgId]
  );
  const { data: warehousesData, isLoading: warehousesLoading } =
    useCollection<Warehouse>(warehousesQuery);
  const warehouses = warehousesData || [];

  // Get stock for this item across all warehouses
  const [stockData, setStockData] = useState< (Stock & { warehouseName: string })[] >([]);
  const [stockLoading, setStockLoading] = useState(true);

  useEffect(() => {
      if (!firestore || !orgId || warehousesLoading || !item) return;

      const fetchAllStock = async () => {
          setStockLoading(true);
          const stockPromises = warehouses.map(w => 
              getDocs(query(collection(firestore, 'accounts', orgId, 'warehouses', w.id, 'stock'), where('itemId', '==', item.id)))
          );
          const stockSnapshots = await Promise.all(stockPromises);
          
          const combinedStock = stockSnapshots.flatMap((snapshot, index) => 
              snapshot.docs.map(d => ({
                  ...(d.data() as Stock),
                  id: d.id,
                  warehouseName: warehouses[index].name,
              }))
          );
          
          setStockData(combinedStock);
          setStockLoading(false);
      }
      if (warehouses.length > 0 && item) {
          fetchAllStock();
      } else {
          setStockLoading(false);
          setStockData([]);
      }
  }, [firestore, orgId, warehouses, item, warehousesLoading]);

  const isLoading =
    !organization || itemLoading || warehousesLoading || stockLoading;

  if (isLoading) {
    return <div>Loading stock details...</div>;
  }

  if (!item) {
    return <div>Item not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/organizations">Organizations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/organizations/${organizationslug}`}>
                {organization?.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/organizations/${organizationslug}/inventory`}>
                Inventory
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between gap-4">
        <div className='flex items-center gap-4'>
            <Package className="h-12 w-12 text-muted-foreground" />
            <div>
            <h1 className="text-3xl font-bold tracking-tight">
                {item.name}
            </h1>
            <p className="text-muted-foreground">{item.description}</p>
            </div>
        </div>
         <Button onClick={() => openDialog('adjustStock', { item })}>
            Adjust Stock
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels by Warehouse</CardTitle>
          <CardDescription>
            Quantity of this item in each location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Current Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.length > 0 ? (
                warehouses.map((warehouse) => {
                    const stock = stockData.find(s => s.warehouseId === warehouse.id);
                    return (
                        <TableRow key={warehouse.id}>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse.location}</TableCell>
                            <TableCell className='text-right'>{stock?.quantity || 0}</TableCell>
                        </TableRow>
                    )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No warehouses found for this organization.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
