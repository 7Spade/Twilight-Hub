'use server'

import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Contract, ContractFilters } from '@/lib/types/contract.types';

const db = getFirestore(app);

export async function getContracts(spaceId: string, filters?: ContractFilters) {
  try {
    const contractsRef = collection(db, 'spaces', spaceId, 'contracts');
    let q = query(contractsRef, orderBy('createdAt', 'desc'));

    // 應用過濾器
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters?.search) {
      // 注意：Firestore 不支援全文搜索，這裡使用簡單的標題搜索
      // 在生產環境中，建議使用 Algolia 或其他搜索服務
      q = query(q, where('title', '>=', filters.search), where('title', '<=', filters.search + '\uf8ff'));
    }

    const snapshot = await getDocs(q);
    const contracts: Contract[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      startDate: doc.data().startDate?.toDate(),
      endDate: doc.data().endDate?.toDate(),
    })) as Contract[];

    return { success: true, data: contracts };
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return { success: false, error: 'Failed to fetch contracts' };
  }
}

export async function createContract(spaceId: string, contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const contractsRef = collection(db, 'spaces', spaceId, 'contracts');
    const docRef = await addDoc(contractsRef, {
      ...contractData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, data: { id: docRef.id } };
  } catch (error) {
    console.error('Error creating contract:', error);
    return { success: false, error: 'Failed to create contract' };
  }
}

export async function updateContract(spaceId: string, contractId: string, contractData: Partial<Contract>) {
  try {
    const contractRef = doc(db, 'spaces', spaceId, 'contracts', contractId);
    await updateDoc(contractRef, {
      ...contractData,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating contract:', error);
    return { success: false, error: 'Failed to update contract' };
  }
}

export async function deleteContract(spaceId: string, contractId: string) {
  try {
    const contractRef = doc(db, 'spaces', spaceId, 'contracts', contractId);
    await deleteDoc(contractRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting contract:', error);
    return { success: false, error: 'Failed to delete contract' };
  }
}

export async function analyzeContract(spaceId: string, contractId: string) {
  try {
    // TODO: [P2] FEAT src/app/actions/contracts.ts - 實作合約 AI 分析
    // 說明：整合 Genkit AI 或其他 AI 服務，輸出摘要與風險點
    console.log('Analyzing contract:', contractId);
    
    return { success: true, data: { analysis: 'Contract analysis completed' } };
  } catch (error) {
    console.error('Error analyzing contract:', error);
    return { success: false, error: 'Failed to analyze contract' };
  }
}

export async function generateContractPDF(spaceId: string, contractId: string) {
  try {
    // TODO: [P2] FEAT src/app/actions/contracts.ts - 實作合約 PDF 生成
    // 說明：整合 PDF 生成服務（含標題、雙方、金額、日期、簽名）
    console.log('Generating PDF for contract:', contractId);
    
    return { success: true, data: { pdfUrl: 'https://example.com/contract.pdf' } };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: 'Failed to generate PDF' };
  }
}
