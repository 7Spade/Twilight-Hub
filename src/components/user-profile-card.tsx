'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Mail, Smile, Users, User } from 'lucide-react';

const achievements = [
    { id: 'yolo', image: getPlaceholderImage('achievement-1').imageUrl, hint: getPlaceholderImage('achievement-1').imageHint },
    { id: 'shark', image: getPlaceholderImage('achievement-2').imageUrl, hint: getPlaceholderImage('achievement-2').imageHint },
    { id: 'cowboy', image: getPlaceholderImage('achievement-3').imageUrl, hint: getPlaceholderImage('achievement-3').imageHint },
];

const organizations = [
    { id: 'org1', image: getPlaceholderImage('org-logo-1').imageUrl, hint: getPlaceholderImage('org-logo-1').imageHint },
    { id: 'org2', image: getPlaceholderImage('org-logo-2').imageUrl, hint: getPlaceholderImage('org-logo-2').imageHint },
]

export function UserProfileCard() {
  const user = {
    name: '7s.i',
    username: '7Spade',
    avatarUrl: 'https://placehold.co/128x128/f0f/333?text=7',
    followers: 1,
    following: 6,
    email: '7s.i@pm.me',
  };

  return (
    <Card className="w-full max-w-xs bg-[#1a1b1e] text-white border-gray-800">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-gray-700">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-pink-400 text-5xl font-bold text-gray-800">
              7
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 bg-gray-700 rounded-full p-1">
            <Smile className="h-4 w-4 text-gray-300" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground text-gray-400">@{user.username}</p>
        </div>

        <Button variant="outline" className="w-full bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">
          Edit profile
        </Button>

        <div className='flex flex-col gap-2 w-full text-sm text-gray-400'>
            <div className="flex items-center gap-4">
                <div className='flex items-center gap-1'>
                    <Users className="h-4 w-4" />
                    <span className="font-bold text-white">{user.followers}</span> follower
                </div>
                <span className='font-bold text-white'>·</span>
                <div>
                    <span className="font-bold text-white">{user.following}</span> following
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
            </div>
        </div>

        <Separator className="bg-gray-700 my-2" />

        <div className="w-full">
            <h3 className="font-semibold text-white mb-3">Achievements</h3>
            <div className="flex items-center gap-3">
                {achievements.map((ach) => (
                    <Avatar key={ach.id} className="h-12 w-12 border-2 border-gray-700">
                        <AvatarImage src={ach.image} alt={ach.id} data-ai-hint={ach.hint} />
                        <AvatarFallback>{ach.id.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>

        <Separator className="bg-gray-700 my-2" />

        <div className="w-full">
            <h3 className="font-semibold text-white mb-3">Organizations</h3>
             <div className="flex items-center gap-3">
                {organizations.map((org) => (
                    <Avatar key={org.id} className="h-10 w-10 rounded-md border-2 border-gray-700">
                        <AvatarImage src={org.image} alt={org.id} data-ai-hint={org.hint} />
                        <AvatarFallback>{org.id.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
