import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';
import { airportNames } from '../../Data/airportData';

const FlightOffers = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');  
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const handleOriginChange = (e) => {
    const input = e.target.value.toUpperCase();
    setOrigin(input);
    setOriginSuggestions(
      Object.keys(airportNames).filter((iataCode) =>
        iataCode.startsWith(input)
      )
    );
  };

  const handleDestinationChange = (e) => {
    const input = e.target.value.toUpperCase();
    setDestination(input);
    setDestinationSuggestions(
      Object.keys(airportNames).filter((iataCode) =>
        iataCode.startsWith(input)
      )
    );
  };

  const handleOriginSelect = (iataCode) => {
    setOrigin(iataCode);
    setOriginSuggestions([]);
  };

  const handleDestinationSelect = (iataCode) => {
    setDestination(iataCode);
    setDestinationSuggestions([]);
  };

  const fetchFlightOffers = async () => {
    if (!origin || !destination || !departureDate) {
      setFormError('Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:6996/flight-offers', {
        params: { origin, destination, departureDate },
      });
      navigate('/flight-results', { state: { offers: response.data } });
    } catch (err) {
      console.error('Error fetching flight offers:', err);
      setError('Failed to fetch flight offers. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
        {/* Origin Input */}
        <Grid item xs={12} sm={4} md={3}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
              label="Origin (e.g., JFK)"
              variant="outlined"
              value={origin}
              onChange={handleOriginChange}
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontSize: '1.2rem',
                  height: '20px',
                  padding: '12px',
                },
                mb: 2,
              }}
            />
            {originSuggestions.length > 0 && (
              <List
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  color: 'black',
                  zIndex: 1000,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                }}
              >
                {originSuggestions.map((iataCode) => (
                  <ListItem
                    button
                    key={iataCode}
                    onClick={() => handleOriginSelect(iataCode)}
                  >
                    <ListItemText primary={`${iataCode} - ${airportNames[iataCode]}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Grid>

        {/* Destination Input */}
        <Grid item xs={12} sm={4} md={3}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
              label="Destination (e.g., LAX)"
              variant="outlined"
              value={destination}
              onChange={handleDestinationChange}
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontSize: '1.2rem',
                  height: '20px',
                  padding: '12px',
                },
                mb: 2,
              }}
            />
            {destinationSuggestions.length > 0 && (
              <List
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: 200,
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  color: 'black',
                  zIndex: 1000,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                }}
              >
                {destinationSuggestions.map((iataCode) => (
                  <ListItem
                    button
                    key={iataCode}
                    onClick={() => handleDestinationSelect(iataCode)}
                  >
                    <ListItemText primary={`${iataCode} - ${airportNames[iataCode]}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Grid>

        {/* Departure Date */}
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            type="date"
            label="Departure Date"
            InputLabelProps={{ shrink: true }}
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            size="small"
            fullWidth
            min={today} // Set minimum date to today
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiInputBase-input': {
                color: 'white',
                fontSize: '1.2rem',
                height: '20px',
                padding: '12px',
              },
              mb: 2,
            }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchFlightOffers}
        disabled={loading}
        sx={{
          mb: 2,
          fontSize: '1rem',
          height: '50px',
          width: '200px',
          backgroundColor: 'white',
          color: 'black',
          '&:hover': { backgroundColor: 'black', color: 'white' },
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Search'}
      </Button>

      {formError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {formError}
        </Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FlightOffers;
