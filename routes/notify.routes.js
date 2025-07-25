const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notify.controller');
const verifyToken = require('../middleware/auth.middleware');

// Admin gửi thông báo
router.post('/notify', verifyToken, notifyController.sendNotification);

// User lấy thông báo
router.get('/notify', verifyToken, notifyController.getNotifications);

module.exports = router;
