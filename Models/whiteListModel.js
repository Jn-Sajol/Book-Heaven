// const mongoose = require('mongoose');

// const whitelistShema = new mongoose.Schema({
//     bookId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'Books',
//         index: true
//     },
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     }
// });
// module.exports = mongoose.model('Whitelist',whitelistShema);

const mongoose = require('mongoose');

// Whitelist schema
const whitelistSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',
    index: true, // Indexing for better performance
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model('Whitelist', whitelistSchema);
