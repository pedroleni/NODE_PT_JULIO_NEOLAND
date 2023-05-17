const mongoose = require('mongoose');

const { Schema } = mongoose;

const ScoreSchema = new Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
    },
  },
  {
    timestamps: true,
  }
);

const Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
