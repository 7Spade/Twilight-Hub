/**
 * 創建合約對話框 - 整合新架構
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 使用 Server Actions 和新的類型定義
 */

'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useCreateContract } from '@/hooks/use-contracts';
import { useSendContractCreatedNotification } from '@/hooks/use-contract-actions';
import { CreateContractData, contractTypeOptions, contractStatusOptions, currencyOptions } from '@/lib/types/contract.types';

const createContractSchema = z.object({
  title: z.string().min(1, '標題是必填的'),
  description: z.string().min(1, '描述是必填的'),
  type: z.enum(['service', 'license', 'nda', 'partnership', 'employment']),
  status: z.enum(['draft', 'pending', 'active']).default('draft'),
  value: z.number().optional(),
  currency: z.string().default('USD'),
  startDate: z.string().min(1, '開始日期是必填的'),
  endDate: z.string().optional(),
  counterparty: z.object({
    name: z.string().min(1, '公司名稱是必填的'),
    contact: z.string().min(1, '聯絡人是必填的'),
    email: z.string().email('請輸入有效的電子郵件'),
  }),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type CreateContractFormValues = z.infer<typeof createContractSchema>;

interface CreateContractDialogProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractCreated?: (contract: any) => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export function CreateContractDialog({
  spaceId,
  open,
  onOpenChange,
  onContractCreated,
  userId = 'current-user',
  userEmail = 'user@example.com',
  userName = 'Current User',
}: CreateContractDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createContract = useCreateContract();
  const sendNotification = useSendContractCreatedNotification();

  const form = useForm<CreateContractFormValues>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'service',
      status: 'draft',
      value: undefined,
      currency: 'USD',
      startDate: '',
      endDate: '',
      counterparty: {
        name: '',
        contact: '',
        email: '',
      },
      tags: [],
      notes: '',
    },
  });

  const onSubmit = async (data: CreateContractFormValues) => {
    setIsLoading(true);
    
    try {
      // 準備合約數據
      const contractData: CreateContractData = {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        value: data.value,
        currency: data.currency,
        startDate: data.startDate,
        endDate: data.endDate,
        counterparty: {
          name: data.counterparty.name,
          contact: data.counterparty.contact,
          email: data.counterparty.email,
        },
        tags: data.tags || [],
        notes: data.notes,
      };

      // 創建合約
      const result = await createContract.mutateAsync({
        spaceId,
        data: contractData,
        userId,
        userEmail,
        userName,
      });

      if (result.success && result.contract) {
        // 發送通知
        await sendNotification.mutateAsync({
          contractId: result.contract.id,
          spaceId,
          userId,
        });

        // 重置表單
        form.reset();
        
        // 關閉對話框
        onOpenChange(false);
        
        // 回調
        onContractCreated?.(result.contract);
      } else {
        // 處理錯誤
        console.error('創建合約失敗:', result.error);
        alert('創建合約失敗: ' + (result.error || '未知錯誤'));
      }
    } catch (error) {
      console.error('創建合約時發生錯誤:', error);
      alert('創建合約時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>創建新合約</DialogTitle>
          <DialogDescription>
            填寫以下信息來創建一個新的合約
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 合約標題 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>合約標題 *</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入合約標題" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 合約描述 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>合約描述 *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="輸入合約描述" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 合約類型 */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>合約類型 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇合約類型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contractTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 合約狀態 */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>合約狀態</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇合約狀態" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contractStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 合約價值 */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>合約價值</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="輸入合約價值" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 貨幣 */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>貨幣</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇貨幣" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 開始日期 */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始日期 *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 結束日期 */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>結束日期</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 對方信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">對方信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="counterparty.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公司名稱 *</FormLabel>
                      <FormControl>
                        <Input placeholder="輸入公司名稱" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="counterparty.contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>聯絡人 *</FormLabel>
                      <FormControl>
                        <Input placeholder="輸入聯絡人姓名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="counterparty.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>電子郵件 *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="輸入電子郵件" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 備註 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備註</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="輸入備註信息" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '創建中...' : '創建合約'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
