import { redirect } from 'next/navigation';

export default async function OrgSpaceDetailsPageWrapper({
  params,
}: {
  params: Promise<{ organizationslug?: string; spaceslug: string }>;
}) {
  // Redirect to unified space details page
  const { spaceslug } = await params;
  redirect(`/spaces/${spaceslug}`);
}
