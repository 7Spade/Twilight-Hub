'use client';

import { redirect } from 'next/navigation';

export default function OrgSpacesPageWrapper({
  params,
}: {
  params: { organizationslug: string };
}) {
  // TODO: [P3] REFACTOR src/app/(app)/organizations/[organizationslug]/spaces/page.tsx - 清理未使用的參數（params 未使用）
  // Redirect to unified spaces page
  redirect('/spaces');
}
