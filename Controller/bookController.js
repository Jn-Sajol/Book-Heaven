const booksModel = require("../Models/booksModel");
const userModel = require("../Models/userModel");
const mongoose = require("mongoose");
const whiteListModel = require("../Models/whiteListModel");

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
const bookList = async (req, res) => {
  try {
    const bookList = await booksModel.find();
    res.send(bookList);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `server error ${error}`,
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
    const findBookInDb = await whiteListModel.findOne({bookId:bookId,userId:id});
    // console.log(findBookInDb)
    if(findBookInDb){
      return res.status(404).json({
        success: false,
        message: "This book alresy exist in white list",
      });
    }
    console.log('come till this')
    const whitelist = new whiteListModel({ bookId: bookId, userId:id });
    await whitelist.save();
    console.log("Whitelist updated:", whitelist);
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
    const getWhitelistForUser = await whiteListModel.find({userId:id}).populate('bookId')
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
    book.comment.push({ userId: user._id, comment, username: user.username });
    await book.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      book,
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
    const allcomments = await booksModel.findById(bookid);
    res.send(allcomments.comment);
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
    console.log(userId)
    const { note } = req.body;
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.send("User not found");
    }
    const matchingBook = user.whitelist.some(list => list.bookId.toString() === bookId);
    if (!matchingBook) {
      return res.send("Book actually not found in Whitelist");
    }
    user.personalnote.push({bookId:bookId,note:note});
    await user.save();
    res.status(200).json({
      success: true,
      message: "Note successfully added",
      data: user.personalnote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//Get Individual note for individual book
const getIndividualNote = async (req,res) =>{
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;
    console.log(userId)
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.send("User not found");
    }
    const findNote = user.personalnote.some(book => book.bookId.toString() === bookId)
    if (!findNote) {
      return res.send("Your not not found by this book id");
    }
    const filterNote = user.personalnote.filter(book => book.bookId.toString() === bookId)
    // console.log(findNote)
    res.status(200).json({
      success:true,
      message:"successfully get individual note for individual book",
      data:filterNote
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

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
  getIndividualNote
};
