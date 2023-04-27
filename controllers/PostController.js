const PostModel = require("../models/Post");
const { body, validationResult } = require("express-validator");

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
