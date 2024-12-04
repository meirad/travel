import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            setIsLoggedIn(true);
            setUser({ id: userId, token });
            // Fetch user role from an API or localStorage
            checkIfAdmin(userId);
        }
    }, []);

    const checkIfAdmin = async (userId) => {
        try {
            // Assuming you have an API endpoint to check user role
            const response = await axios.get(`http://localhost:6996/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            if (response.data.isAdmin === true) {
                setIsAdmin(true);
                
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        setIsAdmin(userData.is === 'admin');
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('isAdmin', userData.isAdmin); // Store the user role
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
