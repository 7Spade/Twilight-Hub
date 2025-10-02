'use client';

import React, { Suspense } from 'react';
import { UserProfilePage } from '@/features/users/pages/user-profile-page';

export default function UserProfilePageWrapper({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string }>;
}) {
  const params = React.use(paramsPromise);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfilePage userslug={params.userslug} />
    </Suspense>
  );
}
