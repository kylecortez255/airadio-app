import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addHours } from 'date-fns';
import { useNotificationStore } from './notificationStore';

export interface UploadedTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  playCount: number;
  audioUrl: string;
  coverUrl?: string;
  scheduledTime?: Date;
  lastPlayed?: Date;
  isScheduled: boolean;
}

interface MusicUploadState {
  uploads: UploadedTrack[];
  uploadTrack: (data: {
    file: File;
    title: string;
    artist: string;
    genre: string;
    userId: string;
    coverImage?: File;
  }) => Promise<void>;
  getUploadsByUser: (userId: string) => UploadedTrack[];
  getPendingTracks: () => UploadedTrack[];
  getApprovedTracks: () => UploadedTrack[];
  getScheduledTracks: () => UploadedTrack[];
  getNextScheduledTrack: () => UploadedTrack | null;
  approveTrack: (trackId: string) => void;
  rejectTrack: (trackId: string) => void;
  scheduleTrack: (trackId: string, time?: Date) => void;
  markAsPlayed: (trackId: string) => void;
  incrementPlayCount: (trackId: string) => void;
}

export const useMusicUploadStore = create<MusicUploadState>()(
  persist(
    (set, get) => ({
      uploads: [],

      uploadTrack: async ({ file, title, artist, genre, userId, coverImage }) => {
        const audioUrl = URL.createObjectURL(file);
        let coverUrl;
        
        if (coverImage) {
          coverUrl = URL.createObjectURL(coverImage);
        }

        const scheduledTime = addHours(new Date(), Math.floor(Math.random() * 24));
        
        const newTrack: UploadedTrack = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          artist,
          genre,
          userId,
          status: 'pending',
          uploadedAt: new Date(),
          playCount: 0,
          audioUrl,
          coverUrl,
          scheduledTime,
          isScheduled: false,
        };

        set((state) => ({
          uploads: [...state.uploads, newTrack],
        }));

        const { addNotification } = useNotificationStore.getState();
        addNotification({
          type: 'music',
          title: 'Track Uploaded Successfully',
          message: `Your track "${title}" has been uploaded and will be reviewed shortly.`,
          scheduledTime,
        });
      },

      getUploadsByUser: (userId) => {
        return get().uploads.filter((track) => track.userId === userId);
      },

      getPendingTracks: () => {
        return get().uploads.filter((track) => track.status === 'pending');
      },

      getApprovedTracks: () => {
        return get().uploads
          .filter((track) => track.status === 'approved')
          .sort((a, b) => b.playCount - a.playCount);
      },

      getScheduledTracks: () => {
        const now = new Date();
        return get().uploads
          .filter((track) => 
            track.status === 'approved' && 
            track.isScheduled &&
            track.scheduledTime &&
            track.scheduledTime > now
          )
          .sort((a, b) => 
            (a.scheduledTime?.getTime() || 0) - (b.scheduledTime?.getTime() || 0)
          );
      },

      getNextScheduledTrack: () => {
        const now = new Date();
        return get().uploads.find((track) => 
          track.status === 'approved' &&
          track.isScheduled &&
          track.scheduledTime &&
          track.scheduledTime > now
        ) || null;
      },

      approveTrack: (trackId) => {
        set((state) => ({
          uploads: state.uploads.map((track) => {
            if (track.id === trackId) {
              const scheduledTime = addHours(new Date(), Math.floor(Math.random() * 24));
              
              const { addNotification } = useNotificationStore.getState();
              addNotification({
                type: 'music',
                title: 'Track Approved',
                message: `Your track "${track.title}" has been approved and scheduled for ${scheduledTime.toLocaleString()}`,
                scheduledTime,
              });

              return { 
                ...track, 
                status: 'approved',
                scheduledTime,
                isScheduled: true
              };
            }
            return track;
          }),
        }));
      },

      rejectTrack: (trackId) => {
        set((state) => ({
          uploads: state.uploads.map((track) => {
            if (track.id === trackId) {
              const { addNotification } = useNotificationStore.getState();
              addNotification({
                type: 'music',
                title: 'Track Rejected',
                message: `Your track "${track.title}" was not approved for the rotation.`,
              });
              return { ...track, status: 'rejected', isScheduled: false };
            }
            return track;
          }),
        }));
      },

      scheduleTrack: (trackId, time) => {
        set((state) => ({
          uploads: state.uploads.map((track) => {
            if (track.id === trackId && track.status === 'approved') {
              const scheduledTime = time || addHours(new Date(), Math.floor(Math.random() * 24));
              
              const { addNotification } = useNotificationStore.getState();
              addNotification({
                type: 'music',
                title: 'Track Scheduled',
                message: `Your track "${track.title}" has been scheduled for ${scheduledTime.toLocaleString()}`,
                scheduledTime,
              });

              return {
                ...track,
                scheduledTime,
                isScheduled: true
              };
            }
            return track;
          }),
        }));
      },

      markAsPlayed: (trackId) => {
        set((state) => ({
          uploads: state.uploads.map((track) => {
            if (track.id === trackId) {
              // Schedule next play in 24-48 hours
              const nextPlay = addHours(new Date(), 24 + Math.floor(Math.random() * 24));
              
              return {
                ...track,
                lastPlayed: new Date(),
                scheduledTime: nextPlay,
                playCount: track.playCount + 1
              };
            }
            return track;
          }),
        }));
      },

      incrementPlayCount: (trackId) => {
        set((state) => ({
          uploads: state.uploads.map((track) => {
            if (track.id === trackId) {
              const newCount = track.playCount + 1;
              if (newCount % 10 === 0) {
                const { addNotification } = useNotificationStore.getState();
                addNotification({
                  type: 'music',
                  title: 'Track Milestone',
                  message: `Your track "${track.title}" has been played ${newCount} times!`,
                });
              }
              return { ...track, playCount: newCount };
            }
            return track;
          }),
        }));
      },
    }),
    {
      name: 'music-upload-storage',
    }
  )
);