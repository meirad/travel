import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    Divider,
    Alert,
} from '@mui/material';
import { airlineNames } from '../../Data/airlineData';
import { airportNames } from '../../Data/airportData';

const parseDuration = (duration) => {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const hours = hoursMatch ? `${hoursMatch[1]} hours` : '';
    const minutes = minutesMatch ? `${minutesMatch[1]} minutes` : '';
    return `${hours} ${minutes}`.trim();
};

const FlightBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {};

    const [travelerInfo, setTravelerInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        email: '',
        passportNumber: '',
        phoneNumber: '',
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const [bookingResponse, setBookingResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!flight) {
            navigate('/');
        }
    }, [flight, navigate]);

    const handleTravelerChange = (e) => {
        const { name, value } = e.target;

        // Set the value without any validation for now
        setTravelerInfo({ ...travelerInfo, [name]: value });
        setError(null); // Clear any previous errors
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        // Validate phone number on blur
        if (name === 'phoneNumber' && !/^\+972\d{8}$/.test(value)) {
            setError('Please enter a valid Israeli phone number.');
        } else if (name === 'firstName' && value.length < 2) {
            setError('First name must be at least 2 characters long.');
        } else if (name === 'lastName' && value.length < 2) {
            setError('Last name must be at least 2 characters long.');
        } else {
            setError(null); // Clear error if valid
        }
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo({ ...paymentInfo, [name]: value });
    };

    const handleBooking = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            setError('User is not logged in. Please log in to book a flight.');
            return;
        }

        // Validate Credit Card
        if (!/^\d{13,19}$/.test(paymentInfo.cardNumber)) {
            setError('Invalid card number. It should be between 13 and 19 digits.');
            return;
        }

        // Validate CVV
        if (!/^\d{3}$/.test(paymentInfo.cvv)) {
            setError('CVV should be exactly 3 digits.');
            return;
        }

        const origin = flight.itineraries[0].segments[0].departure.iataCode;
        const destination = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode;
        const departureDate = flight.itineraries[0].segments[0].departure.at;
        const price = flight.price.total;
        const airline = flight.validatingAirlineCodes[0];

        const bookingData = {
            userId,
            travelerInfo: [{
                name: {
                    firstName: travelerInfo.firstName,
                    lastName: travelerInfo.lastName,
                },
                dateOfBirth: travelerInfo.dateOfBirth,
                emailAddress: travelerInfo.email,
                phones: [{
                    deviceType: 'mobile',
                    countryCallingCode: '+972',
                    number: travelerInfo.phoneNumber,
                }],
                documents: [{
                    documentType: 'passport',
                    number: travelerInfo.passportNumber,
                    expiryDate: '2024-12-31',
                    issuanceCountry: 'Israel',
                    nationality: 'Israeli',
                    holder: true,
                }],
            }],
            paymentInfo,
            origin,
            destination,
            departureDate,
            price,
            airline,
        };

        try {
            const response = await axios.post(`http://localhost:6996/book-flight/${flight.id}`, bookingData);
            setBookingResponse(response.data);
            navigate('/booking-confirmation', { state: { bookingDetails: response.data } });
        } catch (err) {
            const message = err.response?.data?.error || 'Failed to book flight. Please try again.';
            setError(message);
            setBookingResponse(null);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: '#ececec',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
            }}
        >
            <Box
                sx={{
                    maxWidth: '900px',
                    width: '100%',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Confirm Your Booking
                </Typography>

                {flight && (
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Price: ${flight.price.total}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Airline:</strong> {airlineNames[flight.validatingAirlineCodes[0]] || flight.validatingAirlineCodes[0]}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1">
                                <strong>Departure:</strong> {airportNames[flight.itineraries[0].segments[0].departure.iataCode] || flight.itineraries[0].segments[0].departure.iataCode}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Arrival:</strong> {airportNames[flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode] || flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Duration:</strong> {parseDuration(flight.itineraries[0].duration)}
                            </Typography>
                        </CardContent>
                    </Card>
                )}

                <Typography variant="h5" gutterBottom>
                    Traveler Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={travelerInfo.firstName}
                            onChange={handleTravelerChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            helperText={error && error.includes('First name') ? error : ''}
                            error={error && error.includes('First name')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={travelerInfo.lastName}
                            onChange={handleTravelerChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            helperText={error && error.includes('Last name') ? error : ''}
                            error={error && error.includes('Last name')}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            type="date"
                            name="dateOfBirth"
                            value={travelerInfo.dateOfBirth}
                            onChange={handleTravelerChange}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            name="email"
                            value={travelerInfo.email}
                            onChange={handleTravelerChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={travelerInfo.phoneNumber}
                            onChange={handleTravelerChange}
                            onBlur={handleBlur}
                            variant="outlined"
                            helperText={error || "Enter a valid Israeli phone number."}
                            error={!!error}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Passport Number"
                            name="passportNumber"
                            value={travelerInfo.passportNumber}
                            onChange={handleTravelerChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5" gutterBottom>
                    Payment Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            fullWidth
                            label="Expiry Date"
                            type="month"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            fullWidth
                            label="CVV"
                            type="password"
                            name="cvv"
                            value={paymentInfo.cvv}
                            onChange={handlePaymentChange}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleBooking}
                    disabled={Object.values(travelerInfo).some((value) => !value) || 
                        Object.values(paymentInfo).some((value) => !value)}
                    sx={{
                        padding: '10px',
                        opacity: Object.values(travelerInfo).some((value) => !value) || 
                            Object.values(paymentInfo).some((value) => !value) ? 0.6 : 1,
                        pointerEvents: Object.values(travelerInfo).some((value) => !value) || 
                                    Object.values(paymentInfo).some((value) => !value) ? 'none' : 'auto',
                    }}
                >
                    Confirm Booking
                </Button>
            </Box>
        </Box>
    );
};

export default FlightBooking;
