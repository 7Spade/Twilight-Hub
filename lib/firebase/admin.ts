/**
 * Firebase 服務端操作
 * 用於 Server Actions 中的 Firebase Admin SDK 操作
 * 遵循 Next.js 15 + Firebase 最佳實踐
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import { Contract, ContractDocument, ContractFilters, ContractListResponse } from '@/lib/types/contract.types';

// 初始化 Firebase Admin
const adminApp = getApps().length === 0 
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  : getApps()[0];

export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export const adminAuth = getAuth(adminApp);

/**
 * 合約相關服務端操作
 */
export class ContractAdminService {
  private collection = adminDb.collection('contracts');

  /**
   * 獲取合約列表
   */
  async getContracts(
    spaceId: string,
    filters: ContractFilters = {},
    limit = 20,
    cursor?: string
  ): Promise<ContractListResponse> {
    let query = this.collection.where('spaceId', '==', spaceId);

    // 應用過濾器
    if (filters.status && filters.status !== 'all') {
      query = query.where('status', '==', filters.status);
    }
    if (filters.type && filters.type !== 'all') {
      query = query.where('type', '==', filters.type);
    }
    if (filters.tags && filters.tags.length > 0) {
      query = query.where('tags', 'array-contains-any', filters.tags);
    }

    // 排序
    query = query.orderBy('lastModified', 'desc');

    // 分頁
    if (cursor) {
      query = query.startAfter(cursor);
    }
    query = query.limit(limit + 1);

    const snapshot = await query.get();
    const contracts = snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastModified: doc.data().lastModified?.toDate(),
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
    })) as Contract[];

    const hasMore = snapshot.docs.length > limit;
    const nextCursor = hasMore ? snapshot.docs[limit - 1].id : undefined;

    return {
      contracts,
      total: contracts.length,
      hasMore,
      nextCursor,
    };
  }

  /**
   * 獲取單個合約
   */
  async getContract(contractId: string): Promise<Contract | null> {
    const doc = await this.collection.doc(contractId).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      lastModified: data.lastModified?.toDate(),
      startDate: data.startDate?.toDate(),
      endDate: data.endDate?.toDate(),
    } as Contract;
  }

  /**
   * 創建合約
   */
  async createContract(
    data: Omit<Contract, 'id' | 'createdAt' | 'lastModified' | 'lastModifiedBy' | 'documents'>
  ): Promise<Contract> {
    const now = new Date();
    const contractData = {
      ...data,
      createdAt: now,
      lastModified: now,
      lastModifiedBy: data.createdBy,
      documents: [],
    };

    const docRef = await this.collection.add(contractData);
    return {
      id: docRef.id,
      ...contractData,
    };
  }

  /**
   * 更新合約
   */
  async updateContract(
    contractId: string,
    data: Partial<Contract>,
    updatedBy: Contract['createdBy']
  ): Promise<Contract | null> {
    const updateData = {
      ...data,
      lastModified: new Date(),
      lastModifiedBy: updatedBy,
    };

    await this.collection.doc(contractId).update(updateData);
    return this.getContract(contractId);
  }

  /**
   * 刪除合約
   */
  async deleteContract(contractId: string): Promise<boolean> {
    try {
      await this.collection.doc(contractId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      return false;
    }
  }

  /**
   * 搜索合約
   */
  async searchContracts(
    spaceId: string,
    searchTerm: string,
    limit = 20
  ): Promise<Contract[]> {
    // 注意：Firestore 的全文搜索有限制，這裡使用基本的字段搜索
    // 在生產環境中建議使用 Algolia 或其他搜索服務
    const query = this.collection
      .where('spaceId', '==', spaceId)
      .where('title', '>=', searchTerm)
      .where('title', '<=', searchTerm + '\uf8ff')
      .limit(limit);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastModified: doc.data().lastModified?.toDate(),
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
    })) as Contract[];
  }

  /**
   * 獲取合約文檔
   */
  async getContractDocuments(contractId: string): Promise<ContractDocument[]> {
    const contract = await this.getContract(contractId);
    return contract?.documents || [];
  }

  /**
   * 添加合約文檔
   */
  async addContractDocument(
    contractId: string,
    document: ContractDocument
  ): Promise<boolean> {
    try {
      const contract = await this.getContract(contractId);
      if (!contract) return false;

      const updatedDocuments = [...contract.documents, document];
      await this.collection.doc(contractId).update({
        documents: updatedDocuments,
        lastModified: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Error adding contract document:', error);
      return false;
    }
  }

  /**
   * 刪除合約文檔
   */
  async removeContractDocument(
    contractId: string,
    documentId: string
  ): Promise<boolean> {
    try {
      const contract = await this.getContract(contractId);
      if (!contract) return false;

      const updatedDocuments = contract.documents.filter(doc => doc.id !== documentId);
      await this.collection.doc(contractId).update({
        documents: updatedDocuments,
        lastModified: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Error removing contract document:', error);
      return false;
    }
  }
}

// 導出單例實例
export const contractAdminService = new ContractAdminService();
