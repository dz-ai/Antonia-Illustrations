const jwt = require('jsonwebtoken');

const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);


// console.log(crypto.randomBytes(64).toString('hex'));

const protect = asyncHandler((req, res, next) => {
    let token;

    if (req.headers.auth && req.headers.auth.startsWith('Bearer')) {
        token = req.headers.auth.split(' ')[1];
    }

    if (!token) {
        return next(new Error('not authorized'));
    }

    try {
        const id = jwt.verify(token, process.env.JWT_SECRET);

        req.decodeUserId = id;
        next();
    } catch (error) {
        res.status(403).send({isSign: false, error});
        return next(new Error('not authorized'));
    }
});


module.exports = {asyncHandler, protect};