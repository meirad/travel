import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Context';

const Login = () => {
    const navigate = useNavigate(); // Navigation hook
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:6996/auth/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            login({ token, id: user.id }); // Update AuthContext with user details

            setSuccess('Login successful!');
            setTimeout(() => {
                navigate('/'); // Redirect to home after successful login
                window.location.reload(); // Refresh the page
            }, 1000);  // Allow time for success message before refreshing
        } catch (err) {
            // Ensure that the error is a string
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            setError(errorMessage); // Set the error message to be a string
        }
    };

    return (
        <Grid
            container
            sx={{
                minHeight: '100vh',
                backgroundImage: 'url(https://source.unsplash.com/random/1920x1080?nature)', // Example background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Grid item xs={11} sm={8} md={4}>
                <Paper
                    elevation={10}
                    sx={{
                        padding: 4,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparent white
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: '#007BFF',
                                '&:hover': { backgroundColor: '#0056b3' },
                            }}
                        >
                            Login
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Link to="/signup">Don't have an account? Sign up</Link>
                        </Box>
                        {error && (
                            <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography variant="body2" color="success.main" align="center" sx={{ mt: 2 }}>
                                {success}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
