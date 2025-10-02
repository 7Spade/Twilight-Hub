'use client';

import React, { Suspense } from 'react';
import { OrgSpaceDetailsPage } from '@/features/spaces/pages/org-space-details-page';

export default function OrgSpaceDetailsPageWrapper({
  params: paramsPromise,
}: {
  params: Promise<{ organizationslug: string; spaceslug: string }>;
}) {
  const params = React.use(paramsPromise);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrgSpaceDetailsPage params={params} />
    </Suspense>
  );
}
