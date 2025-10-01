import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { notifications } from '@/lib/placeholder-data';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest activities across your hub.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            You have {notifications.length} unread notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={notification.user.avatarUrl}
                    alt={notification.user.name}
                  />
                  <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1 flex-1">
                  <p className="font-medium leading-none">
                    <span className="font-bold">{notification.user.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notification.text}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {notification.time}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
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
    </div>
  );
}
