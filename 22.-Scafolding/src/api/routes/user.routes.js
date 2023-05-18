const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
const {
  register,
  checkNewUser,
  resendCode,
  login,
} = require('../controllers/users.controller');
const UserRoutes = express.Router();

UserRoutes.post('/register', upload.single('image'), register);
UserRoutes.post('/check', checkNewUser);
UserRoutes.post('/resend', resendCode);
UserRoutes.post('/login', login);

module.exports = UserRoutes;
