const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose"); // ✅ सही स्पेलिंग

const userSchema = new Schema({
    email: {
        type: String,
        required: true // ✅ Mongoose का built-in validator
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema); 