// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const verifyToken = require('../middleware/auth.middleware');


router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.post('/refresh-token', adminController.refreshToken);
// ... đăng ký / đăng nhập ở trên

router.get('/posts', verifyToken, adminController.getAllPosts);
router.delete('/posts/:id', verifyToken, adminController.deletePost);
router.post('/notify', verifyToken, adminController.sendNotification);
module.exports = router;
