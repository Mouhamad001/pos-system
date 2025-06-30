const db = require('../mockDb');

// Generate unique receipt number
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Get count of orders for today to generate sequential number
  const todayStart = new Date(date.setHours(0, 0, 0, 0));
  const todayEnd = new Date(date.setHours(23, 59, 59, 999));
  
  const orders = db.getOrders();
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= todayStart && orderDate <= todayEnd;
  });
  
  const sequence = (todayOrders.length + 1).toString().padStart(4, '0');
  return `R${year}${month}${day}${sequence}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      paymentMethod,
      taxAmount,
      discountAmount,
      totalAmount,
      notes,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();

    // Create order
    const order = db.createOrder({
      user: req.user._id,
      items: orderItems,
      paymentMethod,
      taxAmount,
      discountAmount,
      totalAmount,
      receiptNumber,
      notes,
      isPaid: true,
      paidAt: new Date(),
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);

    if (order) {
      // Add user and product details
      const user = db.findUserById(order.user);
      const orderWithDetails = {
        ...order,
        user: user ? { 
          _id: user._id, 
          name: user.name, 
          email: user.email 
        } : null,
        items: order.items.map(item => {
          const product = db.getProductById(item.product);
          return {
            ...item,
            product: product ? {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image
            } : null
          };
        })
      };
      
      res.json(orderWithDetails);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Manager
const getOrders = async (req, res) => {
  try {
    const orders = db.getOrders();
    
    // Add user details
    const ordersWithUsers = orders.map(order => {
      const user = db.findUserById(order.user);
      return {
        ...order,
        user: user ? { _id: user._id, name: user.name } : null
      };
    });
    
    // Sort by createdAt in descending order
    ordersWithUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(ordersWithUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = db.getOrders().filter(order => order.user === req.user._id);
    
    // Sort by createdAt in descending order
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get orders by date range
// @route   GET /api/orders/report
// @access  Private/Manager
const getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const orders = db.getOrdersByDateRange(start, end);
    
    // Add user details
    const ordersWithUsers = orders.map(order => {
      const user = db.findUserById(order.user);
      return {
        ...order,
        user: user ? { _id: user._id, name: user.name } : null
      };
    });
    
    // Sort by createdAt in descending order
    ordersWithUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(ordersWithUsers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get sales summary
// @route   GET /api/orders/sales-summary
// @access  Private/Manager
const getSalesSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let startDate;
    
    if (period === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date(0); // Beginning of time
    }
    
    const orders = db.getOrdersByDateRange(startDate, new Date());
    
    // Calculate total sales
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalSales = {
      totalAmount,
      count: orders.length
    };
    
    // Calculate sales by payment method
    const salesByPaymentMethod = [];
    const paymentMethods = {};
    
    orders.forEach(order => {
      if (!paymentMethods[order.paymentMethod]) {
        paymentMethods[order.paymentMethod] = {
          _id: order.paymentMethod,
          totalAmount: 0,
          count: 0
        };
      }
      
      paymentMethods[order.paymentMethod].totalAmount += order.totalAmount;
      paymentMethods[order.paymentMethod].count += 1;
    });
    
    Object.values(paymentMethods).forEach(method => {
      salesByPaymentMethod.push(method);
    });
    
    res.json({
      totalSales,
      salesByPaymentMethod,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  getMyOrders,
  getOrdersByDateRange,
  getSalesSummary,
};