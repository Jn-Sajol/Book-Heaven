const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
  },

  note: {
    type: String,
  },
});

module.exports = mongoose.model('Note',noteSchema)