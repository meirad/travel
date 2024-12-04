import React, { useState, useContext } from 'react';
import '../styles/HomePage.css'; 
import backgroundImage from '../img/mainimg.jpg'; 
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FlightOffers from './flight/FlightOffers';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/Context';

const HomePage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const [visibleComponent, setVisibleComponent] = useState(null); 
    const navigate = useNavigate();

    const handleFlightClick = () => {
        if (isLoggedIn) {
            setVisibleComponent('flights');
        } else {
            navigate('/login'); 
        }
    };

    return (
        <div className="homepage-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <h3 style={{ fontSize: '50px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Looking for something amazing?
        </h3>
        <h1 style={{ fontSize: '67px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Find the best trip
        </h1>
        <p style={{ fontSize: '40px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Book your next trip with us
        </p>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mt: 3,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: 'white',
                        color: 'black',
                        width: '250px',
                        height: '50px',
                        boxShadow: 'none',
                        borderRadius: '4',
                        '&:hover': { backgroundColor: 'black', color: 'white' },
                    }}
                    onClick={handleFlightClick} // Call handleFlightClick
                >
                    Flights
                </Button>
            </Box>

            <div style={{ marginTop: '20px' }}>
                {visibleComponent === 'flights' && <FlightOffers />}
            </div>
        </div>
    );
};

export default HomePage;
