const express = require('express');
const { addWhiteList } = require('../Controller/bookController');
const {userAuth} = require('../Middleware/userAuth');
const router = express.Router();

router.post('/addwhitelist',userAuth,addWhiteList)

module.exports = router;