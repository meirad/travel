import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, Grid, Paper, Link } from '@mui/material';

const Signup = () => {
    const navigate = useNavigate(); // Navigation hook
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        isAdmin: false,  // This should be `isAdmin`, not `isBusiness`
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:6996/auth/signup', formData);

            setSuccess('Signup successful! Redirecting to login...');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                isAdmin: false,  // Reset form after success
            });

            // Redirect to login page after successful signup
            setTimeout(() => {
                navigate('/login');
            }, 1500); // Wait for success message before redirecting

        } catch (err) {
            setError(err.response?.data || 'Signup failed. Please try again.');
            console.error('Error during signup:', err);
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
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Transparent white background for the form
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Sign Up
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.firstName}
                            onChange={handleChange}
                            name="firstName"
                            required
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.lastName}
                            onChange={handleChange}
                            name="lastName"
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            required
                        />
                        <TextField
                            label="Phone"
                            type="tel"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.phone}
                            onChange={handleChange}
                            name="phone"
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                            required
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <input
                                type="checkbox"
                                name="isAdmin"
                                checked={formData.isAdmin}
                                onChange={handleChange}
                                style={{ marginRight: 8 }}
                            />
                            <Typography variant="body2">
                                I am registering as an admin
                            </Typography>
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#007BFF',
                                '&:hover': { backgroundColor: '#0056b3' },
                                padding: '10px',
                            }}
                        >
                            Sign Up
                        </Button>

                        {error && (
                            <Typography variant="body2" color="error" align="center" sx={{ marginTop: 2 }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography variant="body2" color="success.main" align="center" sx={{ marginTop: 2 }}>
                                {success}
                            </Typography>
                        )}
                    </Box>

                    {/* Link to Login page */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <Link href="/login" variant="body2" sx={{ color: '#007BFF', textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Signup;
