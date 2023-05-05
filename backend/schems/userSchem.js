const mongoose = require("mongoose");
const bcrypt = require('../../server').bcrypt;
const jwt = require('jsonwebtoken');

const User = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

User.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});
// TODO make token to expire after 30 minutes and refresh.
User.methods.getJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '2h'});
}

User.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', User);