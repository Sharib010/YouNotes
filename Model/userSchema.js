const mongoose = require("mongoose");
const bcrytpt = require('bcrypt');
const jwt = require('jsonwebtoken');


// ----------------Register and Login Schema ----------------
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cpassword: String,
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});
// ----------------------Notes Schema ---------------------------
const blackNotesSchema = new mongoose.Schema({
    title: String,
    note: String,
    date: String,
    day: String,
    note_Key: String,
    color: String,
    fontStyle: String,
    fontWeight: String,
    fontSize: String
});






// hashing password 
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrytpt.hash(this.password, 12);
        this.cpassword = await bcrytpt.hash(this.cpassword, 12);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err)
    }
}




const User = new mongoose.model("User", userSchema);
const blackNotes = new mongoose.model("blackNotes", blackNotesSchema);


module.exports = {
    User,
    blackNotes
}