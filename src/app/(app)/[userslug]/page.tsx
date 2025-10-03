'use client';

import React, { Suspense } from 'react';
import { UserProfilePage } from '@/components/features/users/pages/user-profile-page';

// TODO: [P1] REFACTOR src/app/(app)/[userslug]/page.tsx - 將 params 解析改由 server page 處理
// 說明：避免在 client 端使用 React.use(params)，改為 server page 解析後以 props 傳入，降低邊界與型別負擔。
// @assignee ai

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
