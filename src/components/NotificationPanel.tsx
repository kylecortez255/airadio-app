import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Music, Speaker, Calendar, X, ExternalLink } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { useNotificationStore } from '../store/notificationStore';
import { cn } from '../lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, clearNotification } = useNotificationStore();

  if (!isOpen) return null;

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const today = new Date().toDateString();
    const notificationDate = new Date(notification.timestamp).toDateString();
    const key = today === notificationDate ? 'Today' : format(new Date(notification.timestamp), 'MMM dd, yyyy');
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(notification);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          <AnimatePresence mode="popLayout">
            {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <div key={date}>
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm p-4 border-b border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400">{date}</h3>
                </div>
                {dateNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        notification.type === 'music' ? "bg-blue-500/20 text-blue-500" :
                        notification.type === 'ad' ? "bg-green-500/20 text-green-500" :
                        "bg-purple-500/20 text-purple-500"
                      )}>
                        {notification.type === 'music' ? (
                          <Music className="w-5 h-5" />
                        ) : notification.type === 'ad' ? (
                          <Speaker className="w-5 h-5" />
                        ) : (
                          <Calendar className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{notification.title}</p>
                        <p className="text-sm text-gray-400">{notification.message}</p>
                        {notification.scheduledTime && (
                          <p className="text-sm text-blue-400 mt-2 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(notification.scheduledTime), 'MMM dd, yyyy HH:mm')}
                          </p>
                        )}
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="text-sm text-blue-400 mt-2 flex items-center gap-1 hover:text-blue-300 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Details
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="text-gray-500 hover:text-gray-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Bell className="w-12 h-12 mb-4 text-gray-600" />
                <p>No notifications yet</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}