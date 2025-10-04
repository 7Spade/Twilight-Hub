import { redirect } from 'next/navigation';

export default async function UserSpaceDetailsPageWrapper({
  params,
}: {
  params: Promise<{ userslug: string; spaceslug: string }>;
}) {
  // Redirect to unified space details page
  const { spaceslug } = await params;
  redirect(`/spaces/${spaceslug}`);
}
