const express = require('express');
const {creatUser, loginUser, authenticateToken} = require("./controllers/userControllers");
const {protect} = require("./middlwares");
const {multerUpload, imageUploader, getImages, clearImages} = require("./controllers/uploadImageControllers");

exports.userRouter = express.Router({mergeParams: true});
exports.uploadRouter = express.Router({mergeParams: true});

// userRouter.get('/signIn', creatUser);
this.userRouter.post('/logIn', loginUser);
this.userRouter.get('/authToken', protect, authenticateToken);

this.uploadRouter.post('/upload', multerUpload, imageUploader);
// TODO add protect MW to uploadRout
this.uploadRouter.get('/getImages', getImages);
this.uploadRouter.get('/clearImages', clearImages);
