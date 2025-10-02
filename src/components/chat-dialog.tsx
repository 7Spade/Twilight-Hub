/**
 * @fileoverview A draggable, minimizable chat dialog component.
 * It uses a global Zustand store (`useChatStore`) to manage its open/minimized state.
 * The component features a conversation list and a message view for the selected conversation.
 * Currently, it uses static placeholder data for demonstration purposes.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { GripVertical, Search, Send, X, Minimize2, MessageSquare } from 'lucide-react';

import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useChatStore } from '@/hooks/use-chat-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

/* ---------------------------- Placeholder Data ---------------------------- */
const placeholderUser = {
  id: 'user-placeholder',
  name: 'Jane Doe',
  avatarUrl: getPlaceholderImage('avatar-2').imageUrl,
};

const placeholderConversations = [
  {
    id: 'convo-1',
    user: { id: 'user-1', name: 'Alice', avatarUrl: getPlaceholderImage('avatar-3').imageUrl },
    lastMessage: 'Sounds good, let me know!',
    time: '10:42 AM',
    messages: [
      { sender: { id: 'user-1', name: 'Alice', avatarUrl: getPlaceholderImage('avatar-3').imageUrl }, text: 'Hey, how is the project going?' },
      { sender: placeholderUser, text: 'Hi Alice! Going well, making good progress.' },
      { sender: { id: 'user-1', name: 'Alice', avatarUrl: getPlaceholderImage('avatar-3').imageUrl }, text: 'Great to hear. I have some feedback on the latest designs.' },
      { sender: placeholderUser, text: 'Oh, sure. Send it over.' },
      { sender: { id: 'user-1', name: 'Alice', avatarUrl: getPlaceholderImage('avatar-3').imageUrl }, text: 'Sounds good, let me know!' },
    ],
  },
  {
    id: 'convo-2',
    user: { id: 'user-2', name: 'Bob', avatarUrl: getPlaceholderImage('avatar-4').imageUrl },
    lastMessage: 'Can we sync up tomorrow?',
    time: '9:15 AM',
    messages: [{ sender: { id: 'user-2', name: 'Bob', avatarUrl: getPlaceholderImage('avatar-4').imageUrl }, text: 'Can we sync up tomorrow?' }],
  },
];

/* ----------------------------- ChatDialog Component ---------------------------- */
export function ChatDialog() {
  const { isOpen, close, isMinimized, toggleMinimize } = useChatStore();
  const { user: currentUser } = useUser();
  const [selectedConversation, setSelectedConversation] = useState(placeholderConversations[0]);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the dialog is opened from a fully closed state, ensure it's not minimized
    if (isOpen && isMinimized) {
      toggleMinimize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // Minimized View
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={toggleMinimize}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  // Expanded View
  return (
    <Dialog open={isOpen} onOpenChange={!isMinimized ? close : undefined}>
      <DialogContent
        className="p-0 border-none bg-transparent shadow-none w-auto h-auto !max-w-none fixed bottom-4 right-4 !m-0 !translate-x-0 !translate-y-0"
        onInteractOutside={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <Draggable nodeRef={nodeRef} handle=".drag-handle">
          <Card ref={nodeRef} className="h-[600px] w-full max-w-4xl flex flex-col border shadow-2xl">
            <DialogHeader className="drag-handle cursor-move p-4 border-b flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <DialogTitle>Messages</DialogTitle>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-6 w-6">
                  <Minimize2 className="h-4 w-4" />
                  <span className="sr-only">Minimize chat</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={close} className="h-6 w-6">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close chat</span>
                </Button>
              </div>
            </DialogHeader>

            <div className="flex-1 grid md:grid-cols-[300px_1fr] overflow-hidden">
              {/* Conversation List */}
              <aside className="flex flex-col h-full border-r">
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
                        selectedConversation?.id === convo.id ? 'bg-muted' : 'hover:bg-muted/50'
                      )}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={convo.user.avatarUrl} alt={convo.user.name} />
                        <AvatarFallback>{convo.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{convo.user.name}</p>
                        <p className="text-muted-foreground truncate">{convo.lastMessage}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{convo.time}</span>
                    </div>
                  ))}
                </ScrollArea>
              </aside>

              {/* Selected Conversation */}
              {selectedConversation && currentUser ? (
                <div className="flex flex-col h-full">
                  <header className="flex items-center gap-3 p-3 border-b">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={selectedConversation.user.avatarUrl} alt={selectedConversation.user.name} />
                      <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.user.name}</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </header>

                  <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                      {selectedConversation.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={cn(
                            'flex items-end gap-2',
                            msg.sender.id === currentUser.uid ? 'justify-end' : ''
                          )}
                        >
                          {msg.sender.id !== currentUser.uid && (
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage src={msg.sender.avatarUrl} alt={msg.sender.name} />
                              <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
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
                      ))}
                    </div>
                  </ScrollArea>

                  <footer className="p-4 border-t">
                    <div className="relative w-full">
                      <Input placeholder="Type a message..." className="pr-12" />
                      <Button size="icon" className="absolute right-1 top-1 h-8 w-8">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </footer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a conversation to start chatting.
                </div>
              )}
            </div>
          </Card>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}
