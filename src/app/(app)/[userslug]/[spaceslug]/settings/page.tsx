'use client';

import { UserSpaceSettingsPage } from '@/features/spaces/pages/user-space-settings-page';

export default function UserSpaceSettingsPageWrapper({
  params,
}: {
  params: { userslug: string; spaceslug: string };
}) {
  return <UserSpaceSettingsPage params={params} />;
}
