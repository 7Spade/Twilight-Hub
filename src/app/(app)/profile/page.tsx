import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { currentUser } from '@/lib/placeholder-data';
import { Award, Edit, Mail, Medal, UserCheck, UserPlus, Users } from 'lucide-react';
import Image from 'next/image';

const badgeIcons: { [key: string]: React.ElementType } = {
    Founder: Medal,
    'Top Contributor': Award,
    'Beta Tester': UserCheck,
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and see your achievements.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                        <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                        <p className="text-muted-foreground">@{currentUser.username}</p>
                        <div className="flex items-center gap-2 mt-2 text-muted-foreground justify-center md:justify-start">
                            <Mail className="h-4 w-4" />
                            <span>{currentUser.email}</span>
                        </div>
                    </div>
                    <Button variant="outline" className="md:ml-auto">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Badges you've unlocked on your journey.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {currentUser.badges.map((badge, index) => {
                            const Icon = badgeIcons[badge.name] || Award;
                            return (
                                <div key={index} className="flex flex-col items-center gap-2 p-4 border rounded-lg w-32 text-center">
                                    <div className="p-3 rounded-full bg-muted">
                                        <Icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <span className="font-medium text-sm">{badge.name}</span>
                                    <span className="text-xs text-muted-foreground">{badge.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Socials</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Followers</span>
                        </div>
                        <span className="font-bold">{currentUser.followers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserCheck className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">Following</span>
                        </div>
                        <span className="font-bold">{currentUser.following}</span>
                    </div>
                    <Button className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                    </Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
