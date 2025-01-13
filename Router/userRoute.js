const express = require('express');
const { userRegistration, userLogin } = require('../Controller/UserController');
const route = express.Router();

route.post('/registration', userRegistration);
route.post('/login', userLogin);

module.exports = route;