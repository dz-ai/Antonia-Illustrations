const express = require('express');
const {creatUser, loginUser, authenticateToken} = require("./controllers/userControllers");
const {protect} = require("./middlwares");
const {multerUpload, imageUploader, getImages} = /**/require("./controllers/uploadImageControllers");

exports.userRouter = express.Router({mergeParams: true});
exports.uploadRouter = express.Router({mergeParams: true});

// userRouter.get('/signIn', creatUser);
this.userRouter.post('/logIn', loginUser);
this.userRouter.get('/authToken', protect, authenticateToken);

this.uploadRouter.post('/upload', multerUpload, imageUploader);
this.uploadRouter.get('/getImages', getImages);
