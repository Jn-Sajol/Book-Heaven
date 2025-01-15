const express = require('express');
const { addWhiteList, createBook,bookList, seeWhiteList ,addComment,getAllcomments, makeNote, getIndividualNote} = require('../Controller/bookController');
const {userAuth} = require('../Middleware/userAuth');
const router = express.Router();

router.post('/addwhitelist/:id',userAuth,addWhiteList)
router.post('/create',createBook)
router.get('/booklist',bookList)
router.get('/seewhitelist',userAuth,seeWhiteList)
router.post('/addcomment/:id',userAuth,addComment)
router.get('/allcomments/:id',getAllcomments)
router.post('/makenote/:id',userAuth,makeNote)
router.get('/getindividualnote/:id',userAuth,getIndividualNote)

module.exports = router;