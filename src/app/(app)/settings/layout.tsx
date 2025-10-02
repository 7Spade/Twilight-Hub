'use client';

import { NavItem } from '@/components/layout/nav';
import { PageContainer } from '@/components/layout/page-container';
import { UserProfileCard } from '@/components/user-profile-card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Bell, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const settingsNavItems: NavItem[] = [
    { href: '/settings/profile', icon: User, label: 'Public profile' },
    { href: '/settings/account', icon: SettingsIcon, label: 'Account' },
    { href: '/settings/notifications', icon: Bell, label: 'Notifications' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <PageContainer
      title="Settings"
      description="Manage your account settings and set e-mail preferences."
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <aside className="hidden md:block md:col-span-1">
            <UserProfileCard />
        </aside>
        <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <nav className="lg:col-span-1 grid gap-1">
                {settingsNavItems.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary',
                        isActive && 'bg-muted text-primary font-semibold'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
            <main className="lg:col-span-2">
                {children}
            </main>
        </div>
      </div>
    </PageContainer>
  );
}
