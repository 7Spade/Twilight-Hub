/**
 * 通知相關 Server Actions
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 處理合約相關的通知發送
 * 位置: src/app/actions/notification-actions.ts
 */

'use server';

import { contractAdminService } from '@/lib/firebase/admin';
import { Contract, ContractNotification } from '@/lib/types/contract.types';

/**
 * 發送合約創建通知
 */
export async function sendContractCreatedNotification(
  contractId: string,
  spaceId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取合約
    const contract = await contractAdminService.getContract(contractId);
    if (!contract) {
      return { success: false, error: '合約不存在' };
    }

    // 獲取空間成員（這裡需要實現獲取空間成員的邏輯）
    const spaceMembers = await getSpaceMembers(spaceId);
    
    // 創建通知
    const notification: ContractNotification = {
      id: `notification_${Date.now()}`,
      contractId,
      type: 'created',
      title: '新合約已創建',
      message: `合約「${contract.title}」已創建`,
      recipients: spaceMembers.map(member => member.email),
      createdAt: new Date(),
    };

    // 發送通知（這裡需要實現實際的通知發送邏輯）
    await sendNotification(notification);

    return { success: true };
  } catch (error) {
    console.error('Error sending contract created notification:', error);
    return { success: false, error: '發送通知失敗' };
  }
}

/**
 * 發送合約更新通知
 */
export async function sendContractUpdatedNotification(
  contractId: string,
  spaceId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取合約
    const contract = await contractAdminService.getContract(contractId);
    if (!contract) {
      return { success: false, error: '合約不存在' };
    }

    // 獲取空間成員
    const spaceMembers = await getSpaceMembers(spaceId);
    
    // 創建通知
    const notification: ContractNotification = {
      id: `notification_${Date.now()}`,
      contractId,
      type: 'updated',
      title: '合約已更新',
      message: `合約「${contract.title}」已更新`,
      recipients: spaceMembers.map(member => member.email),
      createdAt: new Date(),
    };

    // 發送通知
    await sendNotification(notification);

    return { success: true };
  } catch (error) {
    console.error('Error sending contract updated notification:', error);
    return { success: false, error: '發送通知失敗' };
  }
}

/**
 * 發送合約過期提醒
 */
export async function sendContractExpiryReminder(
  contractId: string,
  spaceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取合約
    const contract = await contractAdminService.getContract(contractId);
    if (!contract || !contract.endDate) {
      return { success: false, error: '合約不存在或無結束日期' };
    }

    // 計算距離過期的天數
    const daysUntilExpiry = Math.ceil((contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry > 30) {
      return { success: true }; // 不需要發送提醒
    }

    // 獲取空間成員
    const spaceMembers = await getSpaceMembers(spaceId);
    
    // 創建通知
    const notification: ContractNotification = {
      id: `notification_${Date.now()}`,
      contractId,
      type: 'reminder',
      title: '合約即將過期',
      message: `合約「${contract.title}」將在 ${daysUntilExpiry} 天後過期`,
      recipients: spaceMembers.map(member => member.email),
      createdAt: new Date(),
    };

    // 發送通知
    await sendNotification(notification);

    return { success: true };
  } catch (error) {
    console.error('Error sending contract expiry reminder:', error);
    return { success: false, error: '發送提醒失敗' };
  }
}

/**
 * 發送合約過期通知
 */
export async function sendContractExpiredNotification(
  contractId: string,
  spaceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 獲取合約
    const contract = await contractAdminService.getContract(contractId);
    if (!contract) {
      return { success: false, error: '合約不存在' };
    }

    // 獲取空間成員
    const spaceMembers = await getSpaceMembers(spaceId);
    
    // 創建通知
    const notification: ContractNotification = {
      id: `notification_${Date.now()}`,
      contractId,
      type: 'expired',
      title: '合約已過期',
      message: `合約「${contract.title}」已過期`,
      recipients: spaceMembers.map(member => member.email),
      createdAt: new Date(),
    };

    // 發送通知
    await sendNotification(notification);

    return { success: true };
  } catch (error) {
    console.error('Error sending contract expired notification:', error);
    return { success: false, error: '發送通知失敗' };
  }
}

/**
 * 批量檢查過期合約
 */
export async function checkExpiredContracts(
  spaceId: string
): Promise<{ success: boolean; expiredCount?: number; error?: string }> {
  try {
    // 獲取所有合約
    const contracts = await contractAdminService.getContracts(spaceId, {}, 1000);
    
    // 檢查過期合約
    const expiredContracts = contracts.contracts.filter(contract => {
      if (!contract.endDate || contract.status === 'expired') return false;
      return contract.endDate.getTime() < Date.now();
    });

    // 發送過期通知
    for (const contract of expiredContracts) {
      await sendContractExpiredNotification(contract.id, spaceId);
      
      // 更新合約狀態為過期
      await contractAdminService.updateContract(
        contract.id,
        { status: 'expired' },
        contract.createdBy
      );
    }

    return { success: true, expiredCount: expiredContracts.length };
  } catch (error) {
    console.error('Error checking expired contracts:', error);
    return { success: false, error: '檢查過期合約失敗' };
  }
}

/**
 * 獲取空間成員（模擬實現）
 */
async function getSpaceMembers(spaceId: string): Promise<Array<{ email: string; name: string }>> {
  // 這裡應該從數據庫獲取空間成員
  // 暫時返回模擬數據
  return [
    { email: 'admin@example.com', name: 'Admin User' },
    { email: 'user@example.com', name: 'Regular User' },
  ];
}

/**
 * 發送通知（模擬實現）
 */
async function sendNotification(notification: ContractNotification): Promise<void> {
  // 這裡應該實現實際的通知發送邏輯
  // 可以使用郵件服務、推送通知等
  console.log('Sending notification:', notification);
  
  // 模擬發送延遲
  await new Promise(resolve => setTimeout(resolve, 100));
}
