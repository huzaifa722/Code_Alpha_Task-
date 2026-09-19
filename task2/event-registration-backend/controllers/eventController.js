const Event = require('../models/Event');

// GET /api/events
// Supports optional query filters: ?category=&status=&search=
exports.getEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.json({ count: events.length, events });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event', error: err.message });
  }
};

// POST /api/events  (organizer/admin only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, time, venue, capacity, imageUrl } = req.body;

    if (!title || !description || !date || !venue || !capacity) {
      return res.status(400).json({ message: 'Title, description, date, venue, and capacity are required' });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      capacity,
      imageUrl,
      organizer: req.user._id,
    });

    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

// PUT /api/events/:id  (organizer who owns it, or admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isOwner = event.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this event' });
    }

    const allowedFields = ['title', 'description', 'category', 'date', 'time', 'venue', 'capacity', 'status', 'imageUrl'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    await event.save();
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

// DELETE /api/events/:id  (organizer who owns it, or admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isOwner = event.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};
