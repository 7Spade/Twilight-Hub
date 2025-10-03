'use client';

import { redirect } from 'next/navigation';

export default function OrgSpacesPageWrapper({
  params,
}: {
  params: { organizationslug: string };
}) {
  /* TODO: [P2] [CLEANUP] [UI] [TODO] 清理未使用的參數 - params 未使用 */
  // Redirect to unified spaces page
  redirect('/spaces');
}
