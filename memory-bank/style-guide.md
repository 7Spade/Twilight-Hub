# Twilight-Hub 樣式指南

## 設計哲學

**極簡主義與現代化**: 基於奧卡姆剃刀原則，追求簡潔、清晰、功能性的設計。每個 UI 元素都應該有明確的目的，避免不必要的裝飾。

**一致性**: 確保整個應用程式的視覺一致性，使用統一的設計語言和組件系統。

## 顏色系統

### 主要顏色調色板

#### 淺色模式 (Light Mode)
- **背景色**: `hsl(0 0% 96.1%)` - 淺灰白色，提供清潔的背景
- **前景色**: `hsl(240 10% 3.9%)` - 深灰黑色，主要文字顏色
- **主要色**: `hsl(274 12% 41%)` - 紫色調，用於主要按鈕和重要元素
- **次要色**: `hsl(0 0% 90%)` - 淺灰色，用於次要按鈕和背景
- **強調色**: `hsl(338 19% 57%)` - 粉紅色調，用於強調和焦點狀態
- **破壞性色**: `hsl(0 84.2% 60.2%)` - 紅色，用於警告和刪除操作

#### 深色模式 (Dark Mode)
- **背景色**: `hsl(240 10% 3.9%)` - 深色背景
- **前景色**: `hsl(0 0% 98%)` - 淺色文字
- **主要色**: `hsl(274 12% 61%)` - 較亮的紫色調
- **次要色**: `hsl(240 3.7% 15.9%)` - 深灰色
- **強調色**: `hsl(338 19% 47%)` - 深粉紅色
- **破壞性色**: `hsl(0 62.8% 30.6%)` - 深紅色

### 語義化顏色
```css
/* 卡片和容器 */
--card: 背景色
--card-foreground: 卡片文字色

/* 彈出層 */
--popover: 彈出層背景
--popover-foreground: 彈出層文字

/* 靜音元素 */
--muted: 靜音背景
--muted-foreground: 靜音文字

/* 邊框和輸入 */
--border: 邊框顏色
--input: 輸入框邊框
--ring: 焦點環顏色
```

## 字體系統

### 字體家族
- **主要字體**: Inter - 現代、清晰、易讀的無襯線字體
- **標題字體**: Inter - 與主要字體保持一致
- **代碼字體**: monospace - 等寬字體，適合代碼顯示

### 字體大小和權重
- **標題 1 (H1)**: `text-xl font-semibold` - 頁面主標題
- **標題 2 (H2)**: `text-2xl font-semibold` - 卡片標題
- **標題 3 (H3)**: `text-lg font-medium` - 子標題
- **正文**: `text-sm` - 主要文字內容
- **小字**: `text-xs` - 輔助信息和標籤
- **描述文字**: `text-sm text-muted-foreground` - 次要描述文字

## 間距系統

### Tailwind 間距比例
基於 4px 基礎單位的間距系統：
- **xs**: `0.5` (2px)
- **sm**: `1` (4px)
- **md**: `2` (8px)
- **lg**: `3` (12px)
- **xl**: `4` (16px)
- **2xl**: `6` (24px)
- **3xl**: `8` (32px)

### 組件間距標準
- **卡片內邊距**: `p-6` (24px)
- **卡片標題間距**: `space-y-1.5` (6px)
- **卡片內容間距**: `pt-0` (移除頂部間距)
- **頁面容器間距**: `space-y-4` (16px)
- **按鈕內邊距**: `px-4 py-2` (16px 水平，8px 垂直)

## 邊框圓角

### 圓角標準
- **基礎圓角**: `--radius: 0.5rem` (8px)
- **大圓角**: `lg` (8px)
- **中圓角**: `md` (6px)
- **小圓角**: `sm` (4px)

### 應用場景
- **按鈕**: `rounded-md` (6px)
- **卡片**: `rounded-lg` (8px)
- **輸入框**: `rounded-md` (6px)
- **側邊欄**: 無圓角，使用直角設計

## 組件設計規範

