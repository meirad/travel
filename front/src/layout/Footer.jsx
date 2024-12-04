import React from 'react';
import { Box, Typography, Grid, Link, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import logo from '../img/logo.png'; 

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#390039', // Dark purple background color
                color: 'white', // White text color
                py: 6, // Padding for top and bottom (increased for more space)
                textAlign: 'center',
                position: 'relative',
                bottom: 0,
                width: '100%',
            }}
        >
            {/* Logo Section */}
            <Box sx={{ mb: 4 }}>
                <img src={logo} alt="TravelBook Logo" style={{ width: '150px', height: 'auto' }} />
            </Box>

            {/* Footer Content */}
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#FFCCFF', fontWeight: 600 }}>
                        About Us
                    </Typography>
                    <Typography variant="body2">
                        We are dedicated to providing you the best travel booking experience. Explore the world with us!
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#FFCCFF', fontWeight: 600 }}>
                        Quick Links
                    </Typography>
                    <Box>
                        <Link href="/my-bookings" color="inherit" underline="hover" sx={{ display: 'block' }}>
                            My Booking
                        </Link>
                        <Link href="/contact" color="inherit" underline="hover" sx={{ display: 'block' }}>
                            Contact Us
                        </Link>
                        <Link href="/about" color="inherit" underline="hover" sx={{ display: 'block' }}>
                            About Us
                        </Link>

                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#FFCCFF', fontWeight: 600 }}>
                        Contact
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <EmailIcon sx={{ mr: 1 }} /> support@travelbook.com
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1 }} /> +972-50-123-4567
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1 }} /> Tel Aviv, Israel
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: '#FFCCFF' }} />

            <Typography variant="body2">
                &copy; {new Date().getFullYear()} TravelBook. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
