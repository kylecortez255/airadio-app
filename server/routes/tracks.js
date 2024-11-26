import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import Track from '../models/Track.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/tracks/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an audio file'));
    }
  }
});

// Upload a new track
router.post('/', auth, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist, genre } = req.body;
    const audioFile = req.files['audio'][0];
    const coverFile = req.files['cover']?.[0];

    const track = new Track({
      title,
      artist,
      genre,
      userId: req.user.userId,
      audioUrl: `/uploads/tracks/${audioFile.filename}`,
      coverUrl: coverFile ? `/uploads/tracks/${coverFile.filename}` : undefined
    });

    await track.save();
    res.status(201).json(track);
  } catch (error) {
    console.error('Upload track error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all approved tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find({ status: 'approved' })
      .sort({ uploadedAt: -1 })
      .populate('userId', 'name');
    res.json(tracks);
  } catch (error) {
    console.error('Get tracks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's tracks
router.get('/my-tracks', auth, async (req, res) => {
  try {
    const tracks = await Track.find({ userId: req.user.userId })
      .sort({ uploadedAt: -1 });
    res.json(tracks);
  } catch (error) {
    console.error('Get user tracks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update track status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(track);
  } catch (error) {
    console.error('Update track status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment play count
router.post('/:id/play', async (req, res) => {
  try {
    const track = await Track.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { playCount: 1 },
        lastPlayed: new Date()
      },
      { new: true }
    );
    res.json(track);
  } catch (error) {
    console.error('Increment play count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;