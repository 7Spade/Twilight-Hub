
'use client';
import { useMemo, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  increment,
  setDoc as _setDoc,
} from 'firebase/firestore';

import { useFirestore } from '@/firebase';
import { useDialogState } from '@/hooks/use-app-state';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type Item,
  type Warehouse as WarehouseType,
  type Stock,
} from '@/lib/types-unified';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AdjustStockDialogData {
  item: Item;
}

export function AdjustStockDialog({
  organizationId,
  warehouses,
}: {
  organizationId: string;
  warehouses: WarehouseType[];
}) {
  const firestore = useFirestore();
  const { type, isOpen, close, data } = useDialogState();
  const { toast } = useToast();
  const { item } = (data as AdjustStockDialogData) || {};

  const isDialogVisible = isOpen && type === 'adjustStock' && !!item;

  const [stockLevels, setStockLevels] = useState<
    { warehouseId: string; stockId?: string; quantity: number }[]
  >([]);
  const [adjustments, setAdjustments] = useState<{ [warehouseId: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isDialogVisible || !firestore || !item) return;

    const fetchStock = async () => {
      setIsLoading(true);
      const stockQuery = query(
        collection(firestore, `accounts/${organizationId}/warehouses`),
      );
      const warehouseSnapshots = await getDocs(stockQuery);
      
      const stockPromises = warehouseSnapshots.docs.map(async (warehouseDoc) => {
          const stockCollectionRef = collection(warehouseDoc.ref, 'stock');
          const itemStockQuery = query(stockCollectionRef, where('itemId', '==', item.id));
          const stockSnapshot = await getDocs(itemStockQuery);
          if (!stockSnapshot.empty) {
              const stockDoc = stockSnapshot.docs[0];
              return { warehouseId: warehouseDoc.id, stockId: stockDoc.id, quantity: stockDoc.data().quantity };
          }
          return { warehouseId: warehouseDoc.id, quantity: 0 };
      });

      const results = await Promise.all(stockPromises);
      setStockLevels(results);
      setAdjustments({}); // Reset adjustments on item change
      setIsLoading(false);
    };

    fetchStock();
  }, [isDialogVisible, firestore, organizationId, item]);

  const warehouseMap = useMemo(() => {
    return warehouses.reduce((acc, w) => {
      acc[w.id] = w.name;
      return acc;
    }, {} as { [key: string]: string });
  }, [warehouses]);


  const handleAdjustmentChange = (warehouseId: string, value: string) => {
    const numValue = parseInt(value, 10);
    setAdjustments(prev => ({
      ...prev,
      [warehouseId]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleApplyAdjustments = async () => {
      if (!firestore || !item) return;
      setIsSubmitting(true);
      
      const batch = writeBatch(firestore);

      for (const warehouseId in adjustments) {
          const adjustment = adjustments[warehouseId];
          if (adjustment === 0 || isNaN(adjustment)) continue;

          const stockInfo = stockLevels.find(s => s.warehouseId === warehouseId);
          const hasExistingStockRecord = !!stockInfo?.stockId;
          
          let stockDocRef;

  if (hasExistingStockRecord && stockInfo.stockId) {
              stockDocRef = doc(firestore, 'accounts', organizationId, 'warehouses', warehouseId, 'stock', stockInfo.stockId);
              batch.update(stockDocRef, { quantity: increment(adjustment) });
          } else {
              // Create a new stock document
              stockDocRef = doc(collection(firestore, 'accounts', organizationId, 'warehouses', warehouseId, 'stock'));
              const newStockData: Partial<Stock> = {
                  itemId: item.id,
                  warehouseId: warehouseId,
                  quantity: adjustment
              };
              batch.set(stockDocRef, newStockData);
          }
      }

      try {
          await batch.commit();
          toast({ title: 'Success', description: 'Stock levels have been updated.' });
          close();
      } catch (error) {
          console.error("Error updating stock levels:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to update stock levels.' });
      } finally {
          setIsSubmitting(false);
      }
  };
  
  const handleClose = () => {
    setAdjustments({});
    close();
  };


  return (
    <Dialog open={isDialogVisible} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adjust Stock for "{item?.name}"</DialogTitle>
          <DialogDescription>
            Update the stock quantity for this item in each warehouse. Enter positive numbers to add stock, negative to remove.
          </DialogDescription>
        </DialogHeader>
        <div>
          {isLoading ? (
            <p>Loading stock levels...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Adjustment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockLevels.map(sl => (
                  <TableRow key={sl.warehouseId}>
                    <TableCell className="font-medium">{warehouseMap[sl.warehouseId] || sl.warehouseId}</TableCell>
                    <TableCell className="text-right">{sl.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        placeholder="0"
                        className="w-24 ml-auto text-right"
                        value={adjustments[sl.warehouseId] || ''}
                        onChange={(e) => handleAdjustmentChange(sl.warehouseId, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApplyAdjustments} disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
