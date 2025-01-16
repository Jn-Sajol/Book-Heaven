const booksModel = require("../Models/booksModel");
const userModel = require("../Models/userModel");
const mongoose = require("mongoose");
const whiteListModel = require("../Models/whiteListModel");
const noteModel = require("../Models/noteModel");
const commentModel = require("../Models/commentModel");
const markReadModel = require("../Models/markReadModel");

//create book
const createBook = async (req, res) => {
  try {
    const { name, author, description } = req.body;
    console.log(name);

    //check existency
    const existency = await booksModel.findOne({ name });
    if (existency || existency < 0) {
      return res.status(404).json({
        success: false,
        message: "This book is already exist",
      });
    }
    const book = new booksModel({
      name,
      author,
      description,
    });
    await book.save();
    res.status(200).json({
      success: true,
      message: "Book successfully created",
      book: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `server error ${error}`,
    });
  }
};

//Get Books List
// const bookList = async (req, res) => {
//   try {
//     const bookList = await booksModel.find();
//     res.send(bookList);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `server error ${error}`,
//     });
//   }
// };
const bookList = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch all books
    const allBooks = await booksModel.find({}).lean();

    // Fetch user's whitelist and marked-read books
    const whitelistBooks = await whiteListModel.find({ userId }).lean();
    const markReadBooks = await markReadModel.find({ userId }).lean();

    // Convert whitelist and mark-read books to sets for faster lookup
    const whitelistSet = new Set(whitelistBooks.map(book => book.bookId.toString()));
    const markReadSet = new Set(markReadBooks.map(book => book.bookId.toString()));

    // Add status to each book
    const booksWithStatus = allBooks.map(book => ({
      ...book,
      isWhitelisted: whitelistSet.has(book._id.toString()),
      isMarkedRead: markReadSet.has(book._id.toString()),
    }));

    res.status(200).json({
      success: true,
      books: booksWithStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//Add whitelist
const addWhiteList = async (req, res) => {
  try {
    const bookId = req.params.id;
    const id = req.user.userId;

    console.log("bookid =>", bookId, "user id =>", id);

    const user = await userModel.findOne({ _id: id });
    console.log("user found", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }
    // check already exist or not
    const findBookInDb = await whiteListModel.findOne({
      bookId: bookId,
      userId: id,
    });
    // console.log(findBookInDb)
    if (findBookInDb) {
      return res.status(404).json({
        success: false,
        message: "This book alresy exist in white list",
      });
    }
    console.log("come till this");
    const whitelist = new whiteListModel({ bookId: bookId, userId: id });
    await whitelist.save();
    // console.log("Whitelist updated:", whitelist);
    res.status(200).json({
      success: true,
      message: "book added in White list",
      whitelist: whitelist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// const addWhiteList = async (req, res) => {
//     try {
//       const bookId = req.params.id; // Extract bookId from params
//       const id = req.user.userId; // Extract userId from request

//       console.log("bookId =>", bookId, "userId =>", id);

//       // Validate and convert bookId to ObjectId
//     //   if (!mongoose.Types.ObjectId.isValid(bookId)) {
//     //     return res.status(400).json({
//     //       success: false,
//     //       message: "Invalid bookId format",
//     //     });
//     //   }
//     //   const objectIdBookId = new mongoose.Types.ObjectId(bookId);

//       // Find the user
//       const user = await userModel.findOne({ _id: id });
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // Check if the bookId already exists in the whitelist
//       if (user.whitelist.some((book) => book?.bookId?.toString() === bookId.toString())) {
//         return res.status(400).json({
//           success: false,
//           message: "This book already exists in the whitelist",
//         });
//       }

//       // Add the bookId to the whitelist
//       user.whitelist.push({ bookId: bookId });
//       await user.save();

//       console.log("Whitelist updated:", user.whitelist);
//       res.status(200).json({
//         success: true,
//         message: "Book added to the whitelist",
//         whitelist: user.whitelist,
//       });
//     } catch (error) {
//       console.error("Error:", error); // Log error for debugging
//       res.status(500).json({
//         success: false,
//         message: "Server Error",
//       });
//     }
//   };

//See All whitelist

const seeWhiteList = async (req, res) => {
  try {
    const id = req.user.userId;
    // console.log(id);
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }
    const getWhitelistForUser = await whiteListModel
      .find({ userId: id })
      .populate("bookId");
    if (!getWhitelistForUser || getWhitelistForUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found in the whitelist for this user",
      });
    }
    res.status(200).json({
      success: true,
      whitelist: getWhitelistForUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//Delete from the White List
const deleteWhitelist = async (req, res) => {
  try {
    const bookId = req.params.id;
    const user = req.user.userId;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }
    const deleteWhitelist = await whiteListModel.deleteOne({
      bookId: bookId,
      userId: user,
    });
    if (deleteWhitelist.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found in whitelist",
      });
    }
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: deleteWhitelist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//Comment for specific books
const addComment = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming user ID is coming from authentication middleware
    const { comment } = req.body;
    const bookId = req.params.id;

    // Find the book by ID
    const book = await booksModel.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Find the user by ID to get the username
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Push the comment with username into the book's comment array
    const newCommnt = new commentModel({
      userId: user._id,
      comment,
      username: user.username,
      bookId: bookId,
    });
    await newCommnt.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      cooment: newCommnt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//const get all comments with user name
const getAllcomments = async (req, res) => {
  try {
    const bookid = req.params.id;
    const allcomments = await commentModel.find({ bookId: bookid });
    if (!allcomments || allcomments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Comment found for this Book",
      });
    }
    res.send(allcomments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Make Personal Note for indivisual Book
const makeNote = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;
    // console.log(userId)
    const { note } = req.body;
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.send("User not found");
    }
    const matchingBook = await whiteListModel.findOne({ bookId: bookId });
    if (!matchingBook) {
      return res.send("Book actually not found in Whitelist");
    }
    const newNote = new noteModel({ bookId: bookId, note: note });
    await newNote.save();
    res.status(200).json({
      success: true,
      message: "Note successfully added",
      data: newNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get Individual note for individual book
const getIndividualNote = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;
    console.log(userId);
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.send("User not found");
    }
    const findNote = await noteModel.findOne({ bookId: bookId });
    console.log(findNote);
    if (!findNote || findNote.length < 0) {
      return res.send("You dont have Not for this book");
    }
    // const filterNote = user.personalnote.filter(book => book.bookId.toString() === bookId)
    // console.log(findNote)
    res.status(200).json({
      success: true,
      message: "successfully get individual note for individual book",
      data: findNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Mark at Read
// const markForRead = async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const userId = req.user.userId;
//     // console.log(bookId,'user',userId)
//     // console.log(user)
//     const searchInWhitelist = await whiteListModel.findOne({
//       bookId: bookId,
//       userId: userId,
//     });
//     // console.log('found',searchInWhitelist)
//     if (!searchInWhitelist) {
//       return res.status(404).json({
//         success: false,
//         message: "This Book dosent exist in your white list",
//       });
//     }
//     const findMarkInDb = await markReadModel.findOne({
//       bookId: bookId,
//       userId: userId,
//     });
//     console.log(findBookInDb)
//     if (findMarkInDb) {
//       return res.status(404).json({
//         success: false,
//         message: "This book already exist in Mark Read list",
//       });
//     }
//     // console.log('come till this')
//     const markList = new markReadModel({ bookId: bookId, userId: userId });
//     await markList.save();
//     // console.log("Whitelist updated:", whitelist);
//     res.status(200).json({
//       success: true,
//       message: "book added in read list",
//       markList: markList,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
const markForRead = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;

    // Check if the book exists in the user's whitelist
    const searchInWhitelist = await whiteListModel.findOne({
      bookId: bookId,
      userId: userId,
    });

    if (!searchInWhitelist) {
      return res.status(404).json({
        success: false,
        message: "This book does not exist in your whitelist",
      });
    }

    // Check if the book is already in the "Mark Read" list
    const findMarkInDb = await markReadModel.findOne({
      bookId: bookId,
      userId: userId,
    });

    if (findMarkInDb) {
      return res.status(409).json({
        success: false,
        message: "This book is already in your Mark Read list",
      });
    }

    // Add the book to the "Mark Read" list
    const markList = new markReadModel({ bookId: bookId, userId: userId });
    await markList.save();

    res.status(200).json({
      success: true,
      message: "Book successfully added to your Mark Read list",
      data: markList,
    });
  } catch (error) {
    console.error("Error in markForRead:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


//privet route
const privetRoute = (req, res) => {
  res.send("welcome to privet route");
};
module.exports = {
  createBook,
  bookList,
  addWhiteList,
  seeWhiteList,
  addComment,
  privetRoute,
  getAllcomments,
  makeNote,
  getIndividualNote,
  deleteWhitelist,
  markForRead,
};
