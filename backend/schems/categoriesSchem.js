const mongoose = require("mongoose");

const Categories = new mongoose.Schema({
    categoriesArray: {
        type: [String]
    },
});

module.exports = mongoose.model('Categories', Categories);
