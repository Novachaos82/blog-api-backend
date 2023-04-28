const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  date: { default: Date.now(), type: Date },
  comment: { type: String, required: true },
  username: { type: String, requied: true },
  postID: { type: Schema.Types.ObjectId, ref: "Post", required: true },
});

PostSchema.virtual("url").get(function () {
  return `/posts/:postID/comments/${this._id}`;
});

const model = mongoose.model("Comment", CommentSchema);

module.exports = model;