### 按鈕 (Button)
```tsx
// 主要按鈕
<Button variant="default">主要操作</Button>

// 次要按鈕
<Button variant="outline">次要操作</Button>

// 危險操作
<Button variant="destructive">刪除</Button>

// 幽靈按鈕
<Button variant="ghost">幽靈操作</Button>
```

**尺寸規範**:
- **預設**: `h-10 px-4 py-2`
- **小**: `h-9 px-3`
- **大**: `h-11 px-8`
- **圖標**: `h-10 w-10`

### 卡片 (Card)
```tsx
<Card>
  <CardHeader>
    <CardTitle>卡片標題</CardTitle>
    <CardDescription>卡片描述</CardDescription>
  </CardHeader>
  <CardContent>
    {/* 卡片內容 */}
  </CardContent>
  <CardFooter>
    {/* 卡片操作 */}
  </CardFooter>
</Card>
```

**設計原則**:
- 使用 `shadow-sm` 提供輕微陰影
- 圓角使用 `rounded-lg`
- 邊框使用 `border` 類別

### 頁面容器 (PageContainer)
```tsx
<PageContainer 
  title="頁面標題" 
  description="頁面描述"
>
  {/* 頁面內容 */}
</PageContainer>
```

**佈局標準**:
- 標題使用 `text-xl font-semibold`
- 描述使用 `text-sm text-muted-foreground`
- 內容間距使用 `space-y-4`

## 響應式設計

### 斷點標準
- **sm**: 640px - 小屏幕設備
- **md**: 768px - 平板設備
- **lg**: 1024px - 桌面設備
- **xl**: 1280px - 大屏幕設備

### 響應式模式
```tsx
// 響應式網格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// 響應式佈局
<div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

// 響應式隱藏
<div className="hidden sm:block">
```

## 交互狀態

### 懸停狀態
- **按鈕**: `hover:bg-primary/90` (主要色 90% 透明度)
- **鏈接**: `hover:underline` (下劃線)
- **卡片**: `group` 配合 `group-hover:` 類別

### 焦點狀態
- **焦點環**: `focus-visible:ring-2 focus-visible:ring-ring`
- **焦點偏移**: `focus-visible:ring-offset-2`

### 禁用狀態
- **禁用樣式**: `disabled:pointer-events-none disabled:opacity-50`

## 動畫和過渡

### 過渡效果
- **顏色過渡**: `transition-colors`
- **寬度過渡**: `transition-[width]`
- **持續時間**: `sm:duration-300`

### 動畫標準
- **手風琴**: `accordion-down` 和 `accordion-up` (0.2s ease-out)
- **懸停**: 平滑的顏色變化
- **狀態變化**: 漸變過渡

## 可訪問性 (A11y)

### 對比度要求
- **正常文字**: 至少 4.5:1 對比度
- **大文字**: 至少 3:1 對比度
- **非文字元素**: 至少 3:1 對比度

### 焦點管理
- 所有可交互元素必須有可見的焦點狀態
- 使用 `focus-visible:outline-none` 配合自定義焦點環
- 確保鍵盤導航的邏輯順序

### 語義化 HTML
- 使用適當的 HTML 標籤 (`button`, `a`, `h1-h6`, `p`)
- 提供適當的 ARIA 屬性
- 確保屏幕閱讀器兼容性

## 使用指南

### 創建新組件時
1. 使用現有的 shadcn/ui 組件作為基礎
2. 遵循既定的顏色、間距和字體系統
3. 確保響應式設計
4. 考慮可訪問性要求
5. 保持與現有設計的一致性

### 自定義樣式
- 優先使用 Tailwind CSS 類別
- 避免自定義 CSS，除非絕對必要
- 使用 `cn()` 函數合併類別
- 保持樣式的可維護性

### 深色模式支持
- 所有組件必須支持深色模式
- 使用 CSS 變數而非硬編碼顏色
- 測試深色模式下的可讀性

## 設計原則總結

1. **簡潔性**: 每個元素都應該有明確的目的
2. **一致性**: 使用統一的設計語言
3. **可訪問性**: 確保所有用戶都能使用
4. **響應式**: 在所有設備上都能良好工作
5. **可維護性**: 使用標準化的設計系統
