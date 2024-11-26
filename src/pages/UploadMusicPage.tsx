import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMusicUploadStore } from '../store/musicUploadStore';
import { Music, Upload, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCEPTED_FORMATS = ['.mp3', '.wav', '.m4a'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadMusicPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const { uploadTrack } = useMusicUploadStore();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
      // Auto-fill title from filename
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !file) return;

    setIsSubmitting(true);
    try {
      await uploadTrack({
        file,
        title,
        artist: artist || user.name,
        genre,
        userId: user.id
      });
      setShowSuccess(true);
      setFile(null);
      setTitle('');
      setArtist('');
      setGenre('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error uploading track:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Upload Your Music</h1>
          <p className="text-gray-400">
            Share your music with our listeners and let our AI DJ promote your tracks.
          </p>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <p className="text-green-200">
                Your track has been uploaded successfully! Our AI DJ will add it to the rotation.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <Info className="w-5 h-5" />
            <h2 className="font-semibold">Upload Guidelines</h2>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">1</span>
              Files must be in MP3, WAV, or M4A format
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">2</span>
              Maximum file size: 10MB
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">3</span>
              Ensure you have the rights to share the music
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">4</span>
              Provide accurate track information
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={ACCEPTED_FORMATS.join(',')}
              className="hidden"
              required
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                file ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-500'
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <Music className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-400">{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">
                    Click to select or drag and drop your music file
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {ACCEPTED_FORMATS.join(', ')} formats supported
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Track Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter track title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Artist Name</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={user?.name || 'Enter artist name'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a genre</option>
              <option value="pop">Pop</option>
              <option value="rock">Rock</option>
              <option value="hip-hop">Hip Hop</option>
              <option value="electronic">Electronic</option>
              <option value="jazz">Jazz</option>
              <option value="classical">Classical</option>
              <option value="other">Other</option>
            </select>
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">
                Please sign in to upload your music.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isAuthenticated || isSubmitting || !file}
            className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            {isSubmitting ? 'Uploading...' : 'Upload Track'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          By uploading, you confirm that you have the rights to distribute this music and agree to our terms of service.
        </p>
      </div>
    </div>
  );
}