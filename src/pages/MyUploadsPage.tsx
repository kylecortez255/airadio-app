import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useMusicUploadStore } from '../store/musicUploadStore';
import { Music, PlayCircle, Clock, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export function MyUploadsPage() {
  const { user } = useAuthStore();
  const { getUploadsByUser } = useMusicUploadStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Please sign in to view your uploads</p>
        </div>
      </div>
    );
  }

  const uploads = getUploadsByUser(user.id);

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="w-8 h-8" />
            My Uploads
          </h1>
        </div>

        {uploads.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">You haven't uploaded any tracks yet</p>
            <a
              href="/upload"
              className="inline-flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Upload Your First Track
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {uploads.map((track) => (
              <div
                key={track.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-gray-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{track.title}</h3>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Uploaded {format(new Date(track.uploadedAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      {track.playCount} plays
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {track.status === 'pending' && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Pending Review
                    </span>
                  )}
                  {track.status === 'approved' && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Approved
                    </span>
                  )}
                  {track.status === 'rejected' && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                      Rejected
                    </span>
                  )}
                  
                  {track.audioUrl && (
                    <audio
                      controls
                      className="h-8"
                      src={track.audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}