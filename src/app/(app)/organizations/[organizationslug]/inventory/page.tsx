'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
/* TODO: [P2] [CLEANUP] [UI] [TODO] 清理未使用的導入 - doc 未使用 */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Package,
  Warehouse,
  PlusCircle,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import {
  type Account,
  type Item,
  type Warehouse as WarehouseType,
  type Stock,
} from '@/lib/types-unified';
import { useDialogState } from '@/hooks/use-app-state';
import { CreateItemDialog } from '@/components/create-item-dialog';
import { CreateWarehouseDialog } from '@/components/create-warehouse-dialog';
import { AdjustStockDialog } from '@/components/adjust-stock-dialog';

interface ItemWithStock extends Item {
  totalStock: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function InventoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string }>;
}) {
  const params = React.use(paramsPromise);
  const firestore = useFirestore();
  const { open: openDialog } = useDialogState();
  const [org, setOrg] = useState<Account | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);

  // Memoize fetching of the organization
  const fetchOrg = useMemo(() => async () => {
    if (!firestore || !params.organizationslug) return;
    setIsLoadingOrg(true);
    const orgsRef = collection(firestore, 'accounts');
    const q = query(
      orgsRef,
      where('slug', '==', params.organizationslug),
      where('type', '==', 'organization')
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const orgDoc = querySnapshot.docs[0];
      setOrg({ id: orgDoc.id, ...orgDoc.data() } as Account);
    } else {
      setOrg(null);
    }
    setIsLoadingOrg(false);
  }, [firestore, params.organizationslug]);

  useEffect(() => {
    fetchOrg();
  }, [fetchOrg]);
  
  const orgId = org?.id;

  // Get Items for the Org
  const itemsQuery = useMemo(
    () => (firestore && orgId ? collection(firestore, 'accounts', orgId, 'items') : null),
    [firestore, orgId]
  );
  const { data: itemsData, isLoading: itemsLoading } = useCollection<Item>(itemsQuery);

  // Get Warehouses for the Org
  const warehousesQuery = useMemo(
    () => (firestore && orgId ? collection(firestore, 'accounts', orgId, 'warehouses') : null),
    [firestore, orgId]
  );
  const { data: warehousesData, isLoading: warehousesLoading } =
    useCollection<WarehouseType>(warehousesQuery);
  const warehouses = warehousesData || [];

  // Fetch all stock data for all warehouses
  const [allStock, setAllStock] = useState<Stock[]>([]);
  const [stockLoading, setStockLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !orgId || warehousesLoading) return;
    if (warehouses.length === 0) {
      setStockLoading(false);
      setAllStock([]);
      return;
    }

    setStockLoading(true);
    const fetchAllStock = async () => {
      const stockPromises = warehouses.map(w =>
        getDocs(collection(firestore, 'accounts', orgId, 'warehouses', w.id, 'stock'))
      );
      const stockSnapshots = await Promise.all(stockPromises);
      const stockData = stockSnapshots.flatMap(snapshot =>
        snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Stock))
      );
      setAllStock(stockData);
      setStockLoading(false);
    };

    fetchAllStock();
  }, [firestore, orgId, warehouses, warehousesLoading]);

  const itemsWithStock: ItemWithStock[] = useMemo(() => {
    if (!itemsData) return [];
    const stockByItem = allStock.reduce((acc, stock) => {
      acc[stock.itemId] = (acc[stock.itemId] || 0) + stock.quantity;
      return acc;
    }, {} as { [key: string]: number });

    return itemsData.map(item => ({
      ...item,
      totalStock: stockByItem[item.id] || 0,
    }));
  }, [itemsData, allStock]);

  // Dashboard Stats Calculation
  const stats = useMemo(() => {
    const totalStockCount = itemsWithStock.reduce((sum, item) => sum + item.totalStock, 0);
    const lowStockItems = itemsWithStock.filter(item => item.totalStock < (item.lowStockThreshold || 10)).length;

    return {
      totalItems: totalStockCount,
      itemVariants: itemsData?.length || 0,
      warehouseCount: warehouses.length,
      lowStockCount: lowStockItems,
    };
  }, [itemsWithStock, itemsData, warehouses]);


  const isLoading = itemsLoading || warehousesLoading || isLoadingOrg || stockLoading;

  if (isLoadingOrg) {
    return <div>Loading Organization...</div>;
  }

  if (!org) {
    return <div>Organization not found.</div>;
  }

  return (
    <>
      <CreateItemDialog organizationId={org.id} />
      <CreateWarehouseDialog organizationId={org.id} />
      <AdjustStockDialog organizationId={org.id} warehouses={warehouses} />

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
          title="Inventory Dashboard"
          description={`An overview of items and stock for ${org.name}.`}
        >
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Items in Stock" value={stats.totalItems.toString()} icon={TrendingUp} />
              <StatCard title="Item Variants" value={stats.itemVariants.toString()} icon={Package} />
              <StatCard title="Warehouses" value={stats.warehouseCount.toString()} icon={Warehouse} />
              <StatCard title="Low Stock Items" value={stats.lowStockCount.toString()} icon={AlertCircle} />
          </div>


          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Items</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your product catalog and view stock levels.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openDialog('createWarehouse')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Warehouse
                </Button>
                <Button variant="default" size="sm" onClick={() => openDialog('createItem')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading items...</p>
              ) : itemsWithStock.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Total Stock</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsWithStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.totalStock}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                           <Link href={`/organizations/${org.slug}/inventory/${item.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12" />
                  <p className="mt-4">No items created yet.</p>
                  <Button size="sm" className="mt-4" onClick={() => openDialog('createItem')}>
                    Add Your First Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    </>
  );
}
