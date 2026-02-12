import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  durationSeconds: {
    type: Number,
    default: null,
    validate: {
      validator: (v) => v === null || v > 0,
      message: 'Duration must be null or greater than 0',
    },
  },
  playcount: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (v) => v >= 0,
      message: 'Playcount must be 0 or greater',
    },
  },
  listeners: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (v) => v >= 0,
      message: 'Listeners must be 0 or greater',
    },
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null,
  },
});

songSchema.index({ artist: 1, title: 1 }, { unique: true });

export default mongoose.model('Song', songSchema);
