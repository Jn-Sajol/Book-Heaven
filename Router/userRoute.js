const express = require('express');
const { userRegistration } = require('../Controller/UserController');
const route = express.Router();

route.get('/registration', userRegistration);

module.exports = route;