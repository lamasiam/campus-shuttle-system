import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, BellOff, Clock, MapPin, AlertTriangle, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface Notification {
  id: string;
  type: 'arrival' | 'delay' | 'route-change' | 'booking-confirmation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
}

export function NotificationCenter({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  notificationsEnabled,
  onToggleNotifications,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <MapPin size={20} />
          </div>
        );
      case 'delay':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
            <Clock size={20} />
          </div>
        );
      case 'route-change':
        return (
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
            <AlertTriangle size={20} />
          </div>
        );
      case 'booking-confirmation':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
            <Bell size={20} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shadow-sm border border-slate-100">
            <Bell size={20} />
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string, isRead: boolean) => {
    if (isRead) return 'border-transparent opacity-75';
    switch (priority) {
      case 'high':
        return 'border-l-4 border-rose-500 bg-rose-50/30';
      case 'medium':
        return 'border-l-4 border-amber-500 bg-amber-50/30';
      case 'low':
        return 'border-l-4 border-blue-500 bg-blue-50/30';
      default:
        return 'border-l-4 border-slate-200';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
      <Card className="overflow-hidden border-0 shadow-xl shadow-indigo-100/50 bg-white/70 backdrop-blur-md">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-none rounded-full px-2 py-0 h-5 min-w-5 flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-indigo-400 font-medium">Stay updated on shuttle status and bookings</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllRead}
                disabled={unreadCount === 0}
                className="rounded-xl border-indigo-100 text-indigo-600 font-bold text-xs hover:bg-indigo-50 transition-all disabled:opacity-30"
              >
                Mark all read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Settings */}
          <Card className="p-4 bg-white/50 border-indigo-50 shadow-sm rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl transition-all duration-300 ${notificationsEnabled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                  {notificationsEnabled ? (
                    <Bell size={20} />
                  ) : (
                    <BellOff size={20} />
                  )}
                </div>
                <div>
                  <Label htmlFor="notifications-toggle" className="font-bold text-slate-700">Enable Notifications</Label>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Get real-time updates</p>
                </div>
              </div>
              <Switch
                id="notifications-toggle"
                checked={notificationsEnabled}
                onCheckedChange={onToggleNotifications}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </Card>

          {/* Notifications List */}
          <ScrollArea className="h-[550px] pr-4 -mr-4">
            <div className="space-y-3 pb-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                    <BellOff size={48} className="text-slate-200" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">No notifications yet</h4>
                  <p className="text-sm text-slate-500 max-w-[240px] mt-2 font-medium">You'll see shuttle updates, delays, and booking alerts here.</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`group relative p-4 cursor-pointer transition-all duration-300 hover:shadow-md border border-slate-100 overflow-hidden rounded-2xl ${
                      !notification.read ? 'shadow-sm border-blue-50' : 'bg-white/40 grayscale-[0.5]'
                    } ${getPriorityColor(notification.priority, notification.read)}`}
                    onClick={() => !notification.read && onMarkRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-bold text-slate-900 truncate ${!notification.read ? '' : 'text-slate-600'}`}>
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full text-slate-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        <p className={`text-sm font-medium leading-relaxed ${!notification.read ? 'text-slate-600' : 'text-slate-400'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Clock size={10} />
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <Badge className="bg-blue-600 text-white text-[10px] font-bold rounded-lg px-1.5 py-0 h-4 uppercase tracking-tighter">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
