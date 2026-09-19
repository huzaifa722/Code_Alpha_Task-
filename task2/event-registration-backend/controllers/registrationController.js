const mongoose = require('mongoose');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/registrations  { eventId }
// Logged-in user registers for an event
exports.registerForEvent = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }

    let result;
    await session.withTransaction(async () => {
      const event = await Event.findById(eventId).session(session);
      if (!event) {
        throw { status: 404, message: 'Event not found' };
      }

      // Check for an existing active registration
      const existing = await Registration.findOne({
        user: req.user._id,
        event: eventId,
        status: 'confirmed',
      }).session(session);

      if (existing) {
        throw { status: 409, message: 'You are already registered for this event' };
      }

      if (event.registeredCount >= event.capacity) {
        throw { status: 400, message: 'This event is full' };
      }

      const [registration] = await Registration.create(
        [{ user: req.user._id, event: eventId, status: 'confirmed' }],
        { session }
      );

      event.registeredCount += 1;
      await event.save({ session });

      result = registration;
    });

    res.status(201).json({ message: 'Registration successful', registration: result });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Registration failed', error: err.error });
  } finally {
    session.endSession();
  }
};

// GET /api/registrations/me
// Logged-in user views their own registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json({ count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registrations', error: err.message });
  }
};

// GET /api/registrations/event/:eventId
// Organizer/admin views everyone registered for a given event
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isOwner = event.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these registrations' });
    }

    const registrations = await Registration.find({ event: req.params.eventId, status: 'confirmed' })
      .populate('user', 'name email');

    res.json({ count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event registrations', error: err.message });
  }
};

// DELETE /api/registrations/:id
// Logged-in user cancels their own registration
exports.cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const registration = await Registration.findById(req.params.id).session(session);

      if (!registration) {
        throw { status: 404, message: 'Registration not found' };
      }

      if (registration.user.toString() !== req.user._id.toString()) {
        throw { status: 403, message: 'Not authorized to cancel this registration' };
      }

      if (registration.status === 'cancelled') {
        throw { status: 400, message: 'Registration is already cancelled' };
      }

      registration.status = 'cancelled';
      await registration.save({ session });

      await Event.findByIdAndUpdate(
        registration.event,
        { $inc: { registeredCount: -1 } },
        { session }
      );
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Failed to cancel registration' });
  } finally {
    session.endSession();
  }
};
