'use client';

import React, { Suspense } from 'react';
import { SpaceDetailsPage } from '@/features/spaces/pages/space-details-page';

export default function SpaceDetailsPageWrapper({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug?: string; userslug?: string; spaceslug:string }>;
}) {
  const params = React.use(paramsPromise);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpaceDetailsPage params={params} />
    </Suspense>
  );
}
