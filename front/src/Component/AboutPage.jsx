import React from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); 
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '60px', paddingBottom: '60px', backgroundColor: '#f4f4f4' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '40px' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50' }} gutterBottom>
          About Our Travel Application
        </Typography>
        <Typography variant="h5" sx={{ color: '#34495e', marginBottom: '20px' }}>
          Your one-stop solution for booking and managing trips around the world.
        </Typography>

        <Typography variant="body1" sx={{ color: '#7f8c8d', fontSize: '18px', marginBottom: '30px', lineHeight: '1.6' }}>
          Whether you're looking for a weekend getaway, a long vacation, or a quick business trip, we've got you covered. 
          Our platform makes finding and booking flights easy, convenient, and fast.
        </Typography>
        
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#2c3e50' }}>
          Key Features of Our App:
        </Typography>
        
        {/* Features Grid */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3498db' }}>Search Flights</Typography>
              <Typography variant="body2" sx={{ marginTop: '10px', color: '#7f8c8d' }}>
                Find the best flight options based on your destination, departure date, and preferences.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3498db' }}>Manage Bookings</Typography>
              <Typography variant="body2" sx={{ marginTop: '10px', color: '#7f8c8d' }}>
                View, modify, and cancel your bookings all from your profile dashboard.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '40px', marginBottom: '20px', color: '#2c3e50' }}>
          Why Choose Us?
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d', fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
          We strive to offer you the best value for your money. Our platform brings together multiple airlines and travel agencies to ensure that you have the widest range of options to choose from, all in one place.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{
            width: '200px',
            padding: '10px',
            borderRadius: '8px',
            textTransform: 'none',
            backgroundColor: '#3498db',
            '&:hover': { backgroundColor: '#2980b9' },
          }}
        >
          Go Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default AboutPage;
