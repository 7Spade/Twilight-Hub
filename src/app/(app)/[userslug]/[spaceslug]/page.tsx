'use client';
// TODO: [P0] REFACTOR src/app/(app)/[userslug]/[spaceslug]/page.tsx - 將 client 端 redirect 移至 Server Component
// 說明：`redirect` 應優先在伺服端執行以降低邊界複雜度；可改為 server page 直接 `await params` 後 redirect。
// 參考：Next.js App Router（server/client components、redirect、params）。
// @assignee ai

import React from 'react';
import { redirect } from 'next/navigation';

export default function UserSpaceDetailsPageWrapper({
  params,
}: {
  params: Promise<{ userslug: string; spaceslug: string }>;
}) {
  // Redirect to unified space details page
  const { spaceslug } = React.use(params);
  redirect(`/spaces/${spaceslug}`);
}
