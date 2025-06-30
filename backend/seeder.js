const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'manager',
  },
  {
    name: 'Cashier User',
    email: 'cashier@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'cashier',
  },
];

const categories = [
  {
    name: 'Beverages',
    description: 'Drinks and liquids',
  },
  {
    name: 'Bakery',
    description: 'Bread and baked goods',
  },
  {
    name: 'Canned Goods',
    description: 'Canned and jarred items',
  },
  {
    name: 'Dairy',
    description: 'Milk, cheese, and other dairy products',
  },
  {
    name: 'Dry Goods',
    description: 'Pasta, rice, cereal, and other dry goods',
  },
  {
    name: 'Frozen Foods',
    description: 'Frozen meals and ingredients',
  },
  {
    name: 'Meat',
    description: 'Beef, pork, poultry, and other meats',
  },
  {
    name: 'Produce',
    description: 'Fruits and vegetables',
  },
  {
    name: 'Snacks',
    description: 'Chips, crackers, and other snack items',
  },
  {
    name: 'Household',
    description: 'Non-food household items',
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported!');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories imported!');

    // Create products based on categories
    const products = [];

    // Beverages
    products.push({
      name: 'Coca-Cola',
      barcode: '000001',
      category: createdCategories[0]._id,
      price: 1.99,
      costPrice: 0.75,
      stockQuantity: 100,
      description: '2L bottle of Coca-Cola',
    });

    products.push({
      name: 'Orange Juice',
      barcode: '000002',
      category: createdCategories[0]._id,
      price: 3.49,
      costPrice: 1.50,
      stockQuantity: 50,
      description: '1L bottle of fresh orange juice',
    });

    // Bakery
    products.push({
      name: 'White Bread',
      barcode: '000003',
      category: createdCategories[1]._id,
      price: 2.49,
      costPrice: 1.00,
      stockQuantity: 30,
      description: 'Loaf of white bread',
    });

    products.push({
      name: 'Croissants',
      barcode: '000004',
      category: createdCategories[1]._id,
      price: 4.99,
      costPrice: 2.00,
      stockQuantity: 20,
      description: 'Pack of 4 butter croissants',
    });

    // Canned Goods
    products.push({
      name: 'Baked Beans',
      barcode: '000005',
      category: createdCategories[2]._id,
      price: 0.99,
      costPrice: 0.40,
      stockQuantity: 80,
      description: '400g can of baked beans',
    });

    products.push({
      name: 'Tomato Soup',
      barcode: '000006',
      category: createdCategories[2]._id,
      price: 1.29,
      costPrice: 0.60,
      stockQuantity: 60,
      description: '400g can of tomato soup',
    });

    // Dairy
    products.push({
      name: 'Milk',
      barcode: '000007',
      category: createdCategories[3]._id,
      price: 2.29,
      costPrice: 1.20,
      stockQuantity: 40,
      description: '1L of whole milk',
    });

    products.push({
      name: 'Cheddar Cheese',
      barcode: '000008',
      category: createdCategories[3]._id,
      price: 3.99,
      costPrice: 2.50,
      stockQuantity: 25,
      description: '250g of mature cheddar cheese',
    });

    // Dry Goods
    products.push({
      name: 'Spaghetti',
      barcode: '000009',
      category: createdCategories[4]._id,
      price: 1.49,
      costPrice: 0.70,
      stockQuantity: 70,
      description: '500g of dried spaghetti',
    });

    products.push({
      name: 'Rice',
      barcode: '000010',
      category: createdCategories[4]._id,
      price: 2.99,
      costPrice: 1.50,
      stockQuantity: 50,
      description: '1kg of white rice',
    });

    // Insert products
    await Product.insertMany(products);
    console.log('Products imported!');

    console.log('Data import completed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}