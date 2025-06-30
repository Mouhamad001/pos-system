import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import { RootState } from '../features/store';

interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByPaymentMethod: {
    _id: string;
    totalAmount: number;
    count: number;
  }[];
  topProducts: {
    _id: string;
    name: string;
    totalQuantity: number;
    totalSales: number;
  }[];
}

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesData, setSalesData] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Set default date range to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const fetchReportData = async () => {
    if (!startDate || !endDate) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      // Fetch orders for the date range
      const ordersResponse = await axios.get(
        `http://localhost:12001/api/orders/report?startDate=${startDate}&endDate=${endDate}`,
        config
      );

      const orders = ordersResponse.data;

      // Calculate sales summary
      const totalSales = orders.reduce(
        (sum: number, order: any) => sum + order.totalAmount,
        0
      );
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      // Group by payment method
      const paymentMethods: { [key: string]: { totalAmount: number; count: number } } = {};
      orders.forEach((order: any) => {
        if (!paymentMethods[order.paymentMethod]) {
          paymentMethods[order.paymentMethod] = { totalAmount: 0, count: 0 };
        }
        paymentMethods[order.paymentMethod].totalAmount += order.totalAmount;
        paymentMethods[order.paymentMethod].count += 1;
      });

      const salesByPaymentMethod = Object.keys(paymentMethods).map((key) => ({
        _id: key,
        totalAmount: paymentMethods[key].totalAmount,
        count: paymentMethods[key].count,
      }));

      // Calculate top products
      const productMap: { [key: string]: { name: string; totalQuantity: number; totalSales: number } } = {};
      
      orders.forEach((order: any) => {
        order.orderItems.forEach((item: any) => {
          if (!productMap[item.product]) {
            productMap[item.product] = {
              name: item.name,
              totalQuantity: 0,
              totalSales: 0,
            };
          }
          productMap[item.product].totalQuantity += item.quantity;
          productMap[item.product].totalSales += item.price * item.quantity;
        });
      });

      const topProducts = Object.keys(productMap)
        .map((key) => ({
          _id: key,
          name: productMap[key].name,
          totalQuantity: productMap[key].totalQuantity,
          totalSales: productMap[key].totalSales,
        }))
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 5);

      setSalesData({
        totalSales,
        totalOrders,
        averageOrderValue,
        salesByPaymentMethod,
        topProducts,
      });

      setError('');
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to fetch report data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Sales Reports
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Date Range
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
              onClick={fetchReportData}
              disabled={!startDate || !endDate}
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        salesData && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Sales
                    </Typography>
                    <Typography variant="h4">
                      ${salesData.totalSales.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Orders
                    </Typography>
                    <Typography variant="h4">{salesData.totalOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Average Order Value
                    </Typography>
                    <Typography variant="h4">
                      ${salesData.averageOrderValue.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Sales by Payment Method
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Payment Method</TableCell>
                          <TableCell align="right">Orders</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesData.salesByPaymentMethod.map((method) => (
                          <TableRow key={method._id}>
                            <TableCell>
                              {method._id.charAt(0).toUpperCase() +
                                method._id.slice(1).replace('_', ' ')}
                            </TableCell>
                            <TableCell align="right">{method.count}</TableCell>
                            <TableCell align="right">
                              ${method.totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Top Selling Products
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesData.topProducts.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell align="right">
                              {product.totalQuantity}
                            </TableCell>
                            <TableCell align="right">
                              ${product.totalSales.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )
      )}
    </Box>
  );
};

export default Reports;