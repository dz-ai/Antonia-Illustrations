const mongoose = require("mongoose");
// TODO complete the block list system
const BlockList = new mongoose.Schema({
    blockList: {
        type: Array,
    }
});

module.exports = mongoose.model('BlockList', BlockList);
