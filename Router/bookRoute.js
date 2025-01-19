const express = require("express");
const {
  addWhiteList,
  createBook,
  bookList,
  seeWhiteList,
  addComment,
  getAllcomments,
  makeNote,
  getIndividualNote,
  deleteWhitelist,
  markForRead,
  getSingleList,
} = require("../Controller/bookController");
const { userAuth } = require("../Middleware/userAuth");
const router = express.Router();

router.post("/addwhitelist/:id", userAuth, addWhiteList);
router.post("/create", createBook);
router.get("/booklist",userAuth, bookList);
router.get("/singlebook/:id",userAuth, getSingleList);
router.get("/seewhitelist", userAuth, seeWhiteList);
router.delete("/deletewhitelist/:id", userAuth, deleteWhitelist);
router.post("/addcomment/:id", userAuth, addComment);
router.get("/allcomments/:id", getAllcomments);
router.post("/makenote/:id", userAuth, makeNote);
router.get("/getindividualnote/:id", userAuth, getIndividualNote);
router.post("/markread/:id", userAuth, markForRead);

module.exports = router;
