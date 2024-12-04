import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Typography, Paper, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';  // Import the useSearch hook

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const { searchQuery } = useSearch();  // Access searchQuery from context

    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const expiration = decoded.exp * 1000; 
        const currentTime = Date.now();
        return currentTime >= expiration;  
    };

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('authToken');
            if (!token || isTokenExpired(token)) {
                alert('Session expired. Please login again.');
                navigate('/login'); 
                return;
            }

            try {
                const response = await axios.get('http://localhost:6996/flights/bookings', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    // Filter bookings based on search query from context
    const filteredBookings = bookings.filter((booking) =>
        (booking._id && booking._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (booking.origin && booking.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (booking.destination && booking.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (booking.departureDate && new Date(booking.departureDate).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleDeleteBooking = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:6996/flights/bookings/${selectedBookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookings(bookings.filter((booking) => booking._id !== selectedBookingId));
            setOpenDialog(false);
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError('Failed to delete booking.');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" sx={{ mb: 3 }}>All Bookings</Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="h6">Booking ID</Typography></TableCell>
                            <TableCell><Typography variant="h6">Origin</Typography></TableCell>
                            <TableCell><Typography variant="h6">Destination</Typography></TableCell>
                            <TableCell><Typography variant="h6">Departure Date</Typography></TableCell>
                            <TableCell><Typography variant="h6">Price</Typography></TableCell>
                            <TableCell><Typography variant="h6">Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBookings.map((booking) => (
                            <TableRow key={booking._id}>
                                <TableCell>{booking._id}</TableCell>
                                <TableCell>{booking.origin}</TableCell>
                                <TableCell>{booking.destination}</TableCell>
                                <TableCell>{new Date(booking.departureDate).toLocaleString()}</TableCell>
                                <TableCell>${booking.price}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => {
                                            setSelectedBookingId(booking._id);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this booking?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteBooking} color="secondary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AllBookings;
