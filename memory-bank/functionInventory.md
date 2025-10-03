# 函數清單文檔

## 核心函數分類

### 1. 認證與用戶管理函數

#### AuthProvider 相關
- `setUser(userId: string, roleAssignment: UserRoleAssignment): void`
- `clearUser(): void`
- `checkPermission(permission: Permission, spaceId: string): Promise<PermissionCheckResult>`
- `hasPermission(permission: Permission, spaceId: string): boolean`
- `refreshPermissions(): Promise<void>`
- `signIn(email: string, password: string): Promise<void>`
- `signOut(): Promise<void>`

#### 權限管理
- `checkPermission(permission: Permission, spaceId: string): Promise<PermissionCheckResult>`
- `hasPermission(permission: Permission, spaceId: string): boolean`
- `usePermissionCheck(permission: Permission, spaceId: string)`

#### 角色管理
- `handleCreateRole(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>`
- `handleUpdateRole(roleId: string, roleData: Partial<Role>): Promise<void>`
- `handleDeleteRole(roleId: string): Promise<void>`

### 2. Firebase 集成函數

#### Firebase 核心
- `initializeFirebase(): FirebaseApp`
- `getSdks(firebaseApp: FirebaseApp): { firestore, auth, storage }`

#### Firestore Hooks
- `useCollection<T>(targetRefOrQuery: CollectionReference | Query | null): UseCollectionResult<T>`
- `useDoc<T>(docRef: DocumentReference | null): UseDocResult<T>`

#### 錯誤處理
- `buildAuthObject(currentUser: User | null): FirebaseAuthObject | null`
- `buildRequestObject(context: SecurityRuleContext): SecurityRuleRequest`
- `buildErrorMessage(requestObject: SecurityRuleRequest): string`

### 3. 文件管理函數

#### 文件操作
- `uploadFile(file: File, spaceId: string, userId: string): Promise<boolean>`
- `downloadFile(fileName: string, spaceId: string, userId: string): Promise<boolean>`
- `deleteFile(fileName: string, spaceId: string, userId: string): Promise<boolean>`
- `listFiles(spaceId: string, userId: string): Promise<FileActionItem[]>`

#### 文件分析
- `analyzeFileContent(fileName: string, fileType: string, content?: string): Promise<FileAnalysisResult>`
- `sendFileNotification(action: 'upload' | 'download' | 'delete', fileName: string, spaceId: string, userId: string): Promise<FileNotificationResult>`
- `generateFileReport(spaceId: string, userId: string, fileOperations: FileOperation[]): Promise<FileReportResult>`

### 4. 空間管理函數

#### 空間操作
- `createSpace(data: CreateSpaceData): Promise<Space | null>`
- `updateSpace(spaceId: string, data: SpaceSettingsFormValues): Promise<boolean>`
- `deleteSpace(spaceId: string): Promise<boolean>`

#### 星標操作
- `starSpace(spaceId: string, userId: string): Promise<boolean>`
- `unstarSpace(spaceId: string, userId: string): Promise<boolean>`
- `toggleStar(spaceId: string, userId: string, isStarred: boolean): Promise<boolean>`

#### 可見性操作
- `toggleVisibility(spaceId: string, isPublic: boolean): Promise<boolean>`
- `setPublic(spaceId: string): Promise<boolean>`
- `setPrivate(spaceId: string): Promise<boolean>`

### 5. 合約管理函數

#### 合約操作
- `getContracts(spaceId: string, filters?: ContractFilters): Promise<Contract[]>`
- `createContract(spaceId: string, contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contract>`
- `updateContract(spaceId: string, contractId: string, contractData: Partial<Contract>): Promise<Contract>`
- `deleteContract(spaceId: string, contractId: string): Promise<void>`

#### 合約分析
- `analyzeContract(spaceId: string, contractId: string): Promise<ContractAnalysisResult>`
- `generateContractPDF(spaceId: string, contractId: string): Promise<string>`

### 6. AI 功能函數

