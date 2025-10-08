const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword, validateChangePassword } = require('../middleware/validation');

// Routes publiques
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);
router.post('/reset-password', validateResetPassword, AuthController.resetPassword);

// Routes protégées
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.put('/change-password', authenticateToken, validateChangePassword, AuthController.changePassword);
router.delete('/account', authenticateToken, AuthController.deleteAccount);
router.get('/verify', authenticateToken, AuthController.verifyToken);

module.exports = router;
