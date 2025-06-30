import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Grid,
  TextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { RootState } from '../features/store';
import { getOrders, getOrderById, reset } from '../features/orders/orderSlice';

const Orders = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dispatch = useDispatch();
  const { orders, order, isLoading, isError, message } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    dispatch(getOrders() as any);
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleViewOrder = (id: string) => {
    dispatch(getOrderById(id) as any);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDateFilter = () => {
    if (startDate && endDate) {
      dispatch(
        getOrdersByDateRange({ startDate, endDate }) as any
      );
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {isError && <Alert severity="error">{message}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Filter Orders
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleDateFilter}
              disabled={!startDate || !endDate}
            >
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Receipt #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Cashier</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell>{order.receiptNumber}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  {order.paymentMethod.charAt(0).toUpperCase() +
                    order.paymentMethod.slice(1).replace('_', ' ')}
                </TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order._id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {order && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Receipt #: {order.receiptNumber}
                  </Typography>
                  <Typography variant="subtitle1">
                    Date:{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    Cashier: {order.user.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Payment Method:{' '}
                    {order.paymentMethod.charAt(0).toUpperCase() +
                      order.paymentMethod.slice(1).replace('_', ' ')}
                  </Typography>
                  <Typography variant="subtitle1">
                    Tax Amount: ${order.taxAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle1">
                    Discount: ${order.discountAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total: ${order.totalAmount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Items
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems.map((item: any) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {order.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Notes:</Typography>
                  <Typography>{order.notes}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;