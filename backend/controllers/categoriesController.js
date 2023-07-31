const {asyncHandler} = require("../middlwares");
const Categories = require("../schems/categoriesSchem");

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

    await Categories.updateMany(
        {categoriesArray: {$exists: true}},
        {$pull: {categoriesArray: req.body.val}}
    );

    const updatedCategories = await Categories.find({categoriesArray: {$exists: true}});

    res.json(updatedCategories[0].categoriesArray);
});
