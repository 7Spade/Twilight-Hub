'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Globe, 
  Star,
  Users,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { FirestoreService } from '@/firebase/firestore';
import { UserProfile } from '@/firebase/auth';

interface UserProfileData extends UserProfile {
  stats?: {
    spacesCount: number;
    contractsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export function UserProfilePage({ userId }: { userId: string }) {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const profile = await AuthService.getUserProfile(userId);
        if (!profile) {
          setError('用戶不存在');
          return;
        }

        // 載入用戶統計數據
        const [spacesCount, contractsCount] = await Promise.all([
          FirestoreService.query('spaces', [
            { field: 'ownerId', operator: '==', value: userId }
          ]).then(spaces => spaces.length),
          FirestoreService.query('contracts', [
            { field: 'ownerId', operator: '==', value: userId }
          ]).then(contracts => contracts.length),
        ]);

        setUserProfile({
          ...profile,
          stats: {
            spacesCount,
            contractsCount,
            followersCount: 0, // 待實現
            followingCount: 0, // 待實現
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入用戶資料失敗');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-48"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>載入用戶資料時發生錯誤：{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <User className="mx-auto h-12 w-12 mb-4" />
            <p>用戶不存在</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isOwnProfile = currentUser?.uid === userId;

  return (
    <div className="space-y-6">
      {/* 用戶基本信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName} />
                <AvatarFallback>
                  {getInitials(userProfile.displayName || userProfile.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userProfile.displayName || '未設定名稱'}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {userProfile.email}
                </CardDescription>
              </div>
            </div>
            {isOwnProfile && (
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                編輯資料
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{userProfile.stats?.spacesCount || 0}</div>
              <div className="text-sm text-muted-foreground">空間</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userProfile.stats?.contractsCount || 0}</div>
              <div className="text-sm text-muted-foreground">合約</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userProfile.stats?.followersCount || 0}</div>
              <div className="text-sm text-muted-foreground">追蹤者</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userProfile.stats?.followingCount || 0}</div>
              <div className="text-sm text-muted-foreground">追蹤中</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 詳細信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">註冊時間</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(userProfile.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">最後更新</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(userProfile.updatedAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              角色與權限
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">角色</div>
              <div className="flex gap-2">
                {userProfile.roles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">權限</div>
              <div className="flex gap-2 flex-wrap">
                {userProfile.permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
