const mongoose = require("mongoose");

const AboutMe = new mongoose.Schema({
    image: {
        type: String,
    },
    text: {
        type: String,
    },
});

module.exports = mongoose.model('AboutMe', AboutMe);
