import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Container, Typography, Card, CardContent, Button, Box, Modal, TextField, CircularProgress, 
    Dialog, DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';

const MyBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // State for the delete dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null); // Store selected booking id

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('userId');

                if (!userId || !token) {
                    setError('User ID or token is missing. Please log in again.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:6996/users/${userId}/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBookings(response.data.bookings || []);
                setError('');
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleEdit = (booking) => {
        setSelectedBooking(booking);
        setFormValues({
            firstName: booking.travelers?.[0]?.name?.firstName || '',
            lastName: booking.travelers?.[0]?.name?.lastName || '',
        });
        setEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedBooking) return;

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!userId || !token) {
                setError('User ID or token is missing. Please log in again.');
                return;
            }

            // Only update the first name and last name
            const updatedBooking = {
                travelers: [
                    {
                        name: {
                            firstName: formValues.firstName,
                            lastName: formValues.lastName,
                        },
                    },
                ],
            };

            const response = await axios.put(
                `http://localhost:6996/users/${userId}/bookings/${selectedBooking._id}`,
                updatedBooking,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                // Update the booking in the list with the new details
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking._id === selectedBooking._id ? response.data.updatedBooking : booking
                    )
                );
                setEditModalOpen(false);
                setSelectedBooking(null);
            }
        } catch (err) {
            console.error('Error updating booking:', err);
            setError('Failed to update booking.');
        }
    };

    const handleCancel = () => {
        setFormValues({}); // Reset form values
        setEditModalOpen(false); // Close the modal without saving
    };

    const handleDelete = async (bookingId) => {
        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!userId || !token) {
                setError('User ID or token is missing. Please log in again.');
                return;
            }

            const response = await axios.delete(`http://localhost:6996/users/${userId}/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
                setOpenDialog(false); // Close dialog after deletion
            }
        } catch (err) {
            console.error('Error deleting booking:', err);
            setError('Failed to delete booking.');
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4, minHeight: '100vh' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Typography variant="h4" gutterBottom>
                My Bookings
            </Typography>

            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <Card
                        key={booking._id}
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 4,
                            backgroundColor: '#f0f8ff',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                align="center"
                                sx={{ color: '#1e88e5', fontWeight: 'bold' }}
                            >
                                Ticket Details
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#333', fontSize: 40 }}>
                                        {booking.origin?.toUpperCase() || 'N/A'}
                                    </Typography>
                                </Box>
                                <FlightIcon sx={{ fontSize: 40, color: '#1e88e5', transform: 'rotate(90deg)' }} />
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#333', fontSize: 40 }}>
                                        {booking.destination?.toUpperCase() || 'N/A'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1">
                                    <strong>Passenger:</strong>{' '}
                                    {booking.travelers?.[0]?.name?.firstName || 'N/A'}{' '}
                                    {booking.travelers?.[0]?.name?.lastName || ''}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Airline:</strong> {booking.airline || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Price:</strong> ${booking.price || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Booking Date:</strong>{' '}
                                    {new Date(booking.bookingDate).toLocaleString() || 'N/A'}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => handleEdit(booking)}
                            >
                                Edit Booking
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={() => {
                                    setSelectedBookingId(booking._id); // Set selected booking ID
                                    setOpenDialog(true); // Open the delete confirmation dialog
                                }}
                            >
                                Delete Booking
                            </Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No bookings found.</Typography>
            )}

            {/* Edit Modal */}
            <Modal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                aria-labelledby="edit-booking-modal"
                aria-describedby="edit-booking-form"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        p: 4,
                        boxShadow: 24,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Edit Booking
                    </Typography>
                    <TextField
                        label="First Name"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={formValues.firstName}
                        onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        sx={{ mt: 2 }}
                        value={formValues.lastName}
                        onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this booking?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDelete(selectedBookingId)}
                        color="secondary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyBooking;