#### 數據提取
- `extractEngagementData(input: ExtractEngagementDataInput): Promise<ExtractEngagementDataOutput>`

### 7. 工具函數

#### 通用工具
- `cn(...inputs: ClassValue[]): string`
- `generateSlug(name: string): string`
- `formatFileSize(bytes: number): string`
- `formatDate(dateString: string): string`
- `getInitials(name?: string): string`

#### 角色管理工具
- `createRole(roleData: CreateRoleData): Promise<RoleDefinition>`
- `updateRole(roleId: string, roleData: UpdateRoleData): Promise<RoleDefinition>`
- `deleteRole(roleId: string): Promise<void>`
- `assignRole(assignmentData: AssignRoleData): Promise<void>`

### 8. 表單處理函數

#### 表單驗證
- `validateEmail(email: string): boolean`
- `validatePassword(password: string): boolean`
- `validateRequired(value: any): boolean`

#### 表單提交
- `handleSubmit<T>(data: T): Promise<void>`
- `handleFormError(error: Error): void`

### 9. 狀態管理函數

#### 應用狀態
- `openChat(): void`
- `closeChat(): void`
- `toggleChat(): void`
- `toggleMinimizeChat(): void`
- `openDialog(type: string, data?: unknown): void`
- `closeDialog(): void`

#### Toast 通知
- `toast(props: Toast): { id: string; dismiss: () => void; update: (props: Toast) => void }`
- `dismiss(toastId?: string): void`
- `removeToast(toastId?: string): void`

### 10. 數據處理函數

#### 數據轉換
- `convertToFileItem(data: any): FileItem`
- `convertToSpace(data: any): Space`
- `convertToContract(data: any): Contract`
- `convertToUser(data: any): User`

#### 數據過濾
- `filterByStatus<T>(items: T[], status: string): T[]`
- `filterByType<T>(items: T[], type: string): T[]`
- `filterByDateRange<T>(items: T[], startDate: Date, endDate: Date): T[]`

## 函數命名規範

### 1. 動詞開頭
- **創建**: `create*`, `add*`, `new*`
- **讀取**: `get*`, `fetch*`, `load*`, `find*`
- **更新**: `update*`, `modify*`, `change*`, `edit*`
- **刪除**: `delete*`, `remove*`, `clear*`
- **檢查**: `check*`, `validate*`, `verify*`
- **處理**: `handle*`, `process*`, `execute*`

### 2. 狀態管理
- **設置**: `set*`
- **獲取**: `get*`
- **切換**: `toggle*`
- **重置**: `reset*`

### 3. 事件處理
- **點擊**: `handleClick*`, `onClick*`
- **提交**: `handleSubmit*`, `onSubmit*`
- **變更**: `handleChange*`, `onChange*`
- **選擇**: `handleSelect*`, `onSelect*`

### 4. 異步操作
- **Promise 返回**: `*Async`, `*Promise`
- **回調**: `*Callback`, `*Handler`

## 函數參數規範

### 1. 必需參數在前
```typescript
function createUser(name: string, email: string, options?: UserOptions): Promise<User>
```

### 2. 可選參數在後
```typescript
function updateUser(id: string, data: Partial<User>, options?: UpdateOptions): Promise<User>
```

### 3. 配置對象
```typescript
function uploadFile(file: File, config: UploadConfig): Promise<UploadResult>
```

### 4. 回調函數
```typescript
function processData(data: Data[], onProgress?: (progress: number) => void): Promise<ProcessedData>
```

## 返回值規範

### 1. 單一值
```typescript
function getUser(id: string): Promise<User | null>
```

### 2. 結果對象
```typescript
function createSpace(data: CreateSpaceData): Promise<{ success: boolean; space?: Space; error?: string }>
```

### 3. 元組
```typescript
function getData(): Promise<[Data[], Error | null]>
```

### 4. 狀態對象
```typescript
function useAsyncOperation(): { data: Data | null; loading: boolean; error: Error | null; execute: () => void }
```
