'use client';

import { OrgSpacesPage } from '@/features/spaces/pages/org-spaces-page';

export default function OrgSpacesPageWrapper({
  params,
}: {
  params: { organizationslug: string };
}) {
  return <OrgSpacesPage params={params} />;
}
