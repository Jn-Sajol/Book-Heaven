const express = require('express');
const { addWhiteList, createBook,bookList, seeWhiteList ,addComment,getAllcomments} = require('../Controller/bookController');
const {userAuth} = require('../Middleware/userAuth');
const router = express.Router();

router.post('/addwhitelist/:id',userAuth,addWhiteList)
router.post('/create',createBook)
router.get('/booklist',bookList)
router.get('/seewhitelist',userAuth,seeWhiteList)
router.post('/addcomment/:id',userAuth,addComment)
router.get('/allcomments/:id',getAllcomments)

module.exports = router;