const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, trim: true },
    date: { type: Date, required: true },
    time: { type: String }, // e.g. "14:00"
    venue: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// Virtual: is the event full?
eventSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.capacity;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
