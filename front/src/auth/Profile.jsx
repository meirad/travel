import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Box,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert,
    Avatar,
} from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/Context';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { logout } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [profileImage, setProfileImage] = useState(null); // For profile image

    const navigate = useNavigate();  // Get navigate function from useNavigate hook

    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError('User ID is missing. Please log in again.');
                return;
            }

            const response = await axios.get(`http://localhost:6996/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUserInfo(response.data);
        } catch (err) {
            console.error('Error fetching user info:', err);
            setError('Failed to fetch user information.');
        }  
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleEditOpen = () => {
        if (userInfo) {
            setEditData({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phone: userInfo.phone || '',
            });
        }
        setEditMode(true);
    };

    const handleEditClose = () => {
        setEditMode(false);
        setError('');
        setSuccessMessage('');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError('User ID is missing. Please log in again.');
                return;
            }

            const response = await axios.put(
                `http://localhost:6996/users/${userId}`,
                editData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUserInfo(response.data);
            setSuccessMessage('Profile updated successfully!');
            setEditMode(false);
        } catch (err) {
            console.error('Error updating user info:', err);
            setError('Failed to update user information.');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result); // Set the uploaded image as base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        logout();  // Call logout function from AuthContext
        navigate('/login');  // Redirect to login page after logout
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                My Profile
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: 600 }}>
                    {error}
                </Alert>
            )}

            {userInfo ? (
                <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 2, textAlign: 'center' }}>
                    <CardContent>
                        {/* Profile Image */}
                        <Box sx={{ position: 'relative', mb: 3 }}>
                            <Avatar
                                src={profileImage || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: '0 auto',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                }}
                            />
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: -10,
                                    right: 'calc(50% - 30px)',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#005bb5' },
                                }}
                            >
                                Upload
                                <input type="file" hidden onChange={handleImageUpload} />
                            </Button>
                        </Box>
                        {/* User Information */}
                        <Typography variant="h6" gutterBottom>
                            Welcome, {userInfo.firstName} {userInfo.lastName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Email:</strong> {userInfo.email}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Phone:</strong> {userInfo.phone || 'Not provided'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Member Since:</strong> {new Date(userInfo.createdAt).toLocaleDateString()}
                        </Typography>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEditOpen}
                                sx={{ flex: 1, marginRight: 1 }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleLogout}  // Handle logout
                                sx={{ flex: 1, marginLeft: 1 }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1">Loading your profile...</Typography>
            )}

            {/* Edit Profile Dialog */}
            <Dialog open={editMode} onClose={handleEditClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={editData.firstName}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={editData.lastName}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;
