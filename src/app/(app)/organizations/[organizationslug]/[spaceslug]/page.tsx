'use client';
// TODO: [P0] REFACTOR src/app/(app)/organizations/[organizationslug]/[spaceslug]/page.tsx - 伺服端處理 redirect
// 說明：將 params 解析與 redirect 放到 server page，縮小 client 邊界，降低 AI agent 認知負擔。
// @assignee ai

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
