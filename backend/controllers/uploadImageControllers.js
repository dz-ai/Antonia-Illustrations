const fs = require("fs");
const ImageKit = require("imagekit");
const {asyncHandler} = require("../middlwares");
const {imageMetadataFile, imageUploadRefs} = require("../../server");
const ImagesGroups = require('../schems/imagesSchem');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_API_KEY,
    urlEndpoint: "https://ik.imagekit.io/thfdl6dmv",
});

//// -- Get all images for given Image Group --////
exports.getImages = asyncHandler(async (req, res) => {
    res.send(getImagesMetaData(req.params.imagesGroupName));
});

//// -- Util functionality for Imagekit service to allow upload from frontend --////
exports.getSignature = asyncHandler(async (req, res) => {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
});

//// -- Save Image or image details to fs and Database -- ////
exports.setImageMetaData = asyncHandler(async (req, res) => {
    const {existingImageFileName, imageCategory, imageDescription, imageToUpLoad, imageID} = req.body;

    const data = JSON.parse(fs.readFileSync(imageMetadataFile));
    const imagesGroupName = req.params.imagesGroupName;

    // add new imageGroup if not exist
    if (!data[imagesGroupName]) {
        data[imagesGroupName] = {};
    }

    // image to upload already exist
    if (data[imagesGroupName][imageToUpLoad]) {
        res.json('Image already exist');
        return
    }

    // replace existing image or its details (category, description)
    if (existingImageFileName) {

        const imageMD = data[imagesGroupName][existingImageFileName];

        // change the image with new image
        if (imageToUpLoad) {
            // delete from imagekit only if not in use in another imagesGroup
            if (!doesImageInUseInOtherGroups(data, imagesGroupName, existingImageFileName)) {
                await imagekit.deleteFile(data[imagesGroupName][existingImageFileName].imageID)
                    .then(results => console.log(results))
                    .catch(error => console.log(error));

                await imagekit.purgeCache(`https://ik.imagekit.io/thfdl6dmv/${existingImageFileName}`)
                    .then(results => console.log(results))
                    .catch(error => console.log(error));

            }

            const imageGroupDataBase = await ImagesGroups.findOne({imagesGroupName: imagesGroupName});

            const imageIndex = imageGroupDataBase.images.findIndex(image => image.fileName === existingImageFileName);

            imageGroupDataBase.images[imageIndex] = {fileName: imageToUpLoad, imageCategory, imageDescription, imageID};

            await imageGroupDataBase.save();

            delete data[imagesGroupName][existingImageFileName];
            data[imagesGroupName][imageToUpLoad] = {imageCategory, imageDescription, imageID};

            fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

            res.json('Image Change Successfully');
            return
        }

        // change image Category or/and Description
        if (imageMD.imageCategory !== imageCategory || imageMD.imageDescription !== imageDescription) {
            const updateImage = {
                fileName: existingImageFileName,
                imageCategory,
                imageDescription,
                imageID: imageID || data[imagesGroupName][existingImageFileName].imageID
            };

            data[imagesGroupName][existingImageFileName] = updateImage;

            const imageGroupDataBase = await ImagesGroups.findOne({imagesGroupName: imagesGroupName});

            const imageIndex = imageGroupDataBase.images.findIndex(image => image.fileName === existingImageFileName);

            imageGroupDataBase.images[imageIndex] = updateImage;

            await imageGroupDataBase.save();

            fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

            res.json('Image Details change Successfully');
            return;
        }
    }

    // new image upload
    if (!existingImageFileName && imageToUpLoad) {

        let imageGroupDataBase = await ImagesGroups.findOne({imagesGroupName: imagesGroupName});

        if (!imageGroupDataBase) {
            imageGroupDataBase = new ImagesGroups({imagesGroupName: imagesGroupName, images: []});
        }

        imageGroupDataBase.images.push({
            fileName: imageToUpLoad,
            imageCategory,
            imageDescription,
            imageID
        });

        await imageGroupDataBase.save();

        data[imagesGroupName][imageToUpLoad] = {imageCategory, imageDescription, imageID};

        fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

        res.json('Upload Successfully');
        return;
    }
    // if none of those cases get in...
    res.json('something went wrong');
});

//// -- Delete Image from fs and Imagekit service --////
exports.deleteImage = asyncHandler(async (req, res) => {
    const {fileName} = req.body
    const {imagesGroupName} = req.params;

    const data = JSON.parse(fs.readFileSync(imageMetadataFile));

    // delete from imagekit.io service
    if (!doesImageInUseInOtherGroups(data, imagesGroupName, fileName) && data[imagesGroupName].hasOwnProperty(fileName)) {
        await imagekit.deleteFile(data[imagesGroupName][fileName].imageID)
            .then(results => console.log('del file?: ', results))
            .catch(error => console.log(error));

        await imagekit.purgeCache(`https://ik.imagekit.io/thfdl6dmv/${fileName}`)
            .then(results => console.log('results: ', results))
            .catch(error => console.log(error));

    }

    // delete from data base
    const imageInDataBaseGroup = await ImagesGroups.findOne({imagesGroupName: imagesGroupName});

    if (!imageInDataBaseGroup) {
        return res.status(404).json('Image group not found');
    }

    imageInDataBaseGroup.images = imageInDataBaseGroup.images.filter(image => image.fileName !== fileName);

    imageInDataBaseGroup.save();

    // delete from file system
    delete data[imagesGroupName][fileName];

    fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

    res.json('Image Deleted');
});

////-- util function --////
exports.loadDatabaseData = async function () {
    try {
        if (!fs.existsSync(imageUploadRefs)) {
            fs.mkdirSync(imageUploadRefs);
        }

        if (!fs.existsSync(imageMetadataFile)) {
            const allImageData = await ImagesGroups.find();

            const data = {};

            if (allImageData.length > 0) {
                allImageData.forEach(imageGroup => {

                    data[imageGroup.imagesGroupName] = {};

                    imageGroup.images.forEach(image => {
                        data[imageGroup.imagesGroupName][image.fileName] = {
                            imageCategory: image.imageCategory,
                            imageDescription: image.imageDescription,
                            imageID: image.imageID
                        }
                    });
                });

                fs.writeFileSync(imageMetadataFile, JSON.stringify(data));
            }

        }
    } catch (error) {
        console.error('Error loading data from the database:', error);
    }
}

function getImagesMetaData(imagesGroupName) {
    const data = JSON.parse(fs.readFileSync(imageMetadataFile));
    if (!data[imagesGroupName]) {
        data[imagesGroupName] = {};
        fs.writeFileSync(imageMetadataFile, JSON.stringify(data));
    }
    return data[imagesGroupName];
}

function doesImageInUseInOtherGroups(data, imagesGroupName, existingImageFileName) {
    return Object.keys(data).some(groupName => groupName !== imagesGroupName ? data[groupName].hasOwnProperty(existingImageFileName) : false);
}
