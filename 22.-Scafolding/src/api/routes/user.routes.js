const express = require('express');
const { upload } = require('../../middlewares/files.middleware');
const { register } = require('../controllers/users.controller');
const UserRoutes = express.Router();

UserRoutes.post('/register', upload.single('image'), register);

module.exports = UserRoutes;
