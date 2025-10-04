'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { defaultNavItems } from '@/components/layout/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Team } from '@/components/layout/team-switcher';
import { useFirestore } from '@/firebase/provider';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, userProfile } = useAuth();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const db = useFirestore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const personalTeam: Team = {
        id: 'user',
        label: userProfile?.displayName || user.displayName || user.email || 'Personal Account',
        isUser: true,
      };
      const orgs: Team[] = [];
      try {
        const ownerQ = query(
          collection(db, 'organizations'),
          where('ownerId', '==', user.uid)
        );
        const memberQ = query(
          collection(db, 'organizations'),
          where('memberIds', 'array-contains', user.uid)
        );
        const [ownerSnap, memberSnap] = await Promise.all([getDocs(ownerQ), getDocs(memberQ)]);
        const seen = new Set<string>();
        for (const d of [...ownerSnap.docs, ...memberSnap.docs]) {
          if (seen.has(d.id)) continue;
          seen.add(d.id);
          const data = d.data() as any;
          orgs.push({ id: d.id, label: data?.name || d.id, isUser: false, slug: data?.slug || d.id });
        }
      } catch {
        // ignore for minimal path
      }
      const all = [personalTeam, ...orgs];
      setTeams(all);
      setSelectedTeam(all[0] || personalTeam);
    };
    load();
  }, [db, user, userProfile]);

  useEffect(() => {
    if (selectedTeam && !selectedTeam.isUser) {
      const slug = selectedTeam.slug || selectedTeam.id;
      router.push(`/organizations/${slug}`);
    }
  }, [selectedTeam, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isCollapsed={isCollapsed}
        teams={teams}
        selectedTeam={selectedTeam}
        setSelectedTeam={(t: Team) => setSelectedTeam(t)}
        navItems={defaultNavItems}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}