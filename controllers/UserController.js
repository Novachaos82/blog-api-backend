const UserModel = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.sign_up_post = [
  body("username", "Empty name")
    .trim()
    .escape()
    .custom(async (username) => {
      try {
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
          throw new Error("username already exist");
        }
      } catch (err) {
        throw new Error(err);
      }
    }),

  body("password").isLength(6).withMessage("Minimum length 6 characters"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        username: req.body.username,
        errors: errors.array(),
      });
    }

    passport.authenticate("signup", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      //console.log(user);
      res.json({
        message: "Signed-up sucessfuly",
        user: user,
      });
    })(req, res, next);
    console.log(req.user);
  },
];

exports.log_in_post = async (req, res, next) => {
  passport.authenticate("login", { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        return next(info);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.json({ token });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};

exports.logout = function (req, res) {
  req.logout();
  res.redirect("/");
};
