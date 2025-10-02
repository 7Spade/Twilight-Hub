'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, User, Package } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const placeholderNotifications = [
    {
        id: 'notif-1',
        fromUserId: 'user-1',
        type: 'follow',
        text: 'Alice started following you.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: false,
    },
    {
        id: 'notif-2',
        fromUserId: 'user-2',
        type: 'space_invite',
        text: 'Bob invited you to join the "Project Phoenix" space.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
    },
    {
        id: 'notif-3',
        fromUserId: 'system',
        type: 'module_update',
        text: 'A new version of the "Data Analytics" module is available.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
    }
]

const iconMap: { [key: string]: React.ElementType } = {
    follow: User,
    space_invite: Bell,
    module_update: Package,
    default: Bell,
}


function NotificationItem({ notification }: { notification: any }) {
    const Icon = iconMap[notification.type] || iconMap.default;

    return (
        <div
            key={notification.id}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
        >
            <div className="p-2 bg-muted rounded-full">
                <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid gap-1 flex-1">
                <p className="text-sm text-foreground">
                    {notification.text}
                </p>
                <p className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            {!notification.read && (
                 <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
            )}
        </div>
    )
}

export function NotificationPopover() {
    const notifications = placeholderNotifications;
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                 <Card className="border-0">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            You have {unreadCount} unread messages.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-2">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <NotificationItem key={notification.id} notification={notification} />
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-4">
                                        <Bell className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground">No new notifications.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                 </Card>
            </PopoverContent>
        </Popover>
    )
}
