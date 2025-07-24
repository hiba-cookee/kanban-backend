const mongoose = require('mongoose');

const userModelSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const users = mongoose.model("users", userModelSchema);
module.exports = users;