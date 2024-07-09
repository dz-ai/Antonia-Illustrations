const {asyncHandler} = require("../middlwares");
const Categories = require("../schems/categoriesSchem");
const Image = require("../schems/imagesSchem");
const fs = require("fs");
const {imageMetadataFile} = require("../../server");

// Use to init an "categoriesArray"

// const newItem = new Categories({
//     categoriesArray: []
// });
//
// newItem.save();

/// -------- ///

exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Categories.find({categoriesArray: {$exists: true}});
    res.json(categories[0].categoriesArray);
});

exports.addCategory = asyncHandler(async (req, res) => {
    const categoryToAdd = req.body.val;

    const isCategoryExist = await Categories.find({categoriesArray: {$regex: new RegExp(`\\b${categoryToAdd}\\b`, 'i')}});

    if (isCategoryExist.length > 0 || categoryToAdd.toLowerCase() === 'all categories') {
        res.json('Category already exist');
        return;
    }

    await Categories.updateMany(
        {categoriesArray: {$exists: true}},
        {$push: {categoriesArray: categoryToAdd}},
    );
    const updatedCategories = await Categories.find({categoriesArray: {$exists: true}});

    res.json(updatedCategories[0].categoriesArray);
});

exports.removeCategory = asyncHandler(async (req, res) => {
    const categoryToRemove = req.body.val;

    const allImages = await Image.find({});

    const categoryIsInUse = allImages[0].images.some(image => image.imageCategory === categoryToRemove);

    if (categoryIsInUse) {
        res.status(409).json('This Category is still in use, Remove Images that use this Category before remove the category');
        return;
    }

    await Categories.updateMany(
        {categoriesArray: {$exists: true}},
        {$pull: {categoriesArray: categoryToRemove}}
    );

    const updatedCategories = await Categories.find({categoriesArray: {$exists: true}});

    res.json(updatedCategories[0].categoriesArray);
});

exports.renameCategory = asyncHandler(async (req, res) => {
    const {categoryToRename, newName: newCategoryName} = req.body;
    const imagesGroupName = req.params.imagesGroupName;

    const categoriesArr = await Categories.findOne({});
    const index = categoriesArr.categoriesArray.indexOf(categoryToRename);
    categoriesArr.categoriesArray[index] = newCategoryName;
    await categoriesArr.save();

    const updatedImages = await renameCategoriesInImages(imagesGroupName, categoryToRename, newCategoryName);

    const updatedCategories = await Categories.find({categoriesArray: {$exists: true}});

    res.json({
        categoriesArr: updatedCategories[0].categoriesArray,
        updatedCategory: newCategoryName,
        updatedImages
    });
});

// await Categories.updateOne({categoriesArray: ['All Categories']});

async function renameCategoriesInImages(imagesGroupName, oldCategoryName, newCategoryName) {
    const data = JSON.parse(fs.readFileSync(imageMetadataFile));
    Object.keys(data[imagesGroupName])
        .forEach(key => {
            if (data[imagesGroupName][key].imageCategory === oldCategoryName) {
                data[imagesGroupName][key].imageCategory = newCategoryName;
            }
        });
    fs.writeFileSync(imageMetadataFile, JSON.stringify(data));

    const allImages = await Image.findOne({imagesGroupName});

    allImages.images = allImages.images.map(image => {
        if (image.imageCategory === oldCategoryName) {
            image.imageCategory = newCategoryName;
        }
        return image;
    });

    await allImages.save();

    return data[imagesGroupName];
}

