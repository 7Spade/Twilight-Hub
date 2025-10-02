'use client';

import { UserSpaceDetailsPage } from '@/features/spaces/pages/user-space-details-page';

export default function UserSpaceDetailsPageWrapper({
  params,
}: {
  params: { userslug: string; spaceslug: string };
}) {
  return <UserSpaceDetailsPage params={params} />;
}
