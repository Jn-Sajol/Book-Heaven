const express = require('express');
const { addWhiteList, createBook, seeWhiteList ,} = require('../Controller/bookController');
const {userAuth} = require('../Middleware/userAuth');
const router = express.Router();

router.post('/addwhitelist/:id',userAuth,addWhiteList)
router.post('/create',createBook)
router.get('/seewhitelist',userAuth,seeWhiteList)

module.exports = router;