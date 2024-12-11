import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useSearch } from '../../context/SearchContext'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { airlineNames } from '../../Data/airlineData';
import { airportNames } from '../../Data/airportData';

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
  const [filteredFlights, setFilteredFlights] = useState(savedFlights);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedFlights = async () => {
      try {
        const response = await axios.get('http://localhost:6996/flights/saved-flights', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setSavedFlights(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved flights:', error);
        setLoading(false);
      }
    };

    // Filter the saved flights based on the search query
    const filtered = savedFlights.filter((flight) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        flight.flightDetails.price.total.toString().toLowerCase().includes(lowerQuery) ||
        (flight.flightDetails.validatingAirlineCodes[0] && airlineNames[flight.flightDetails.validatingAirlineCodes[0]]?.toLowerCase().includes(lowerQuery)) ||
        (flight.flightDetails.itineraries[0].segments[0].departure.iataCode && airportNames[flight.flightDetails.itineraries[0].segments[0].departure.iataCode]?.toLowerCase().includes(lowerQuery)) ||
        (flight.flightDetails.itineraries[0].segments[0].arrival.iataCode && airportNames[flight.flightDetails.itineraries[0].segments[0].arrival.iataCode]?.toLowerCase().includes(lowerQuery))
      );
    });
    setFilteredFlights(filtered);

    fetchSavedFlights();
  }, [searchQuery, savedFlights]);

  const handleSelectFlight = (flight) => {
    navigate(`/flight/${flight.id}`, { state: { flight } });
  };

  const handleRemoveFlight = async (flightId) => {
    try {
      await axios.delete(`http://localhost:6996/flights/saved-flights/${flightId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setSavedFlights(prev => prev.filter(flight => flight.flightDetails.id !== flightId)); 
      alert('Flight removed from saved list!');
    } catch (error) {
      console.error('Error removing saved flight:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Saved Flights</Typography>

      {/* Display filtered saved flights */}
      {filteredFlights.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filteredFlights.map((flight, index) => (
            <Card key={index} sx={{ width: '100%', maxWidth: 350, boxShadow: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Price: ${flight.flightDetails.price.total}
                </Typography>
                <Typography variant="body2">
                  <strong>Airline:</strong> {airlineNames[flight.flightDetails.validatingAirlineCodes[0]] || flight.flightDetails.validatingAirlineCodes[0]}
                </Typography>
                <Typography variant="body2">
                  <strong>Departure:</strong> {airportNames[flight.flightDetails.itineraries[0].segments[0].departure.iataCode] || flight.flightDetails.itineraries[0].segments[0].departure.iataCode}
                </Typography>
                <Typography variant="body2">
                  <strong>Arrival:</strong> {airportNames[flight.flightDetails.itineraries[0].segments[0].arrival.iataCode] || flight.flightDetails.itineraries[0].segments[0].arrival.iataCode}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {parseDuration(flight.flightDetails.itineraries[0].duration)}
                </Typography>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSelectFlight(flight.flightDetails)}
                  sx={{ mt: 2 }}
                >
                  Select
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleRemoveFlight(flight.flightDetails.id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No saved flights available for your search.
        </Typography>
      )}
    </Box>
  );
};

export default SavedFlightsPage;
