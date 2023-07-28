const mongoose = require("mongoose");

const Image = new mongoose.Schema({
    fileName: {
        type: String,
    },
    imageCategory: {
        type: String
    },
    imageDescription: {
        type: String
    },
    imageID: {
        type: String
    }
});

module.exports = mongoose.model('Image', Image);
