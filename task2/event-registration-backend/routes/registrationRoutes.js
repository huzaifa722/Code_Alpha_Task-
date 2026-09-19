const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

// All registration routes require a logged-in user
router.use(protect);

router.post('/', registerForEvent);
router.get('/me', getMyRegistrations);
router.get('/event/:eventId', getEventRegistrations); // organizer/admin checked inside controller
router.delete('/:id', cancelRegistration);

module.exports = router;
