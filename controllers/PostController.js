const PostModel = require("../models/Post");
const { body, validationResult } = require("express-validator");
exports.get_all_post = async (req, res, next) => {
  try {
    const posts = await PostModel.find({}).sort({ date: -1 });
    if (posts.length < 0) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      res.json({
        posts: posts,
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.get_a_single_post = async (req, res, next) => {
  try {
    const existingPost = await PostModel.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      return res.json({
        post: existingPost,
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.create_post = [
  body("title", "give the title").trim().escape(),
  body("details", "details cannot be empty").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const post = new PostModel({
      title: req.body.title,
      details: req.body.details,
      user_name: req.user._id,
    });
    if (!errors.isEmpty()) {
      res.json({
        message: "error",
        data: req.body,
        errors: errors.array(),
      });
    } else {
      try {
        await post.save();
        res.json({
          message: "successful",
          post: post,
        });
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.update_post = [
  body("title", "give the title").trim().escape(),
  body("details", "details cannot be empty").trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const post = new PostModel({
      _id: req.params.id,
      title: req.body.title,
      details: req.body.details,
      user_name: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.json({
        message: "error",
        data: req.body,
        errors: errors.array(),
      });
    } else {
      try {
        const existingPost = await PostModel.findById(req.params.id);

        if (!existingPost) {
          return res.status(404).json({ message: "Post not found" });
        }

        if (existingPost.user_name.toString() !== req.user._id) {
          return res
            .status(401)
            .json({ message: "You are not authorized to perform this action" });
        }

        await PostModel.findByIdAndUpdate(req.params.id, post);
        const updatedPostData = await PostModel.findById(req.params.id);

        res.json({
          message: "Post updated successfully",
          post: updatedPostData,
        });
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.delete_a_post = async (req, res, next) => {
  try {
    const existingPost = await PostModel.findByIdAndRemove(req.params.id);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.user_name.toString() !== req.user._id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to perform this action" });
    }

    res.json({ message: `post ${req.params.id} deleted successfully` });
  } catch (err) {
    return next(err);
  }
};
