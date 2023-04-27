var express = require("express");
var router = express.Router();
const User_Controller = require("../controllers/UserController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ title: "Express" });
});

router.post("/signup", User_Controller.sign_up_post);
router.post("/login", User_Controller.log_in_post);

module.exports = router;
