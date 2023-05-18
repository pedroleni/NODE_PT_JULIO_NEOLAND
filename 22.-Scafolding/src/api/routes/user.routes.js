const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
const { register, checkNewUser } = require('../controllers/users.controller');
const UserRoutes = express.Router();

UserRoutes.post('/register', upload.single('image'), register);
UserRoutes.post('/check', checkNewUser);

module.exports = UserRoutes;
