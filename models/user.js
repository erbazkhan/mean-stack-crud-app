const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
    user_name : String,
    user_mail: String,
    user_phone: Number
});

const User = mongoose.model('User', newSchema);
module.exports = User;