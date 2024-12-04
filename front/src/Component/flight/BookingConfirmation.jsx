import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';

const BookingConfirmation = () => {
    const location = useLocation();
    const { bookingDetails } = location.state || {};

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backgroundColor: '#f9f9f9',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Booking Confirmed!
            </Typography>
            {bookingDetails && (
                <>
                    <Typography variant="body1" gutterBottom>
                    Booking ID: {bookingDetails.flightBooking._id}
                    </Typography>
                    <Typography>
                        first name : {bookingDetails.flightBooking.travelers[0].name.firstName}
                    </Typography>
                    <Typography>
                        last name : {bookingDetails.flightBooking.travelers[0].name.lastName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Airline: {bookingDetails.flightBooking.airline}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Origin: {bookingDetails.flightBooking.origin}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Destination: {bookingDetails.flightBooking.destination}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Departure Date: {new Date(bookingDetails.flightBooking.departureDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Price: ${bookingDetails.flightBooking.price}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = '/'}
            >
                Return to Homepage
            </Button>
        </Box>
    );
};

export default BookingConfirmation;