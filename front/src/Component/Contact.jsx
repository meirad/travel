import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Alert } from '@mui/material';
import ContactImage from '../img/contact-1.png'; // Adjust path as needed
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!formData.name || !formData.email || !formData.message) {
            setError(true);
            setTimeout(() => setError(false), 3000);
            return;
        }

        // Send the form data to the server
        try {
            const response = await axios.post('http://localhost:6996/contact', formData);
            
            if (response.status === 200) {
                setSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(${ContactImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '20px',
                position: 'relative',
                marginTop: 5,
            }}
        >
            <Box
                sx={{
                    maxWidth: '600px',
                    width: '100%',
                    background: 'linear-gradient(to top right, #fa9e1b, #8d4fff)', // New gradient
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                }}
            >
                {/* Contact Us Section */}
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{
                        fontSize: "30px", 
                        fontWeight: "700",
                        color: "#FFFFFF",
                        textTransform: "uppercase" 
                    }}
                >
                    Contact Us
                </Typography>
                <Typography
                    variant="body1"
                    align="center"
                    sx={{
                        mb: 4,
                        color: 'white',
                    }}
                >
                    We'd love to hear from you! Fill out the form below, and we'll get back to you as soon as possible.
                </Typography>

                {submitted && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Thank you for contacting us! We'll respond soon.
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Please fill out all fields before submitting.
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'white' },
                                        '&:hover fieldset': { borderColor: '#fa9e1b' },
                                        '&.Mui-focused fieldset': { borderColor: '#8d4fff' },
                                    },
                                    input: { color: 'white' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'white' },
                                        '&:hover fieldset': { borderColor: '#fa9e1b' },
                                        '&.Mui-focused fieldset': { borderColor: '#8d4fff' },
                                    },
                                    input: { color: 'white' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                name="message"
                                multiline
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'white' },
                                        '&:hover fieldset': { borderColor: '#fa9e1b' },
                                        '&.Mui-focused fieldset': { borderColor: '#8d4fff' },
                                    },
                                    input: { color: 'white' },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            padding: '10px',
                            background: "#31124b",
                            color: 'white',
                            '&:hover': {
                                background: "#31124b",
                            },
                        }}
                    >
                        Send Message
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default Contact;
