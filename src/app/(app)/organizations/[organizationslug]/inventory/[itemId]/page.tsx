'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  useFirestore,
  useDoc,
  useCollection,
} from '@/firebase';
import {
  collection,
  doc,
  query,
  where,
  updateDoc,
  increment,
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
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';

function StockRow({
  stock,
  warehouseName,
  onUpdateStock,
}: {
  stock: any;
  warehouseName: string;
  onUpdateStock: (stockId: string, adjustment: number) => void;
}) {
  const [adjustment, setAdjustment] = useState(1);

  return (
    <TableRow>
      <TableCell className="font-medium">{warehouseName}</TableCell>
      <TableCell>{stock.quantity}</TableCell>
      <TableCell className="flex items-center gap-2 justify-end">
        <Input
          type="number"
          value={adjustment}
          onChange={(e) => setAdjustment(parseInt(e.target.value, 10) || 0)}
          className="w-20"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateStock(stock.id, adjustment)}
        >
          Add
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateStock(stock.id, -adjustment)}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ItemStockPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string; itemId: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { organizationslug, itemId } = params;
  const [organization, setOrganization] = useState<any>(null);

  // Fetch organization by slug to get its ID
  useEffect(() => {
    if (!firestore || !organizationslug) return;
    const fetchOrg = async () => {
      const orgsRef = collection(firestore, 'organizations');
      const q = query(orgsRef, where('slug', '==', organizationslug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setOrganization({id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data()});
      }
    };
    fetchOrg();
  }, [firestore, organizationslug]);


  // Get Item Details
  const itemDocRef = useMemo(
    () => (firestore && organization ? doc(firestore, 'organizations', organization.id, 'items', itemId) : null),
    [firestore, organization, itemId]
  );
  const { data: item, isLoading: itemLoading } = useDoc(itemDocRef);

  // Get All Warehouses for the Org
  const warehousesQuery = useMemo(
    () => (firestore && organization ? collection(firestore, 'organizations', organization.id, 'warehouses') : null),
    [firestore, organization]
  );
  const { data: warehouses, isLoading: warehousesLoading } =
    useCollection(warehousesQuery);

  const stockCollections = useMemo(() => {
    if (!firestore || !warehouses || !organization) return [];
    return warehouses.map((w) => ({
      warehouseId: w.id,
      warehouseName: w.name,
      query: query(
        collection(
          firestore,
          'organizations',
          organization.id,
          'warehouses',
          w.id,
          'stock'
        ),
        where('itemId', '==', itemId)
      ),
    }));
  }, [firestore, organization, warehouses, itemId]);
  
  const stockResults = stockCollections.map(({ query, warehouseId, warehouseName }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading } = useCollection(query);
    return { data, isLoading, warehouseId, warehouseName };
  });

  const handleUpdateStock = async (
    warehouseId: string,
    stockId: string,
    adjustment: number
  ) => {
    if (!firestore || !organization) return;
    const stockDocRef = doc(
      firestore,
      'organizations',
      organization.id,
      'warehouses',
      warehouseId,
      'stock',
      stockId
    );
    await updateDoc(stockDocRef, {
      quantity: increment(adjustment),
    });
  };

  const isLoading = !organization || itemLoading || warehousesLoading || stockResults.some(r => r.isLoading);
  
  const combinedStockData = useMemo(() => {
    return stockResults.flatMap(r => 
        r.data ? r.data.map(d => ({ ...d, warehouseName: r.warehouseName, warehouseId: r.warehouseId })) : []
    );
  }, [stockResults]);


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
              <Link href={`/organizations/${organizationslug}`}>{organization.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
           <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/organizations/${organizationslug}/inventory`}>Inventory</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Stock for {item.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center gap-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Stock for {item.name}</h1>
            <p className="text-muted-foreground">{item.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Levels by Warehouse</CardTitle>
          <CardDescription>
            View and adjust the quantity of this item in each location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Current Quantity</TableHead>
                <TableHead className="text-right">Adjust Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedStockData.length > 0 ? (
                combinedStockData.map((stock) => (
                  <StockRow
                    key={stock.id}
                    stock={stock}
                    warehouseName={stock.warehouseName}
                    onUpdateStock={(stockId, adjustment) =>
                      handleUpdateStock(stock.warehouseId, stockId, adjustment)
                    }
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No stock records found for this item.
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
