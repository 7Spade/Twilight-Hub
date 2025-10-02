'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useFirestore,
  useCollection,
} from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs
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
import { Package, Warehouse, PlusCircle } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';

export default function InventoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const [org, setOrg] = useState<any>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      if (!firestore || !params.organizationslug) return;
      setIsLoadingOrg(true);
      const orgsRef = collection(firestore, 'organizations');
      const q = query(orgsRef, where('slug', '==', params.organizationslug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const orgDoc = querySnapshot.docs[0];
        setOrg({ id: orgDoc.id, ...orgDoc.data() });
      } else {
        setOrg(null);
      }
      setIsLoadingOrg(false);
    };

    fetchOrg();
  }, [firestore, params.organizationslug]);

  // Get Items for the Org
  const itemsQuery = useMemo(() => (firestore && org ? query(collection(firestore, 'organizations', org.id, 'items')) : null), [firestore, org]);
  const { data: items, isLoading: itemsLoading } = useCollection(itemsQuery);
  
  // Get Warehouses for the Org
  const warehousesQuery = useMemo(() => (firestore && org ? query(collection(firestore, 'organizations', org.id, 'warehouses')) : null), [firestore, org]);
  const { data: warehouses, isLoading: warehousesLoading } = useCollection(warehousesQuery);

  const isLoading = itemsLoading || warehousesLoading || isLoadingOrg;

  if (isLoading) {
    return <div>Loading inventory...</div>
  }
  
  if (!org) {
      return <div>Organization not found.</div>
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
              <Link href={`/organizations/${org.slug}`}>{org.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <PageContainer
        title="Inventory Management"
        description={`Manage warehouses, items, and stock for ${org.name}.`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <CardTitle>Warehouses</CardTitle>
                      <CardDescription>Manage your stock locations.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Warehouse</Button>
              </CardHeader>
              <CardContent>
                  {isLoading && <p>Loading warehouses...</p>}
                  {warehouses && warehouses.length > 0 ? (
                       <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Location</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {warehouses.map(w => (
                                  <TableRow key={w.id}>
                                      <TableCell className="font-medium">{w.name}</TableCell>
                                      <TableCell>{w.location}</TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  ) : (
                      <div className="text-center py-10 text-muted-foreground">
                          <Warehouse className="mx-auto h-12 w-12" />
                          <p className="mt-4">No warehouses created yet.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <CardTitle>Items</CardTitle>
                      <CardDescription>Manage your product catalog.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
              </CardHeader>
              <CardContent>
                   {isLoading && <p>Loading items...</p>}
                   {items && items.length > 0 ? (
                       <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead className="text-right">Price</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {items.map(item => (
                                  <TableRow key={item.id}>
                                      <TableCell className="font-medium">{item.name}</TableCell>
                                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                       <TableCell className="text-right">
                                          <Link href={`/organizations/${org.slug}/inventory/${item.id}`}>
                                              <Button variant="outline" size="sm">Manage Stock</Button>
                                          </Link>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  ) : (
                      <div className="text-center py-10 text-muted-foreground">
                          <Package className="mx-auto h-12 w-12" />
                          <p className="mt-4">No items created yet.</p>
                      </div>
                  )}
              </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  )
}
