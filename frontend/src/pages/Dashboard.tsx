import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { RootState } from '../features/store';

interface SalesSummary {
  totalSales: {
    totalAmount: number;
    count: number;
  };
  salesByPaymentMethod: {
    _id: string;
    totalAmount: number;
    count: number;
  }[];
}

const Dashboard = () => {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user) {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          // Fetch sales summary
          const salesResponse = await axios.get(
            'http://localhost:12001/api/orders/sales-summary?period=week',
            config
          );
          setSalesSummary(salesResponse.data);

          // Fetch low stock products
          const productsResponse = await axios.get(
            'http://localhost:12001/api/products',
            config
          );
          const lowStock = productsResponse.data.filter(
            (product: any) => product.stockQuantity < 10
          );
          setLowStockProducts(lowStock);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
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
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Sales Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Summary (Last 7 Days)
            </Typography>
            {salesSummary ? (
              <Box>
                <Card sx={{ mb: 2, bgcolor: '#e3f2fd' }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      ${salesSummary.totalSales.totalAmount.toFixed(2)}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Sales ({salesSummary.totalSales.count} orders)
                    </Typography>
                  </CardContent>
                </Card>

                <Typography variant="subtitle1" gutterBottom>
                  Sales by Payment Method
                </Typography>
                <Grid container spacing={2}>
                  {salesSummary.salesByPaymentMethod.map((method) => (
                    <Grid item xs={6} key={method._id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" component="div">
                            ${method.totalAmount.toFixed(2)}
                          </Typography>
                          <Typography color="text.secondary">
                            {method._id.charAt(0).toUpperCase() +
                              method._id.slice(1).replace('_', ' ')}{' '}
                            ({method.count} orders)
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Typography>No sales data available</Typography>
            )}
          </Paper>
        </Grid>

        {/* Low Stock Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Products
            </Typography>
            {lowStockProducts.length > 0 ? (
              <Grid container spacing={2}>
                {lowStockProducts.map((product: any) => (
                  <Grid item xs={12} key={product._id}>
                    <Card sx={{ bgcolor: '#ffebee' }}>
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography color="error">
                          Stock: {product.stockQuantity} units
                        </Typography>
                        <Typography>
                          Category: {product.category.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No low stock products</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;