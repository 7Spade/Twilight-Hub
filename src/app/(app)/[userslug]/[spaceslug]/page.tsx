'use client';

import { redirect, useParams } from 'next/navigation';

export default function UserSpaceDetailsPageWrapper() {
  const params = useParams();
  const spaceslug = (params?.spaceslug as string) || '';
  if (spaceslug) {
    // 與 src copy 一致：導向統一的 Space 詳情頁
    redirect(`/spaces/${spaceslug}`);
  }
  return null;
}

/**
 * 用戶空間詳情頁：最小化處理，統一導向 /spaces/[spaceslug]
 */