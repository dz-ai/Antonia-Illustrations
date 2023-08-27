const mongoose = require("mongoose");

const ImagesGroups = new mongoose.Schema({
    imagesGroupName: {
        type: String
    },
    images: [{
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
    }],
});

module.exports = mongoose.model('ImagesGroups', ImagesGroups);
