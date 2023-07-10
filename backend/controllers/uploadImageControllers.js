const fs = require("fs");
const ImageKit = require("imagekit");
const {asyncHandler} = require("../middlwares");
const {imageMetadataFile, imageUploadRefs} = require("../../server");

if (!fs.existsSync(imageUploadRefs)) {
    fs.mkdirSync(imageUploadRefs);
}

// TODO make database backup for 'imageMetadataFile' so the images will not los when redeploy.
if (!fs.existsSync(imageMetadataFile)) {
    const initialData = {
        images: {}
    };
    fs.writeFileSync(imageMetadataFile, JSON.stringify(initialData));
}

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_API_KEY,
    urlEndpoint: "https://ik.imagekit.io/thfdl6dmv",
});

exports.getImages = asyncHandler(async (req, res) => {
    res.send(getImagesMetaData());
});

exports.getSignature = asyncHandler(async (req, res) => {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
});

exports.setImageMetaData = asyncHandler(async (req, res) => {
    const {fileName, imageCategory, imageDescription, replaceImageWith, imageID} = req.body;

    if (fileName && imageCategory && imageDescription) {

        const data = JSON.parse(fs.readFileSync(imageMetadataFile));

        // new image upload
        if (!data.images[fileName]) {
            data.images[fileName] = {imageCategory, imageDescription, imageID};

            fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

            res.json('Upload Successfully');
            return;
        }
        // image exist
        if (data.images[fileName]) {
            const imageMD = data.images[fileName];
            const changeImageWith = replaceImageWith && !Object.keys(data.images).includes(replaceImageWith) && fileName !== replaceImageWith;
            const imageAlreadyExist = replaceImageWith && Object.keys(data.images).includes(replaceImageWith) && fileName !== replaceImageWith;

            // change the image with new image
            // TODO add error handling to those 2 imagekit functions
            if (changeImageWith) {
                await imagekit.deleteFile(data.images[fileName].imageID)
                    .then(results => console.log(results))
                    .catch(error => console.log(error));

                await imagekit.purgeCache(`https://ik.imagekit.io/thfdl6dmv/${fileName}`)
                    .then(results => console.log(results))
                    .catch(error => console.log(error));


                delete data.images[fileName];
                data.images[replaceImageWith] = {imageCategory, imageDescription, imageID};

                fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

                res.json('Image Change Successfully');
                return
            }
            if (imageAlreadyExist) {
                res.json('Image exist');
                return
            }
            // change image Category or/and Description
            if (imageMD.imageCategory !== imageCategory || imageMD.imageDescription !== imageDescription) {
                data.images[fileName] = {
                    imageCategory,
                    imageDescription,
                    imageID: imageID || data.images[fileName].imageID
                };

                fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

                res.json('Image Details change Successfully');
            }
        }

    } else {
        const missing = [];
        if (!fileName) missing.push('Upload Image Name');
        if (!imageCategory) missing.push('Image Category');
        if (!imageDescription) missing.push('Image Description');
        res.json(`Missing ${missing.map(miss => miss + ' ')}`);
    }

});

exports.deleteImageMetaData = asyncHandler(async (req, res) => {
    const {fileName} = req.body

    const data = JSON.parse(fs.readFileSync(imageMetadataFile));

    // delete from imagekit.io service
    // TODO add proper error handling
    await imagekit.deleteFile(data.images[fileName].imageID)
        .then(results => console.log('del file?: ', results))
        .catch(error => console.log(error));

    await imagekit.purgeCache(`https://ik.imagekit.io/thfdl6dmv/${fileName}`)
        .then(results => console.log('results: ', results))
        .catch(error => console.log(error));

    delete data.images[fileName];

    fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

    res.json('Image Deleted');
});

// util function
function getImagesMetaData() {
    return JSON.parse(fs.readFileSync(imageMetadataFile)).images;
}
