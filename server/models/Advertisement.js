import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxLength: 200
  },
  link: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'active'
  },
  announcementCount: {
    type: Number,
    default: 0
  },
  maxAnnouncements: {
    type: Number,
    default: 5
  },
  scheduledTimes: [{
    type: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  paymentId: String,
  amount: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Advertisement', advertisementSchema);