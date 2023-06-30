const express = require('express');
const {creatUser, loginUser, authenticateToken} = require("./controllers/userControllers");
const {protect} = require("./middlwares");
const {
    getImages,
    getSignature,
    setImageMetaData,
    deleteImageMetaData
} = require("./controllers/uploadImageControllers");

exports.userRouter = express.Router({mergeParams: true});
exports.uploadRouter = express.Router({mergeParams: true});

// userRouter.get('/signIn', creatUser);
this.userRouter.post('/logIn', loginUser);
this.userRouter.get('/authToken', protect, authenticateToken);

this.uploadRouter.get('/getImages', getImages);
this.uploadRouter.get('/auth', getSignature);
this.uploadRouter.post('/setImageMetaData', protect, setImageMetaData);
this.uploadRouter.delete('/deleteImage', protect, deleteImageMetaData);
