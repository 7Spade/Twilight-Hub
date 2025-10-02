'use client';

import React, { Suspense } from 'react';
import { UserSpaceDetailsPage } from '@/features/spaces/pages/user-space-details-page';

export default function UserSpaceDetailsPageWrapper({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string; spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserSpaceDetailsPage params={params} />
    </Suspense>
  );
}
