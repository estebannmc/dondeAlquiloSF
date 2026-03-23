const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);
router.get('/microsoft', authController.microsoftAuth);
router.get('/microsoft/callback', authController.microsoftAuthCallback);
router.get('/login/failed', authController.loginFailed);
router.get('/logout', authController.logout);
router.get('/user', authController.getUser);

module.exports = router;
