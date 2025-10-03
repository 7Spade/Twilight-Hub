'use client';

import { redirect } from 'next/navigation';

export default function OrgSpacesPageWrapper({
  params,
}: {
  params: { organizationslug: string };
}) {
  // Redirect to unified spaces page
  redirect('/spaces');
}
