'use client';
// TODO: [P2] CLEANUP unused arg (L6) [低認知]
// - 問題：params 未使用
// - 指引：移除參數或以前綴 _ 命名。

import { redirect } from 'next/navigation';

export default function OrgSpacesPageWrapper({
  params,
}: {
  params: { organizationslug: string };
}) {
  // TODO: [P3] REFACTOR src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 清理未使用的參數（params 未使用）
  
// TODO: [P2] REFACTOR src/app/(app)/organizations/[organizationslug]/spaces/page.tsx:6 - 清理未使用的參數
// 問題：'params' 參數已定義但從未使用
// 影響：代碼可讀性差，可能造成混淆
// 建議：移除未使用的參數或添加下劃線前綴表示有意未使用
// @assignee frontend-team
  // Redirect to unified spaces page
  redirect('/spaces');
}
