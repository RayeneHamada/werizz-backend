
const mongoose = require('mongoose'),
  Category = mongoose.model('Categories');

exports.newCategory = function (req, res, next) {
  category = new Category();
  category.name = req.body.name;
  category.level = 2;
  category.parent_category = req.body.parent_category;
  category.save((err, doc) => {
    if (err) {

      if (err.code === 11000)
        return res.status(500).json({ message: "Category already exits" });
    }
    else {
      return res.status(200).send(doc);
    }
  })
}

exports.newParentCategory = function (req, res, next) {
  category = new Category();
  category.name = req.body.name;
  category.level = 1;
  category.save((err, doc) => {
    if (err) {

      if (err.code === 11000)
        return res.status(500).json({ message: "Category already exits" });
    }
    else {
      return res.status(200).send(doc);
    }
  })
}
exports.fetchAllCategories = function (req, res, next) {

  Category.find({}, function (err, doc) {

    if (err) {

      return res.status(500).json(err);
    }
    else {
      return res.status(200).send(doc);
    }
  });

}
exports.renameCategory = function (req, res, next) {
  Category.findOne({ name: req.body.oldName },
    (err, category) => {
      if (!category)
        return res.status(404).json({ status: false, message: 'Category record not found.' });
      else {
        category.name = req.body.newName;
        Category.updateOne({ name: req.body.oldName }, category).then(
          () => {
            res.status(201).json({
              message: 'Category updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      }
    });
}
