const booksModel = require("../Models/booksModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose')

//create book
const createBook = async (req, res) => {
  try {
    const { name,author,description } = req.body;
    console.log(name)

    //check existency
    const existency = await booksModel.findOne({name});
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
const bookList = async (req,res) =>{
 try {
  const bookList = await booksModel.find();
  res.send(bookList)
 } catch (error) {
  res.status(500).json({
    success: false,
    message: `server error ${error}`,
  });
 }
}

//Add whitelist
const addWhiteList = async (req, res) => {
  try {
    const bookId = req.params.id;
    const id = req.user.userId;

    console.log('bookid =>',bookId, 'user id =>', id)

    const user = await userModel.findOne({_id: id});
    console.log('user found',user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }

    if (user.whitelist.some((book) => book?.bookId?.toString() === bookId.toString())) {
      return res.status(404).json({
        success: false,
        message: "This book alresy exist in white list",
      });
    }

    user.whitelist.push({bookId:bookId});
    await user.save();
    console.log("Whitelist updated:", user.whitelist);
    res.status(200).json({
      success: true,
      message: "book added in White list",
      whitelist: user.whitelist
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
    console.log(id)
    const user = await userModel.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }
    // await user.save()
    res.status(200).json({
      success: true,
      whitelist: user.whitelist,
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
          return res.status(404).json({ success: false, message: 'Book not found' });
      }

      // Find the user by ID to get the username
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Push the comment with username into the book's comment array
      book.comment.push({ userId: user._id, comment, username: user.username });
      await book.save();

      res.status(200).json({
          success: true,
          message: 'Comment added successfully',
          book,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
};



//privet route
const privetRoute = (req,res) =>{
    res.send('welcome to privet route')
  }
module.exports = {createBook, bookList, addWhiteList, seeWhiteList, addComment ,privetRoute};
