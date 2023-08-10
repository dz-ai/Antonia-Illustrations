const {asyncHandler} = require("../middlwares");
const AboutMe = require("../schems/aboutMeSchem");

exports.getAboutMeText = asyncHandler(async (req, res) => {
    const aboutMeText = await AboutMe.findOne({}, 'text');

    res.json(aboutMeText);
});

exports.editAboutMeText = asyncHandler(async (req, res) => {
    const newText = req.body.text;

    let aboutMeText = await AboutMe.findOne({}, 'text');

    if (!aboutMeText) {
        aboutMeText = new AboutMe({text: newText});
    } else {
        aboutMeText.text = newText;
    }

    await aboutMeText.save();

    const aboutMeNewText = await AboutMe.findOne({}, 'text');

    res.json(aboutMeNewText);
});
