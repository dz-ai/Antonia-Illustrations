const {asyncHandler} = require("../middlwares");
const AboutMe = require("../schems/aboutMeSchem");

exports.getAboutMe = asyncHandler(async (req, res) => {
    const aboutMe = await AboutMe.findOne();
    res.json(aboutMe);
});

exports.editAboutMe = asyncHandler(async (req, res) => {
    const {newText, newImage} = req.body;

    let aboutMe = await AboutMe.findOne();

    if (!aboutMe) {
        aboutMe = new AboutMe();
    }

    if (newText) {
        aboutMe.text = newText;
    }

    if (newImage) {
        aboutMe.image = newImage;
    }

    await aboutMe.save();

    const newAboutMe = await AboutMe.findOne();

    res.json(newAboutMe);
});

exports.deleteAboutMeImage = asyncHandler(async (req, res) => {
    await AboutMe.updateMany({image: ''});
    const newAboutMe = await AboutMe.findOne();

    res.json(newAboutMe);
});
