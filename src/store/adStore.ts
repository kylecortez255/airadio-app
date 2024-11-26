import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addHours, addMinutes } from 'date-fns';
import { useNotificationStore } from './notificationStore';

export interface Advertisement {
  id: string;
  text: string;
  link?: string;
  userId: string;
  createdAt: Date;
  status: 'pending' | 'active' | 'completed';
  announcementCount: number;
  maxAnnouncements: number;
  scheduledTimes: Date[];
}

interface AdStore {
  ads: Advertisement[];
  submitAd: (text: string, link: string | undefined, userId: string) => Promise<void>;
  getActiveAds: () => Advertisement[];
  updateAnnouncementCount: (adId: string) => void;
}

export const useAdStore = create<AdStore>()(
  persist(
    (set, get) => ({
      ads: [],

      submitAd: async (text: string, link: string | undefined, userId: string) => {
        // Generate 5 scheduled times over the next 24 hours
        const now = new Date();
        const scheduledTimes = Array.from({ length: 5 }, (_, i) => {
          const hours = Math.floor(Math.random() * 24); // Random hour in next 24 hours
          const minutes = Math.floor(Math.random() * 60); // Random minute
          return addMinutes(addHours(now, hours), minutes);
        }).sort((a, b) => a.getTime() - b.getTime());

        const newAd: Advertisement = {
          id: Math.random().toString(36).substr(2, 9),
          text,
          link,
          userId,
          createdAt: now,
          status: 'active',
          announcementCount: 0,
          maxAnnouncements: 5,
          scheduledTimes,
        };

        set((state) => ({
          ads: [...state.ads, newAd],
        }));

        // Add notification for the new ad
        const { addNotification } = useNotificationStore.getState();
        addNotification({
          type: 'ad',
          title: 'Advertisement Scheduled',
          message: `Your ad "${text.substring(0, 30)}..." has been scheduled for ${scheduledTimes.length} announcements.`,
          scheduledTime: scheduledTimes[0],
          link: '/submit-ad',
        });
      },

      getActiveAds: () => {
        return get().ads.filter((ad) => ad.status === 'active');
      },

      updateAnnouncementCount: (adId: string) => {
        set((state) => ({
          ads: state.ads.map((ad) => {
            if (ad.id === adId) {
              const newCount = ad.announcementCount + 1;
              const newStatus = newCount >= ad.maxAnnouncements ? 'completed' : 'active';
              
              if (newStatus === 'completed') {
                const { addNotification } = useNotificationStore.getState();
                addNotification({
                  type: 'ad',
                  title: 'Advertisement Completed',
                  message: `Your ad has completed all ${ad.maxAnnouncements} scheduled announcements.`,
                });
              }

              return {
                ...ad,
                announcementCount: newCount,
                status: newStatus,
              };
            }
            return ad;
          }),
        }));
      },
    }),
    {
      name: 'ad-storage',
    }
  )
);