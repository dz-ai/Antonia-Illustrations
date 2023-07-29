const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
module.exports.bcrypt = bcrypt;

exports.uploadDirectory = path.join(__dirname, 'uploads');
exports.imageUploadRefs = path.join(__dirname, 'uploadsRefs');
exports.imageMetadataFile = path.join(__dirname, 'uploadsRefs', 'imageMetadataFile.json');

const app = express();
const PORT = process.env.PORT || 3001;

// const crypto = require('crypto');
// console.log(crypto.randomBytes(64).toString('hex'));

app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.use('/imagesUploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

const users = require('./backend/router').userRouter;
const uploadImage = require('./backend/router').uploadRouter;
const categories = require('./backend/router').categoryRouter;

app.use('/api/users', users);
app.use('/api/uploadImage', uploadImage);
app.use('/api/categories', categories);

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