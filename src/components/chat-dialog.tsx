'use client';

import Draggable from 'react-draggable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { GripVertical, Search, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { useChatStore } from '@/hooks/use-chat-store';

// Placeholder data - we will replace this with Firestore data later
const placeholderUser = {
  id: 'user-placeholder',
  name: 'Jane Doe',
  avatarUrl: getPlaceholderImage('avatar-2').imageUrl,
};

const placeholderConversations = [
  {
    id: 'convo-1',
    user: {
      id: 'user-1',
      name: 'Alice',
      avatarUrl: getPlaceholderImage('avatar-3').imageUrl,
    },
    lastMessage: 'Sounds good, let me know!',
    time: '10:42 AM',
    messages: [
      {
        sender: {
          id: 'user-1',
          name: 'Alice',
          avatarUrl: getPlaceholderImage('avatar-3').imageUrl,
        },
        text: 'Hey, how is the project going?',
      },
      {
        sender: placeholderUser,
        text: 'Hi Alice! Going well, making good progress.',
      },
      {
        sender: {
          id: 'user-1',
          name: 'Alice',
          avatarUrl: getPlaceholderImage('avatar-3').imageUrl,
        },
        text: 'Great to hear. I have some feedback on the latest designs.',
      },
      { sender: placeholderUser, text: 'Oh, sure. Send it over.' },
      {
        sender: {
          id: 'user-1',
          name: 'Alice',
          avatarUrl: getPlaceholderImage('avatar-3').imageUrl,
        },
        text: 'Sounds good, let me know!',
      },
    ],
  },
  {
    id: 'convo-2',
    user: {
      id: 'user-2',
      name: 'Bob',
      avatarUrl: getPlaceholderImage('avatar-4').imageUrl,
    },
    lastMessage: 'Can we sync up tomorrow?',
    time: '9:15 AM',
    messages: [
      {
        sender: {
          id: 'user-2',
          name: 'Bob',
          avatarUrl: getPlaceholderImage('avatar-4').imageUrl,
        },
        text: 'Can we sync up tomorrow?',
      },
    ],
  },
];

export function ChatDialog() {
  const { isOpen, close } = useChatStore();
  const { user: currentUser } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(
    placeholderConversations[0]
  );
  const nodeRef = React.useRef(null);

  if (!isOpen) return null;

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle">
        <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent
            ref={nodeRef}
            className="p-0 w-full max-w-4xl h-[600px] flex flex-col fixed bottom-4 right-4 !m-0 !translate-x-0 !translate-y-0"
            onPointerDownOutside={(e) => e.preventDefault()}
        >
            <Card className="h-full w-full flex flex-col border-0">
            <DialogHeader className="drag-handle cursor-move p-4 border-b flex-row items-center justify-between space-y-0">
                <div className='flex items-center gap-2'>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <DialogTitle>Messages</DialogTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={close} className="h-6 w-6">
                    <X className="h-4 w-4" />
                </Button>
            </DialogHeader>

            <div className="flex-1 grid md:grid-cols-[300px_1fr] overflow-hidden">
                <div className="flex flex-col h-full border-r">
                <div className="p-4 border-b">
                    <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-8" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {placeholderConversations.map((convo) => (
                    <div
                        key={convo.id}
                        className={cn(
                        'flex items-center gap-3 p-3 text-sm cursor-pointer border-b',
                        selectedConversation &&
                            convo.id === selectedConversation.id
                            ? 'bg-muted'
                            : 'hover:bg-muted/50'
                        )}
                        onClick={() => setSelectedConversation(convo)}
                    >
                        <Avatar className="h-10 w-10 border">
                        <AvatarImage
                            src={convo.user.avatarUrl}
                            alt={convo.user.name}
                        />
                        <AvatarFallback>
                            {convo.user.name.charAt(0)}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{convo.user.name}</p>
                        <p className="text-muted-foreground truncate">
                            {convo.lastMessage}
                        </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                        {convo.time}
                        </span>
                    </div>
                    ))}
                </ScrollArea>
                </div>
                {selectedConversation && currentUser ? (
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 p-3 border-b">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage
                        src={selectedConversation.user.avatarUrl}
                        alt={selectedConversation.user.name}
                        />
                        <AvatarFallback>
                        {selectedConversation.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">
                        {selectedConversation.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                        {selectedConversation.messages.map(
                        (msg: any, index: number) => (
                            <div
                            key={index}
                            className={cn(
                                'flex items-end gap-2',
                                msg.sender.id !== currentUser.uid
                                ? ''
                                : 'justify-end'
                            )}
                            >
                            {msg.sender.id !== currentUser.uid && (
                                <Avatar className="h-8 w-8 border">
                                <AvatarImage
                                    src={msg.sender.avatarUrl}
                                    alt={msg.sender.name}
                                />
                                <AvatarFallback>
                                    {msg.sender.name.charAt(0)}
                                </AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                'max-w-xs rounded-lg p-3 text-sm',
                                msg.sender.id !== currentUser.uid
                                    ? 'bg-muted'
                                    : 'bg-primary text-primary-foreground'
                                )}
                            >
                                {msg.text}
                            </div>
                            </div>
                        )
                        )}
                    </div>
                    </ScrollArea>
                    <CardFooter className="p-4 border-t">
                    <div className="relative w-full">
                        <Input
                        placeholder="Type a message..."
                        className="pr-12"
                        />
                        <Button
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        >
                        <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    </CardFooter>
                </div>
                ) : (
                <div className="border-l flex items-center justify-center h-full text-muted-foreground">
                    Select a conversation to start chatting.
                </div>
                )}
            </div>
            </Card>
        </DialogContent>
        </Dialog>
    </Draggable>
  );
}
