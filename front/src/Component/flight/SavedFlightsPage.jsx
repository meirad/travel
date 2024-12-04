import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import axios from 'axios';
import { airlineNames } from '../../Data/airlineData';
import { airportNames } from '../../Data/airportData';
import { useSearch } from '../../context/SearchContext';

const parseDuration = (duration) => {
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const hours = hoursMatch ? `${hoursMatch[1]} hours` : '';
  const minutes = minutesMatch ? `${minutesMatch[1]} minutes` : '';
  return `${hours} ${minutes}`.trim();
};

const SavedFlightsPage = () => {
  const [savedFlights, setSavedFlights] = useState([]);
  const { searchQuery } = useSearch();  

  useEffect(() => {
    const fetchSavedFlights = async () => {
      try {
        const response = await axios.get('http://localhost:6996/flights/saved-flights', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setSavedFlights(response.data);
      } catch (error) {
        console.error('Error fetching saved flights:', error);
      }
    };
    fetchSavedFlights();
  }, []);

  const filteredFlights = savedFlights.filter(flight =>
    flight.flightDetails.price.total.toString().includes(searchQuery) ||
    flight.flightDetails.validatingAirlineCodes.some(code => code.includes(searchQuery)) ||
    airportNames[flight.flightDetails.itineraries[0].segments[0].departure.iataCode]?.includes(searchQuery) ||
    airportNames[flight.flightDetails.itineraries[0].segments[0].arrival.iataCode]?.includes(searchQuery)
  );

  const handleSelectFlight = (flight) => {
    window.location.href = `/flight/${flight.id}`;  
  };

  const handleRemoveFlight = async (flightId) => {
    try {
      await axios.delete(`http://localhost:6996/flights/saved-flights/${flightId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setSavedFlights(prev => prev.filter(flight => flight._id !== flightId));
    } catch (error) {
      console.error('Error removing saved flight:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>Saved Flights</Typography>

      {filteredFlights.length > 0 ? (
        <Grid container spacing={2}>
          {filteredFlights.map((flight, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 3, borderRadius: '12px', transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Price: ${flight.flightDetails.price.total}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Airline:</strong> {airlineNames[flight.flightDetails.validatingAirlineCodes[0]] || flight.flightDetails.validatingAirlineCodes[0]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Departure:</strong> {airportNames[flight.flightDetails.itineraries[0].segments[0].departure.iataCode] || flight.flightDetails.itineraries[0].segments[0].departure.iataCode}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Arrival:</strong> {airportNames[flight.flightDetails.itineraries[0].segments[0].arrival.iataCode] || flight.flightDetails.itineraries[0].segments[0].arrival.iataCode}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Duration:</strong> {parseDuration(flight.flightDetails.itineraries[0].duration)}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSelectFlight(flight.flightDetails)}
                      sx={{ width: '48%' }}
                    >
                      Select
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveFlight(flight._id)}
                      sx={{ width: '48%' }}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          No saved flights available for your search.
        </Typography>
      )}
    </Box>
  );
};

export default SavedFlightsPage;
