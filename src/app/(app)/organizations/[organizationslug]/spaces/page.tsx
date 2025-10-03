'use client';
// TODO: [P1] REFACTOR src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 統一由伺服端進行 redirect
// 說明：改為 server page 直接 redirect('/spaces')，避免在 client 內呼叫 redirect。
// @assignee ai
import { redirect } from 'next/navigation';

export default function OrgSpacesPageWrapper({
  params: _params,
}: {
  params: { organizationslug: string };
}) {
  // Redirect to unified spaces page
  redirect('/spaces');
}
