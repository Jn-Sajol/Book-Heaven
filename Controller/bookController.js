const booksModel = require("../Models/booksModel");
const userModel = require("../Models/userModel");

const addWhiteList = async (req, res) => {
  try {
    const bookId = req.params;
    const id = req.user.id;

    const user = await userModel.findOne({ id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }

    user.whitelist.push(bookId);

    res.status(200).json({
      success: true,
      message: "book added in White list",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//See All whitelist
const seeWhiteList = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await userModel.findOne({ id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }
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

const createComment = async (req,res) => {
    try {
        const id = req.user.id;
    const comment = req.body;
    const bookId = req.params;
    const user = await userModel.findOne({ id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user cant find",
      });
    }

    const book = await booksModel.findOne(bookId);
    book.comment.push(comment)
    res.status(200).json({
        success: true,
        message: "book added in White list",
      });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Server Error',
        })
    }
}
