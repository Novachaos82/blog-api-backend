const CommentModel = require("../models/comments");
const { body, validationResult } = require("express-validator");
const PostModel = require("../models/Post");
exports.comment_post = [
  body("comment", "comment cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new CommentModel({
      comment: req.body.comment,
      username: req.body.username,
      postID: req.params.postID,
    });
    if (!errors.isEmpty()) {
      res.json({
        message: "unsuccessful",
        body: req.body,
        errors: errors.array(),
      });
    } else {
      try {
        await comment.save();
        res.json({
          message: "successful",
          comment: comment,
        });
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.get_comments = async (req, res, next) => {
  try {
    const allComments = await CommentModel.find({});

    const comments = allComments.filter(
      (comment) => comment.postID.toString() === req.params.postID
    );
    if (!comments) {
      return res.status(404).json({ message: `comments not found` });
    }
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.get_a_single_comment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentID);
    if (!comment) {
      res.status(404).json({ message: "comment not found" });
    }
    res.json({
      message: "successful",
      comment: comment,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_a_comment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentID);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    console.log(comment.postID);
    const Post = await PostModel.findById(comment.postID);
    if (Post.user_name.toString() !== req.user._id) {
      return res.status(400).json({ message: "no rights to delete comment" });
    }

    await CommentModel.findByIdAndRemove(req.params.commentID);
    res.json({
      message: `deleted ${req.params.commentID} successfully`,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_comments = async (req, res, next) => {
  try {
    const comment = await CommentModel.deleteMany({
      postID: req.params.postID,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ message: `comment with id ${req.params.id} not found` });
    }
    res
      .status(200)
      .json({ msg: `comment ${req.params.id} deleted sucessfuly` });
  } catch (err) {
    next(err);
  }
};
exports.comment_update = [
  body("comment", "comment cannot be empty")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("username", "username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new CommentModel({
      _id: req.params.commentID,
      comment: req.body.comment,
      username: req.body.username,
      postID: req.params.postID,
    });
    if (!errors.isEmpty()) {
      res.json({
        message: "unsuccessful",
        body: req.body,
        errors: errors.array(),
      });
    }

    try {
      const existingComment = await CommentModel.findById(req.params.commentID);

      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const Post = await PostModel.findById(existingComment.postID);
      console.log(existingComment);
      if (Post.user_name.toString() !== req.user._id) {
        return res.status(400).json({ message: "no rights to update comment" });
      }

      await CommentModel.findByIdAndUpdate(req.params.commentID, comment);

      const UpdatedComment = await CommentModel.findById(req.params.commentID);
      return res.json({
        message: "Comment updated successfully",
        comment: UpdatedComment,
      });
    } catch (err) {
      return next(err);
    }
  },
];
