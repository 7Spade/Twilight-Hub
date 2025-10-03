import { Suspense } from 'react';
import { UserProfilePage } from '@/components/features/users/pages/user-profile-page';

export default async function UserProfilePageWrapper({
  params: paramsPromise,
}: {
  params: Promise<{ userslug: string }>;
}) {
  const params = await paramsPromise;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfilePage userslug={params.userslug} />
    </Suspense>
  );
}
