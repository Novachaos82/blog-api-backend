const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  date: { default: Date.now, type: Date },
  details: { required: true, type: String },
  user_name: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { default: false, type: Boolean },
});

PostSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

const model = mongoose.model("Post", PostSchema);

module.exports = model;
