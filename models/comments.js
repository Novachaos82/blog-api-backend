const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  date: { default: Date.now(), type: Date },
  comment: { type: String, required: true },
  username: { type: String, requied: true },
  postID: { type: String, required: true },
});

const model = mongoose.model("Comment", CommentSchema);

module.exports = model;
