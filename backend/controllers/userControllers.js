const User = require('../schems/userSchem');
const {asyncHandler} = require('../middlwares');

// exports.creatUser = asyncHandler(async (req, res) => {
//     let user = await User.findOne({email: req.body.email});
//
//     if (!user || user.length === 0) {
//
//         await User.create({email: '', password: ''});
//         user = await User.findOne({email: req.body.email})
//         const token = user.getJwtToken();
//
//         res.json({
//             isSign: true,
//             message: 'login successfully',
//             token,
//         });
//     } else {
//         res.json({
//             isSign: false,
//             message: 'you are a signed user please login',
//         });
//     }
// });

exports.loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if (email !== process.env.ANTONIA_EMAIL) {
        res.status(403);
        res.json({
            isSign: false,
            message: 'Not authorized Email address'
        });
    }

    const user = await User.findOne({email}).select('+password');
    if (!user) {
        res.json({
            isSign: false,
            message: 'Email not found please check email spelling'
        });
        return next(new Error('not signed'));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.json({
            isSign: false,
            message: 'password does not fit'
        });
    }
    const token = user.getJwtToken();
    res.json({
        isSign: true,
        message: 'login successfully',
        token,
    });
});

exports.authenticateToken = asyncHandler(async (req, res, next) => {
    if (req.decodeUserId) {
        res.json({
            isSign: true,
            message: 'Authenticate Token',
        });
    } else {
        return next(new Error('Not Authenticate Token'));
    }
});
