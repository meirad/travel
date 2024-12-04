import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { airlineNames } from '../../Data/airlineData';
import { airportNames } from '../../Data/airportData';
import axios from 'axios';
import { useSearch } from '../../context/SearchContext'; 

const parseDuration = (duration) => {
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const hours = hoursMatch ? `${hoursMatch[1]} hours` : '';
  const minutes = minutesMatch ? `${minutesMatch[1]} minutes` : '';
  return `${hours} ${minutes}`.trim();
};

const FlightResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const offers = location.state?.offers || [];
  const [savedFlights, setSavedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch(); 
  const [filteredFlights, setFilteredFlights] = useState(offers);  

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

    // Filter the offers based on searchQuery
    const filtered = offers.filter((offer) => {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        offer.price.total.toString().toLowerCase().includes(lowerQuery) ||
        (offer.validatingAirlineCodes[0] && airlineNames[offer.validatingAirlineCodes[0]]?.toLowerCase().includes(lowerQuery)) ||
        (offer.itineraries[0].segments[0].departure.iataCode && airportNames[offer.itineraries[0].segments[0].departure.iataCode]?.toLowerCase().includes(lowerQuery)) ||
        (offer.itineraries[0].segments[0].arrival.iataCode && airportNames[offer.itineraries[0].segments[0].arrival.iataCode]?.toLowerCase().includes(lowerQuery))
      );
    });
    setFilteredFlights(filtered);  

    fetchSavedFlights();
  }, [searchQuery, offers]);  

  const handleSelectFlight = (flight) => {
    navigate(`/flight/${flight.id}`, { state: { flight } });
  };

  const handleSaveForLater = async (flight) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('You need to be logged in to save flights.');
        return;
      }

      const flightDetails = {
        id: flight.id,
        instantTicketingRequired: flight.instantTicketingRequired,
        isUpsellOffer: flight.isUpsellOffer,
        itineraries: flight.itineraries,
        lastTicketingDate: flight.lastTicketingDate,
        lastTicketingDateTime: flight.lastTicketingDateTime,
        nonHomogeneous: flight.nonHomogeneous,
        numberOfBookableSeats: flight.numberOfBookableSeats,
        oneWay: flight.oneWay,
        price: flight.price,
        pricingOptions: flight.pricingOptions,
        source: flight.source,
        travelerPricings: flight.travelerPricings,
        type: flight.type,
        validatingAirlineCodes: flight.validatingAirlineCodes
      };

      await axios.post('http://localhost:6996/flights/save-flight', { userId, flightDetails }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setSavedFlights(prev => [...prev, { flightDetails }]); 
      alert('Flight saved for later!');
    } catch (error) {
      console.error('Error saving flight:', error);
      alert('Failed to save flight.');
    }
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

  const isSaved = (flightId) => savedFlights.some(savedFlight => savedFlight.flightDetails.id === flightId);

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Available Flight Offers</Typography>

      {/* Display filtered flight offers */}
      {filteredFlights.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {filteredFlights.map((offer, index) => (
            <Card key={index} sx={{ width: '100%', maxWidth: 350, boxShadow: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Price: ${offer.price.total}
                </Typography>
                <Typography variant="body2">
                  <strong>Airline:</strong> {airlineNames[offer.validatingAirlineCodes[0]] || offer.validatingAirlineCodes[0]}
                </Typography>
                <Typography variant="body2">
                  <strong>Departure:</strong> {airportNames[offer.itineraries[0].segments[0].departure.iataCode] || offer.itineraries[0].segments[0].departure.iataCode}
                </Typography>
                <Typography variant="body2">
                  <strong>Arrival:</strong> {airportNames[offer.itineraries[0].segments[0].arrival.iataCode] || offer.itineraries[0].segments[0].arrival.iataCode}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {parseDuration(offer.itineraries[0].duration)}
                </Typography>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSelectFlight(offer)}
                  sx={{ mt: 2 }}
                >
                  Select
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleSaveForLater(offer)}
                  disabled={isSaved(offer.id)} // Disable button if the flight is already saved
                >
                  {isSaved(offer.id) ? 'Saved' : 'Save for Later'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No flight offers available for your search.
        </Typography>
      )}
    </Box>
  );
};

export default FlightResultsPage;
