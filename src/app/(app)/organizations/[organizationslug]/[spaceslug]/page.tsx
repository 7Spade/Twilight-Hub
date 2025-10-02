'use client';

import { OrgSpaceDetailsPage } from '@/features/spaces/pages/org-space-details-page';

export default function OrgSpaceDetailsPageWrapper({
  params,
}: {
  params: { organizationslug: string; spaceslug: string };
}) {
  return <OrgSpaceDetailsPage params={params} />;
}
