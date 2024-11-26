import express from 'express';
import { auth } from '../middleware/auth.js';
import Advertisement from '../models/Advertisement.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Submit new advertisement
router.post('/', auth, async (req, res) => {
  try {
    const { text, link, paymentMethodId } = req.body;
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true
    });

    // Generate scheduled times
    const scheduledTimes = Array.from({ length: 5 }, () => {
      const date = new Date();
      date.setHours(date.getHours() + Math.floor(Math.random() * 24));
      return date;
    }).sort((a, b) => a.getTime() - b.getTime());

    const ad = new Advertisement({
      userId: req.user.userId,
      text,
      link,
      scheduledTimes,
      paymentId: paymentIntent.id,
      amount: 1000
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    console.error('Submit ad error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active advertisements
router.get('/active', async (req, res) => {
  try {
    const ads = await Advertisement.find({
      status: 'active',
      announcementCount: { $lt: 5 }
    }).populate('userId', 'name');
    res.json(ads);
  } catch (error) {
    console.error('Get active ads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement count
router.post('/:id/announce', async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    ad.announcementCount += 1;
    if (ad.announcementCount >= ad.maxAnnouncements) {
      ad.status = 'completed';
    }

    await ad.save();
    res.json(ad);
  } catch (error) {
    console.error('Update announcement count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;