import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { airlineNames } from '../../Data/airlineData';
import { airportNames } from '../../Data/airportData';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Divider,
    Grid,
    Paper,
    Container,
} from '@mui/material';

const parseDuration = (duration) => {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    const hours = hoursMatch ? `${hoursMatch[1]} hours` : '';
    const minutes = minutesMatch ? `${minutesMatch[1]} minutes` : '';
    return `${hours} ${minutes}`.trim();
};

const FlightDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight } = location.state || {}; 

    if (!flight || !flight.itineraries || flight.itineraries.length === 0) {
        return <Typography variant="h6" color="error">Flight details are unavailable.</Typography>;
    }

    const firstSegment = flight.itineraries[0].segments[0];
    const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];

    const handleBookFlight = () => {
        navigate('/booking', { state: { flight } });
    };

    return (
        <Box
            sx={{
                backgroundColor: '#ececec',
                minHeight: '100vh',
                padding: '20px 10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
        >
            <Container maxWidth="md">
                <Typography variant="h4" align="center" gutterBottom>
                    Flight Details
                </Typography>

                <Card sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Price: ${flight.price.total}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                            <strong>Airline:</strong> {airlineNames[flight.validatingAirlineCodes[0]] || flight.validatingAirlineCodes[0]}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Flight ID:</strong> {flight.id}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Initial Departure:</strong>{' '}
                            {airportNames[firstSegment.departure.iataCode] || firstSegment.departure.iataCode} at{' '}
                            {new Date(firstSegment.departure.at).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Final Arrival:</strong>{' '}
                            {airportNames[lastSegment.arrival.iataCode] || lastSegment.arrival.iataCode} at{' '}
                            {new Date(lastSegment.arrival.at).toLocaleString()}
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="h5" gutterBottom>
                    Itinerary
                </Typography>
                <Grid container spacing={3}>
                    {flight.itineraries[0].segments.map((segment, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: '20px',
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    Flight {index + 1}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body1">
                                    <strong>Departure:</strong>{' '}
                                    {airportNames[segment.departure.iataCode] || segment.departure.iataCode} at{' '}
                                    {new Date(segment.departure.at).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Arrival:</strong>{' '}
                                    {airportNames[segment.arrival.iataCode] || segment.arrival.iataCode} at{' '}
                                    {new Date(segment.arrival.at).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Carrier:</strong> {airlineNames[segment.carrierCode] || segment.carrierCode}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Flight Number:</strong> {segment.number}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Duration:</strong> {parseDuration(segment.duration)}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ textAlign: 'center', marginTop: '30px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBookFlight}
                        sx={{
                            padding: '10px 20px',
                            borderRadius: '5px',
                            backgroundColor: '#7b1fa2',
                            '&:hover': { backgroundColor: '#7b1fa2' },
                        }}
                    >
                        Book Flight
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default FlightDetails;
