const db = require('../mockDb');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const products = db.getProducts();
    
    // Add category name to each product
    const productsWithCategory = products.map(product => {
      const category = db.getCategoryById(product.category);
      return {
        ...product,
        category: {
          _id: category?._id,
          name: category?.name || 'Unknown Category'
        }
      };
    });
    
    res.json(productsWithCategory);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = db.getProductById(req.params.id);

    if (product) {
      const category = db.getCategoryById(product.category);
      const productWithCategory = {
        ...product,
        category: {
          _id: category?._id,
          name: category?.name || 'Unknown Category'
        }
      };
      
      res.json(productWithCategory);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Manager
const createProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      category,
      price,
      costPrice,
      stockQuantity,
      description,
      image,
    } = req.body;

    const product = db.createProduct({
      name,
      barcode,
      category,
      price,
      costPrice,
      stockQuantity: stockQuantity || 0,
      description,
      image,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Manager
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      category,
      price,
      costPrice,
      stockQuantity,
      description,
      image,
      isActive,
    } = req.body;

    const product = db.getProductById(req.params.id);

    if (product) {
      const updateData = {
        name: name !== undefined ? name : product.name,
        barcode: barcode !== undefined ? barcode : product.barcode,
        category: category !== undefined ? category : product.category,
        price: price !== undefined ? price : product.price,
        costPrice: costPrice !== undefined ? costPrice : product.costPrice,
        stockQuantity: stockQuantity !== undefined ? stockQuantity : product.stockQuantity,
        description: description !== undefined ? description : product.description,
        image: image !== undefined ? image : product.image,
        isActive: isActive !== undefined ? isActive : product.isActive,
      };

      const updatedProduct = db.updateProduct(req.params.id, updateData);
      
      if (updatedProduct) {
        // Add category name to response
        const category = db.getCategoryById(updatedProduct.category);
        const productWithCategory = {
          ...updatedProduct,
          category: {
            _id: category?._id,
            name: category?.name || 'Unknown Category'
          }
        };
        
        res.json(productWithCategory);
      } else {
        throw new Error('Failed to update product');
      }
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Manager
const deleteProduct = async (req, res) => {
  try {
    const product = db.getProductById(req.params.id);

    if (product) {
      const deleted = db.deleteProduct(req.params.id);
      
      if (deleted) {
        res.json({ message: 'Product removed' });
      } else {
        throw new Error('Failed to delete product');
      }
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Private/Manager
const updateStock = async (req, res) => {
  try {
    const { stockQuantity } = req.body;

    const product = db.getProductById(req.params.id);

    if (product) {
      const updatedProduct = db.updateProduct(req.params.id, {
        stock: stockQuantity
      });
      
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        throw new Error('Failed to update product stock');
      }
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Private
const searchProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    
    let products = db.getProducts();
    
    if (keyword) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    if (category) {
      products = products.filter(product => 
        product.category === category
      );
    }
    
    // Add category name to each product
    const productsWithCategory = products.map(product => {
      const cat = db.getCategoryById(product.category);
      return {
        ...product,
        category: {
          _id: cat?._id,
          name: cat?.name || 'Unknown Category'
        }
      };
    });
    
    res.json(productsWithCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  searchProducts,
};