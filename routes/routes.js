var express = require("express");
var router = express.Router();
const User_Controller = require("../controllers/UserController");
const Post_controller = require("../controllers/PostController");
const passport = require("passport");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ title: "Express" });
});

router.post("/signup", User_Controller.sign_up_post);
router.post("/login", User_Controller.log_in_post);

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  Post_controller.create_post
);
module.exports = router;
