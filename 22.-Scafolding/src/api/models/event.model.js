const mongoose = require('mongoose');

const { Schema } = mongoose;

const EventsSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    hour: { type: String, required: true },
    description: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    scores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Score' }],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', EventsSchema);

module.exports = Event;
