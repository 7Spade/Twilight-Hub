'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { generateAvatar, HashAvatarResult } from '@/lib/hash-avatar';

interface HashAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  provider?: 'hash' | 'dicebear' | 'multiavatar';
  style?: string;
  alt?: string;
  fallback?: string;
}

export function HashAvatar({
  seed,
  size = 40,
  className = '',
  provider = 'dicebear',
  style = 'identicon',
  alt,
  fallback
}: HashAvatarProps) {
  const [avatarData, setAvatarData] = useState<HashAvatarResult | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!seed) return;

    setIsLoading(true);
    setError(false);

    try {
      const result = generateAvatar(seed, {
        provider,
        style,
        size
      });
      
      setAvatarData(result);
    } catch (err) {
      console.error('Failed to generate avatar:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [seed, provider, style, size]);

  if (isLoading) {
    return (
      <div 
        className={`bg-muted animate-pulse rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (error || !avatarData) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center rounded-full text-muted-foreground text-sm font-medium ${className}`}
        style={{ width: size, height: size }}
      >
        {fallback || seed.charAt(0).toUpperCase()}
      </div>
    );
  }

  // 如果是 DiceBear 或 Multiavatar 的 URL
  if (typeof avatarData === 'string') {
    return (
      <Image
        src={avatarData}
        alt={alt || `Avatar for ${seed}`}
        width={size}
        height={size}
        className={`rounded-full ${className}`}
        onError={() => setError(true)}
      />
    );
  }

  // 如果是自定義哈希頭像
  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={avatarData.dataUrl}
        alt={alt || `Avatar for ${seed}`}
        width={size}
        height={size}
        onError={() => setError(true)}
      />
    </div>
  );
}

// 預設的頭像組件
export function IdenticonAvatar(props: Omit<HashAvatarProps, 'provider' | 'style'>) {
  return <HashAvatar {...props} provider="dicebear" style="identicon" />;
}

export function InitialsAvatar(props: Omit<HashAvatarProps, 'provider' | 'style'>) {
  return <HashAvatar {...props} provider="dicebear" style="initials" />;
}

export function BotAvatar(props: Omit<HashAvatarProps, 'provider' | 'style'>) {
  return <HashAvatar {...props} provider="dicebear" style="bottts" />;
}

export function CustomHashAvatar(props: Omit<HashAvatarProps, 'provider'>) {
  return <HashAvatar {...props} provider="hash" />;
}
