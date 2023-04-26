const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 20 },
  password: { type: String, required: true },
});

UserSchema.pre("save", async (req, res, next) => {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  console.log("user creating and saving");
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const model = mongoose.model("User", UserSchema);

module.exports = model;
