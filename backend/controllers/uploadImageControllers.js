const fs = require("fs");
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

const upload = multer({dest: 'uploads/'});
exports.multerUpload = upload.single('images');

exports.imageUploader = asyncHandler(async (req, res) => {
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const newPath = path.join(uploadDirectory, fileName);

    fs.rename(filePath, newPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to upload image');
        } else {
            const metadata = {
                category: req.body.category,
                description: req.body.description,
            };
            saveImageMetadata(fileName, metadata);
            resizeBufferImage(`uploads/${fileName}`)
            const imagesMetadata = getImagesMetaData();

            res.send(imagesMetadata);
        }
    });
});

exports.getImages = asyncHandler(async (req, res) => {
    res.send(getImagesMetaData());
});

//////// util upload functions ///////////
function saveImageMetadata(fileName, metadata) {
    // read the current contents of the JSON file
    const data = JSON.parse(fs.readFileSync(imageMetadataFile));

    // add the new metadata object to the images array
    data.images[fileName] = metadata;

    // write the updated data back to the JSON file
    fs.writeFileSync(imageMetadataFile, JSON.stringify(data));
}

function resizeBufferImage(imagPath) {
    sharp(imagPath)
        .resize(800)
        .toBuffer((err, data) => {
            if (err) {
                console.error(err);
            } else {
                // write the resized image buffer to a file
                fs.writeFile(imagPath, data, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Resized image saved successfully');
                    }
                });
            }
        });

}

//////// End util upload functions ///////////

/////// util send images functions ///////////
function getImagesMetaData() {
    return JSON.parse(fs.readFileSync(imageMetadataFile)).images;
}
