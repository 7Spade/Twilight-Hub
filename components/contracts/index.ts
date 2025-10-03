/**
 * 合約組件統一導出
 * 遵循 Next.js 15 + Firebase 最佳實踐
 * 提供所有合約相關組件的統一入口
 */

// 現有組件
export { ContractList } from '../src/components/features/spaces/components/contracts/contract-list';
export { ContractDetails } from '../src/components/features/spaces/components/contracts/contract-details';
export { CreateContractDialog } from '../src/components/features/spaces/components/contracts/create-contract-dialog';

// 新增組件
export { FileUpload } from './file-upload';
export { SearchFilters } from './search-filters';

// 重新導出類型（如果需要）
export type { Contract, ContractFilters, CreateContractData, UpdateContractData } from '@/lib/types/contract.types';
