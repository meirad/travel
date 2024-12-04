import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/Context'; // Adjust the path
import logo from '../img/logo.png'; // Use import statement for the logo image

const Navbarstick = () => {
    const { isLoggedIn, logout, user } = useContext(AuthContext);

    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    const handleSignupClick = () => {
        window.location.href = '/signup';
    };

    const handleProfileClick = () => {
        window.location.href = '/profile';
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#390039' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 10px',
                    alignItems: 'center',
                    minHeight: '40px', // Default min height for mobile view
                    '@media (min-width: 600px)': {
                        minHeight: '41px', // Adjusted min-height for larger screens
                    },
                }}
            >
                {/* Left Side: Logo and Text */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="logo" style={{ width: '25px', height: '25px', marginRight: '8px' }} />
                    <Typography sx={{ fontSize: '14px', color: '#fff' }}>exploreWorld</Typography>
                </Box>

                {/* Right Side: Buttons (Login, Signup, Profile, Logout) */}
                <Box>
                    {!isLoggedIn ? (
                        <>
                            <Button color="inherit" sx={{ fontSize: '10px' }} onClick={handleSignupClick}>
                                Signup
                            </Button>
                            <Button color="inherit" sx={{ fontSize: '10px' }} onClick={handleLoginClick}>
                                Login
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" sx={{ fontSize: '10px' }} onClick={handleProfileClick}>
                                Profile
                            </Button>
                            <Button color="inherit" sx={{ fontSize: '10px' }} onClick={logout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbarstick;
