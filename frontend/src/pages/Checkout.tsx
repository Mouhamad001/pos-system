import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { RootState } from '../features/store';
import { getProducts } from '../features/products/productSlice';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setDiscountAmount,
  setPaymentMethod,
  clearCart,
} from '../features/cart/cartSlice';
import { createOrder, reset } from '../features/orders/orderSlice';

const Checkout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [discountInput, setDiscountInput] = useState('0');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  const dispatch = useDispatch();
  const { products, isLoading: productsLoading } = useSelector(
    (state: RootState) => state.products
  );
  const { items, taxRate, discountAmount, paymentMethod } = useSelector(
    (state: RootState) => state.cart
  );
  const { isLoading: orderLoading, isSuccess, order } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(getProducts() as any);
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && order) {
      setReceiptNumber(order.receiptNumber);
      setSuccessDialogOpen(true);
      dispatch(clearCart());
      dispatch(reset());
    }
  }, [isSuccess, order, dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ product: productId, quantity }));
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountInput(e.target.value);
    const discount = parseFloat(e.target.value) || 0;
    dispatch(setDiscountAmount(discount));
  };

  const handlePaymentMethodChange = (e: any) => {
    dispatch(setPaymentMethod(e.target.value));
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount - discountAmount;

    const orderData = {
      orderItems: items,
      paymentMethod,
      taxAmount,
      discountAmount,
      totalAmount,
      notes: '',
    };

    dispatch(createOrder(orderData) as any);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  // Calculate totals
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = subtotal + tax - discountAmount;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Product Search and List */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            {searchTerm && (
              <List>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product: any) => (
                    <Card key={product._id} sx={{ mb: 1 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Grid container alignItems="center">
                          <Grid item xs={8}>
                            <Typography variant="subtitle1">
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${product.price.toFixed(2)} | Stock:{' '}
                              {product.stockQuantity}
                            </Typography>
                          </Grid>
                          <Grid item xs={4} textAlign="right">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stockQuantity < 1}
                              startIcon={<AddIcon />}
                            >
                              Add
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography>No products found</Typography>
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Cart and Checkout */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Order
            </Typography>

            {items.length > 0 ? (
              <>
                <List>
                  {items.map((item) => (
                    <ListItem
                      key={item.product}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFromCart(item.product)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={6}>
                          <ListItemText
                            primary={item.name}
                            secondary={`$${item.price.toFixed(2)}`}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product,
                                  item.quantity - 1
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product,
                                  item.quantity + 1
                                )
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        value={paymentMethod}
                        label="Payment Method"
                        onChange={handlePaymentMethodChange}
                      >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="card">Card</MenuItem>
                        <MenuItem value="mobile_payment">
                          Mobile Payment
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Discount Amount"
                      type="number"
                      value={discountInput}
                      onChange={handleDiscountChange}
                      InputProps={{
                        startAdornment: <Typography>$</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography>${subtotal.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>Tax ({(taxRate * 100).toFixed(0)}%):</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography>${tax.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>Discount:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography>-${discountAmount.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">Total:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="h6">${total.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={orderLoading || items.length === 0}
                  sx={{ mt: 2 }}
                >
                  {orderLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Complete Sale'
                  )}
                </Button>
              </>
            ) : (
              <Alert severity="info">
                No items in cart. Search and add products to begin.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Sale Completed Successfully</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Receipt Number: {receiptNumber}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total Amount: ${total.toFixed(2)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Payment Method:{' '}
            {paymentMethod.charAt(0).toUpperCase() +
              paymentMethod.slice(1).replace('_', ' ')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Checkout;