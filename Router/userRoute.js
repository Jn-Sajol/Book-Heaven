const express = require('express');
const { userRegistration } = require('../Controller/UserController');
const route = express.Router();

route.post('/registration', userRegistration);

module.exports = route;