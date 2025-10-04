'use client';

import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore, useUser } from '@/firebase/provider';
import { useAuth } from '@/hooks/use-auth';
import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Search } from 'lucide-react';
import Link from 'next/link';

type Organization = { 
  id: string; 
  name?: string; 
  slug?: string;
  description?: string;
  ownerId?: string;
  memberIds?: string[];
  isPublic?: boolean;
};

export default function OrganizationsPage() {
  const { user } = useUser();
  const { userProfile } = useAuth();
  const db = useFirestore();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setError(null);
        setLoading(true);
        const snap = await getDocs(collection(db, 'organizations'));
        const organizations = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Organization));
        setOrgs(organizations);
      } catch (e: any) {
        setError(e?.message || 'Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };
    
    if (db && user) {
      loadOrganizations();
    }
  }, [db, user]);

  const filteredOrgs = orgs.filter(org => 
    !search.trim() || 
    org.name?.toLowerCase().includes(search.toLowerCase()) ||
    org.description?.toLowerCase().includes(search.toLowerCase())
  );

  const isOwner = (org: Organization) => org.ownerId === user?.uid;
  const isMember = (org: Organization) => org.memberIds?.includes(user?.uid || '');

  return (
    <PageContainer 
      title="組織" 
      description="管理和瀏覽您的組織"
    >
      <div className="space-y-6">
        {/* 搜尋和操作欄 */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜尋組織..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button asChild>
            <Link href="/organizations/create">
              <Plus className="mr-2 h-4 w-4" />
              創建組織
            </Link>
          </Button>
        </div>

        {/* 組織列表 */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">載入組織中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              重試
            </Button>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暫無組織</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search ? '沒有找到符合搜尋條件的組織' : '您還沒有加入任何組織'}
            </p>
            {!search && (
              <Button asChild>
                <Link href="/organizations/create">
                  <Plus className="mr-2 h-4 w-4" />
                  創建第一個組織
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <Card key={org.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="truncate">{org.name || org.id}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      {isOwner(org) && (
                        <Badge variant="secondary" className="text-xs">擁有者</Badge>
                      )}
                      {isMember(org) && !isOwner(org) && (
                        <Badge variant="outline" className="text-xs">成員</Badge>
                      )}
                      {org.isPublic && (
                        <Badge variant="outline" className="text-xs">公開</Badge>
                      )}
                    </div>
                  </div>
                  {org.description && (
                    <CardDescription className="line-clamp-2">{org.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {org.memberIds?.length || 0} 個成員
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/organizations/${org.slug || org.id}`}>
                      進入組織
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}