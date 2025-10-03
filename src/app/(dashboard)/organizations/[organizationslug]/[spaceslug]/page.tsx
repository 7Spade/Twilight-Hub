'use client';

import React from 'react';
import { redirect } from 'next/navigation';

export default function OrgSpaceDetailsPageWrapper({
  params,
}: {
  params: Promise<{ organizationslug?: string; spaceslug: string }>;
}) {
  // Redirect to unified space details page
  const { spaceslug } = React.use(params);
  redirect(`/spaces/${spaceslug}`);
}
