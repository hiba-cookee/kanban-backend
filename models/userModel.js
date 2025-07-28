const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userModelSchema = new mongoose.Schema({
  //   fullName: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Defining populated virtual
userModelSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "userId",
  //Mongoose will populate documents from ref whose foreignField matches this document's localField.
  justOne: false, // Set to true if you want a single task per user
});

userModelSchema.set("toObject", { virtuals: true });
userModelSchema.set("toJSON", {
  virtuals: true,
}); // to include the virtual in json/object output

//full name using virtual
userModelSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userModelSchema.virtual("fullName").set(function (value) {
  const namesArray = value.split(" ");
  this.firstName = namesArray[0];
  this.lastName = namesArray[1];
});

// pre methods runs before certain actions
userModelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // isModified checks if password field has been modified since the document is loaded
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next(); // continue to next step (save)
});

// post method runs after certain actions
//schema.post('operation',function(doc,next){})
const users = mongoose.model("users", userModelSchema);
module.exports = users;
