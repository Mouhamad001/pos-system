// Mock database for development without MongoDB
const mockDb = {
  users: [
    {
      _id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$5yp1GEzhviw4wXlNggNdbel0wy/.TxPjWVst4c5Xb47TxHDNI5d6u', // password: 'password123'
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '2',
      name: 'Cashier User',
      email: 'cashier@example.com',
      password: '$2b$10$5yp1GEzhviw4wXlNggNdbel0wy/.TxPjWVst4c5Xb47TxHDNI5d6u', // password: 'password123'
      role: 'cashier',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '3',
      name: 'Manager User',
      email: 'manager@example.com',
      password: '$2b$10$5yp1GEzhviw4wXlNggNdbel0wy/.TxPjWVst4c5Xb47TxHDNI5d6u', // password: 'password123'
      role: 'manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  categories: [
    {
      _id: '1',
      name: 'Beverages',
      description: 'Drinks and liquids',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '2',
      name: 'Food',
      description: 'Edible items',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '3',
      name: 'Electronics',
      description: 'Electronic devices',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  products: [
    {
      _id: '1',
      name: 'Coffee',
      description: 'Hot brewed coffee',
      price: 2.99,
      costPrice: 1.50,
      category: '1',
      stockQuantity: 100,
      barcode: '123456789',
      image: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '2',
      name: 'Tea',
      description: 'Hot brewed tea',
      price: 1.99,
      costPrice: 1.00,
      category: '1',
      stockQuantity: 100,
      barcode: '987654321',
      image: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '3',
      name: 'Sandwich',
      description: 'Fresh sandwich',
      price: 5.99,
      costPrice: 3.50,
      category: '2',
      stockQuantity: 50,
      barcode: '456789123',
      image: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: '4',
      name: 'Headphones',
      description: 'Wireless headphones',
      price: 29.99,
      costPrice: 15.00,
      category: '3',
      stockQuantity: 20,
      barcode: '789123456',
      image: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  orders: [],
};

// Helper functions to interact with the mock database
const db = {
  // User operations
  findUserByEmail: (email) => {
    return mockDb.users.find((user) => user.email === email);
  },
  findUserById: (id) => {
    return mockDb.users.find((user) => user._id === id);
  },
  getUsers: () => {
    return [...mockDb.users];
  },
  createUser: (userData) => {
    const newUser = {
      _id: String(mockDb.users.length + 1),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.users.push(newUser);
    return newUser;
  },
  updateUser: (id, userData) => {
    const index = mockDb.users.findIndex((user) => user._id === id);
    if (index === -1) return null;
    
    mockDb.users[index] = {
      ...mockDb.users[index],
      ...userData,
      updatedAt: new Date(),
    };
    return mockDb.users[index];
  },
  deleteUser: (id) => {
    const index = mockDb.users.findIndex((user) => user._id === id);
    if (index === -1) return false;
    
    mockDb.users.splice(index, 1);
    return true;
  },
  
  // Category operations
  getCategories: () => {
    return [...mockDb.categories];
  },
  getCategoryById: (id) => {
    return mockDb.categories.find((category) => category._id === id);
  },
  createCategory: (categoryData) => {
    const newCategory = {
      _id: String(mockDb.categories.length + 1),
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.categories.push(newCategory);
    return newCategory;
  },
  updateCategory: (id, categoryData) => {
    const index = mockDb.categories.findIndex((category) => category._id === id);
    if (index === -1) return null;
    
    mockDb.categories[index] = {
      ...mockDb.categories[index],
      ...categoryData,
      updatedAt: new Date(),
    };
    return mockDb.categories[index];
  },
  deleteCategory: (id) => {
    const index = mockDb.categories.findIndex((category) => category._id === id);
    if (index === -1) return false;
    
    mockDb.categories.splice(index, 1);
    return true;
  },
  
  // Product operations
  getProducts: () => {
    return [...mockDb.products];
  },
  getProductById: (id) => {
    return mockDb.products.find((product) => product._id === id);
  },
  createProduct: (productData) => {
    const newProduct = {
      _id: String(mockDb.products.length + 1),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.products.push(newProduct);
    return newProduct;
  },
  updateProduct: (id, productData) => {
    const index = mockDb.products.findIndex((product) => product._id === id);
    if (index === -1) return null;
    
    mockDb.products[index] = {
      ...mockDb.products[index],
      ...productData,
      updatedAt: new Date(),
    };
    return mockDb.products[index];
  },
  deleteProduct: (id) => {
    const index = mockDb.products.findIndex((product) => product._id === id);
    if (index === -1) return false;
    
    mockDb.products.splice(index, 1);
    return true;
  },
  
  // Order operations
  getOrders: () => {
    return [...mockDb.orders];
  },
  getOrderById: (id) => {
    return mockDb.orders.find((order) => order._id === id);
  },
  createOrder: (orderData) => {
    const newOrder = {
      _id: String(mockDb.orders.length + 1),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.orders.push(newOrder);
    
    // Update product stock
    orderData.items.forEach((item) => {
      const product = mockDb.products.find((p) => p._id === item.product);
      if (product) {
        product.stock -= item.quantity;
      }
    });
    
    return newOrder;
  },
  getOrdersByDateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return mockDb.orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });
  },
};

module.exports = db;