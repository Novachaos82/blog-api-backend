const mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  date: { default: Date.now(), type: Date },
  details: { required: true, type: String },
  author_name: { required: true, type: String },
  published: { default: false, type: Boolean },
});

const model = mongoose.model("Post", PostSchema);

module.exports = model;
