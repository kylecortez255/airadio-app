import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAdStore } from '../store/adStore';
import { DollarSign, AlertCircle, Radio, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SubmitAdPage() {
  const [adText, setAdText] = useState('');
  const [adLink, setAdLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { submitAd } = useAdStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;
    
    setIsSubmitting(true);
    try {
      await submitAd(adText, adLink || undefined, user.id);
      setShowSuccess(true);
      setAdText('');
      setAdLink('');
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting ad:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Submit Your Advertisement</h1>
          <p className="text-gray-400">
            Get your message across to thousands of listeners through our AI DJ announcements.
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
                Your advertisement has been submitted successfully! Our AI DJ will start announcing it shortly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <Radio className="w-5 h-5" />
            <h2 className="font-semibold">How it works</h2>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">1</span>
              Write your ad text (max 100 characters)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">2</span>
              Add an optional link to your website or product
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">3</span>
              Pay $10 per ad submission
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm">4</span>
              Your ad will be announced 5 times by our AI DJ
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Advertisement Text
            </label>
            <textarea
              value={adText}
              onChange={(e) => setAdText(e.target.value)}
              maxLength={100}
              rows={3}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your advertisement text..."
              required
            />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>{adText.length}/100 characters</span>
              <span>$10 per submission</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Website Link (Optional)
            </label>
            <input
              type="url"
              value={adLink}
              onChange={(e) => setAdLink(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-website.com"
            />
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">
                Please sign in to submit your advertisement.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isAuthenticated || isSubmitting || adText.length === 0}
            className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <DollarSign className="w-5 h-5" />
            {isSubmitting ? 'Processing...' : 'Pay $10 and Submit'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-400">
          By submitting an ad, you agree to our terms and conditions regarding advertisement content.
        </p>
      </div>
    </div>
  );
}