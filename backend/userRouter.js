const express = require('express');
const {creatUser, loginUser, authenticateToken} = require("./userControllers");
const {protect} = require("./middlwares");

const router = express.Router({mergeParams: true});

// router.get('/signIn', creatUser);
router.post('/logIn', loginUser);
router.get('/authToken', protect, authenticateToken);

module.exports = router;