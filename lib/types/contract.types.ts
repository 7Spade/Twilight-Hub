/**
 * 合約相關類型定義
 * 遵循 Next.js 15 + Firebase 最佳實踐
 */

export type ContractType = 'service' | 'license' | 'nda' | 'partnership' | 'employment';
export type ContractStatus = 'draft' | 'pending' | 'active' | 'expired' | 'terminated';

export interface Counterparty {
  name: string;
  contact: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface ContractUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ContractDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: ContractUser;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  type: ContractType;
  status: ContractStatus;
  value?: number;
  currency?: string;
  startDate: Date;
  endDate?: Date;
  counterparty: Counterparty;
  createdBy: ContractUser;
  createdAt: Date;
  lastModified: Date;
  lastModifiedBy: ContractUser;
  documents: ContractDocument[];
  tags: string[];
  notes?: string;
  spaceId: string;
  permissions: {
    [userId: string]: 'read' | 'write' | 'admin';
  };
}

export interface CreateContractData {
  title: string;
  description: string;
  type: ContractType;
  status?: ContractStatus;
  value?: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  counterparty: Omit<Counterparty, 'phone' | 'address'>;
  tags?: string[];
  notes?: string;
}

export interface UpdateContractData extends Partial<CreateContractData> {
  id: string;
}

export interface ContractFilters {
  search?: string;
  status?: ContractStatus | 'all';
  type?: ContractType | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface ContractListResponse {
  contracts: Contract[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ContractAnalysisResult {
  contractId: string;
  summary: string;
  keyTerms: string[];
  risks: string[];
  recommendations: string[];
  confidence: number;
  analyzedAt: Date;
}

export interface ContractNotification {
  id: string;
  contractId: string;
  type: 'created' | 'updated' | 'expired' | 'reminder';
  title: string;
  message: string;
  recipients: string[];
  sentAt?: Date;
  createdAt: Date;
}

// 表單驗證 Schema
export const contractTypeOptions = [
  { value: 'service', label: '服務合約' },
  { value: 'license', label: '授權合約' },
  { value: 'nda', label: '保密協議' },
  { value: 'partnership', label: '合作協議' },
  { value: 'employment', label: '僱傭合約' },
] as const;

export const contractStatusOptions = [
  { value: 'draft', label: '草稿', color: 'gray' },
  { value: 'pending', label: '待審核', color: 'yellow' },
  { value: 'active', label: '生效中', color: 'green' },
  { value: 'expired', label: '已過期', color: 'red' },
  { value: 'terminated', label: '已終止', color: 'red' },
] as const;

export const currencyOptions = [
  { value: 'USD', label: '美元 (USD)' },
  { value: 'EUR', label: '歐元 (EUR)' },
  { value: 'TWD', label: '台幣 (TWD)' },
  { value: 'CNY', label: '人民幣 (CNY)' },
  { value: 'JPY', label: '日圓 (JPY)' },
] as const;
