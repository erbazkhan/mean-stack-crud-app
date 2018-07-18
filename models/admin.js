const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
   adminEmail: {
       type: String,
       unique: true,
       required: true
   },
   adminUsername:{
       type: String,
       unique: true,
       required: true
   },
   password:{
       type: String,
       required: true
   }
});

const Admin = mongoose.model('Admin', schema);
module.exports = Admin;

module.exports.createAdmin = function (Admin) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(Admin.password, salt, function (err, hash) {
            Admin.password = hash;
            Admin.save();
            console.log('You are registered and can now login!');
        });
    });
}

module.exports.getAdminByAdminUsername = function (adminUsername, callback) {
    const query = {adminUsername: adminUsername};
    Admin.findOne(query, callback);
}

module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}