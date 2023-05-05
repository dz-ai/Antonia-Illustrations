const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
module.exports.bcrypt = bcrypt;

// const crypto = require('crypto');
// console.log(crypto.randomBytes(64).toString('hex'));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.use(express.json());

const users = require('./backend/userRouter');

app.use('/api/users', users);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('mongoose connected'))
    .catch(error => console.error(error));

app.listen(PORT, () => console.log(PORT));