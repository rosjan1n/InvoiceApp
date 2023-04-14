const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Wprowadź nazwę użytkownika"],
  },
  email: {
    type: String,
    required: [true, "Wprowadź email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Wprowadź hasło"],
  },
});

module.exports = mongoose.model("User", userSchema);
