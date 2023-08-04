const {asyncHandler} = require("../middlwares");
const Categories = require("../schems/categoriesSchem");
const Image = require("../schems/imagesSchem");

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

    await Categories.updateMany(
        {categoriesArray: {$exists: true}},
        {$push: {categoriesArray: req.body.val}},
    );
    const updatedCategories = await Categories.find({categoriesArray: {$exists: true}});

    res.json(updatedCategories[0].categoriesArray);
});

exports.removeCategory = asyncHandler(async (req, res) => {
    const categoryToRemove = req.body.val;

    const allImages = await Image.find({});

    const categoryIsInUse = allImages.some(image => image.imageCategory === categoryToRemove);

    if (categoryIsInUse) {
        res.json('This Category is still in use, Remove Images that use this Category before remove the category');
        return
    }

    await Categories.updateMany(
        {categoriesArray: {$exists: true}},
        {$pull: {categoriesArray: categoryToRemove}}
    );

    const updatedCategories = await Categories.find({categoriesArray: {$exists: true}});

    res.json(updatedCategories[0].categoriesArray);
});
