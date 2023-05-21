const fs = require("fs");
const fs_extra = require('fs-extra');
const multer = require("multer");
const path = require("path");
const {asyncHandler} = require("../middlwares");
const sharp = require("sharp");
const {uploadDirectory, imageMetadataFile, imageUploadRefs} = require("../../server");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

if (!fs.existsSync(imageUploadRefs)) {
    fs.mkdirSync(imageUploadRefs);
}

if (!fs.existsSync(imageMetadataFile)) {
    const initialData = {
        images: {}
    };
    fs.writeFileSync(imageMetadataFile, JSON.stringify(initialData));
}

const upload = multer({dest: uploadDirectory});
exports.multerUpload = upload.single('images');

exports.imageUploader = asyncHandler(async (req, res) => {
    const filePath = req.file.path;
    const fileName = req.file.originalname.replace(' ', '_').toLowerCase();
    const newPath = path.join(uploadDirectory, fileName);

    fs.renameSync(filePath, newPath);
    const sharpInputImage = `${uploadDirectory}/${fileName}`;

    await sharp(sharpInputImage)
        .resize(800)
        .toFormat('jpeg')
        .jpeg({quality: 75})
        .toBuffer()
        .then(buffer => {
            fs.writeFile(sharpInputImage, buffer, err => {
                if (err) {
                    console.error('Error writing image file:', err);
                } else {
                    console.log('Image file has been rewritten with the buffer image.');
                }
            })
        })
        .catch(console.error);

    const metadata = {
        category: req.body.category,
        description: req.body.description,
    };

    await saveImageMetadata(fileName, metadata);
    const imagesMetadata = getImagesMetaData();
    res.json(imagesMetadata);


});

exports.getImages = asyncHandler(async (req, res) => {
    res.send(getImagesMetaData());
});

exports.clearImages = asyncHandler(async (req, res) => {
    fs_extra.emptyDir(uploadDirectory)
        .then(() => {
            console.log('All files deleted successfully.');
            const data = JSON.parse(fs.readFileSync(imageMetadataFile));
            data.images = {};
            fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

            res.send({});
        })
        .catch((err) => {
            console.error('Error deleting files:', err);
        });
});

//////// util upload functions ///////////
function saveImageMetadata(fileName, metadata) {
    const data = JSON.parse(fs.readFileSync(imageMetadataFile));

    data.images[fileName] = metadata;

    fs.writeFileSync(imageMetadataFile, JSON.stringify(data));
}
//////// End util upload functions ///////////

/////// util send images functions ///////////
function getImagesMetaData() {
    return JSON.parse(fs.readFileSync(imageMetadataFile)).images;
}
