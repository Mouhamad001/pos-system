const db = require('../mockDb');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = async (req, res) => {
  try {
    const category = db.getCategoryById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Manager
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category with same name exists
    const categoryExists = db.getCategories().find(
      category => category.name.toLowerCase() === name.toLowerCase()
    );

    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const category = db.createCategory({
      name,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Manager
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = db.getCategoryById(req.params.id);

    if (category) {
      const updateData = {
        name: name || category.name,
        description: description || category.description,
      };

      const updatedCategory = db.updateCategory(req.params.id, updateData);
      
      if (updatedCategory) {
        res.json(updatedCategory);
      } else {
        throw new Error('Failed to update category');
      }
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Manager
const deleteCategory = async (req, res) => {
  try {
    const category = db.getCategoryById(req.params.id);

    if (category) {
      const deleted = db.deleteCategory(req.params.id);
      
      if (deleted) {
        res.json({ message: 'Category removed' });
      } else {
        throw new Error('Failed to delete category');
      }
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};