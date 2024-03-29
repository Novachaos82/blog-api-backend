var express = require("express");
var router = express.Router();
const User_Controller = require("../controllers/UserController");

const Post_controller = require("../controllers/PostController");
const passport = require("passport");
const Comment_controller = require("../controllers/CommentController");
/* GET home page. */

/* Authentication routes */

router.get("/", function (req, res, next) {
  res.redirect("/api/posts");
});

router.post("/signup", User_Controller.sign_up_post);
router.post("/login", User_Controller.log_in_post);
router.get("/logout", User_Controller.logout);

/*all posts related  routes */
router.get("/posts", Post_controller.get_all_post);
router.get("/posts/:id", Post_controller.get_a_single_post);

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  Post_controller.create_post
);

router.put(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  Post_controller.update_post
);

router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  Post_controller.delete_a_post
);

/* All Comments related routes */

router.get("/posts/:postID/comments", Comment_controller.get_comments);

router.get(
  "/posts/:postID/comments/:commentID",
  Comment_controller.get_a_single_comment
);

router.post("/posts/:postID/comments", Comment_controller.comment_post);

router.put(
  "/posts/:postID/comments/:commentID",
  passport.authenticate("jwt", { session: false }),
  Comment_controller.comment_update
);

router.delete(
  "/posts/:postID/comments/:commentID",
  passport.authenticate("jwt", { session: false }),
  Comment_controller.delete_a_comment
);

router.delete("/posts/:postID/comments", Comment_controller.delete_comments);
module.exports = router;
