// const mongoose = require('mongoose');

// // books scheema
// const bookScheema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     author:{
//         type:String,
//         required:true
//     },
//     description:{
//         type:String
//     },
//     publisDate:{type:Date,default:Date.now},
    
// })
// module.exports = mongoose.model('Books',bookScheema)

const mongoose = require('mongoose');

// Books schema
const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
});

// Middleware for cascading delete
bookSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
  const bookId = this.getQuery()['_id'];

  try {
    // Delete all Whitelist entries referencing the book
    await mongoose.model('Whitelist').deleteMany({ bookId });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Books', bookSchema);
