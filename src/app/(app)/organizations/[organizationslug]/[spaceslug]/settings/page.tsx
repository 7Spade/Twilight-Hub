'use client';

import { OrgSpaceSettingsPage } from '@/features/spaces/pages/org-space-settings-page';

export default function OrgSpaceSettingsPageWrapper({
  params,
}: {
  params: { organizationslug: string; spaceslug: string };
}) {
  return <OrgSpaceSettingsPage params={params} />;
}
