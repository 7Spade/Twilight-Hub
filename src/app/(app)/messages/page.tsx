import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { conversations, currentUser } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import { Search, Send } from 'lucide-react';

export default function MessagesPage() {
  const selectedConversation = conversations[0];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mb-4">
          Communicate with your connections in real-time.
        </p>
      </div>
      <div className="border rounded-lg w-full flex-1 grid md:grid-cols-[300px_1fr] h-full">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={cn(
                  'flex items-center gap-3 p-3 text-sm cursor-pointer border-b',
                  convo.id === selectedConversation.id
                    ? 'bg-muted'
                    : 'hover:bg-muted/50'
                )}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={convo.user.avatarUrl} alt={convo.user.name} />
                  <AvatarFallback>{convo.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium truncate">{convo.user.name}</p>
                  <p className="text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                <span className="text-xs text-muted-foreground">{convo.time}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-3 border-b">
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src={selectedConversation.user.avatarUrl}
                alt={selectedConversation.user.name}
              />
              <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedConversation.user.name}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {selectedConversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-end gap-2',
                    msg.sender.id === currentUser.id ? 'justify-end' : ''
                  )}
                >
                  {msg.sender.id !== currentUser.id && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={msg.sender.avatarUrl} alt={msg.sender.name} />
                      <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm',
                      msg.sender.id === currentUser.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-12" />
              <Button size="icon" className="absolute right-1 top-1 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
