const express = require('express');
const {creatUser, loginUser, authenticateToken} = require("./controllers/userControllers");
const {protect} = require("./middlwares");
const {
    getImages,
    getSignature,
    setImageMetaData,
    deleteImage
} = require("./controllers/uploadImageControllers");
const {getCategories, addCategory, removeCategory} = require("./controllers/categoriesController");
const {editAboutMe, getAboutMe, deleteAboutMeImage} = require("./controllers/aboutMeController");

exports.userRouter = express.Router({mergeParams: true});
exports.uploadRouter = express.Router({mergeParams: true});
exports.categoryRouter = express.Router({mergeParams: true});
exports.aboutMeRouter = express.Router({mergeParams: true});

// ---- User Routes ---- //
// userRouter.get('/signIn', creatUser); there is only one Admin user so this is not in use.
this.userRouter.post('/logIn', loginUser);
this.userRouter.get('/authToken', protect, authenticateToken);

// ---- Image Routes ---- //
this.uploadRouter.get('/getImages/:imagesGroupName', getImages);
this.uploadRouter.get('/auth', getSignature);
this.uploadRouter.post('/setImageMetaData/:imagesGroupName', protect, setImageMetaData);
this.uploadRouter.delete('/deleteImage/:imagesGroupName', protect, deleteImage);

// ---- Category Routes ---- //
this.categoryRouter.get('/getCategories', getCategories);
this.categoryRouter.post('/addCategory', protect, addCategory);
this.categoryRouter.post('/removeCategory', protect, removeCategory);

// ---- AboutMe Routes ---- //
this.aboutMeRouter.get('/getAboutMe', getAboutMe);
this.aboutMeRouter.post('/editAboutMe', protect, editAboutMe);
this.aboutMeRouter.delete('/deleteAboutMeImage', protect, deleteAboutMeImage);
