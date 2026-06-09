const express = require('express');
const {
  getAllNotifications,
  createNotification,
  markAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getAllNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markAsRead);

module.exports = router;
