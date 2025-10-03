'use client';

import { UserProfileCard } from '@/components/user-profile-card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Bell, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/page-container';

const settingsNavItems: { href: string; label: string; icon: React.ElementType }[] = [
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
        <main className="md:col-span-3">
             <div className="flex border-b mb-6">
                {settingsNavItems.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-muted-foreground transition-colors hover:text-primary',
                        isActive && 'border-b-2 border-primary text-primary font-semibold'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
            </div>
            <Card>
                <CardContent className="p-6">
                    {children}
                </CardContent>
            </Card>
        </main>
      </div>
    </PageContainer>
  );
}
