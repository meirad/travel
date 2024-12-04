import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Component/HomePage';
import FlightBooking from './Component/flight/FlightBooking';
import FlightDetails from './Component/flight/FlightDetails';
import FlightOffers from './Component/flight/FlightOffers';
import Login from './auth/Login';
import Signup from './auth/Signup';
import BookingConfirmation from './Component/flight/BookingConfirmation';
import Profile from './auth/Profile';
import UserBookings from './Component/booking/MyBooking';
import HomeWithTestimonials from './HomeWithTestimonials';
import AllBookings from './Component/booking/AllBookings';
import FlightResultsPage from './Component/flight/FlightResultsPage';
import Contact from './Component/Contact';
import AboutPage from './Component/AboutPage';
import SavedFlightsPage from './Component/flight/SavedFlightsPage';

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
      <Router>
        <div style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={<HomeWithTestimonials />} />
            <Route path="/flight-offers" element={<FlightOffers />} />
            <Route path="/flight/:id" element={<FlightDetails />} />
            <Route path="/booking" element={<FlightBooking />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} />} />
            <Route path="/my-bookings" element={<UserBookings isLoggedIn={isLoggedIn} />} />
            <Route path="/bookings" element={<AllBookings />} />
            <Route path="/flight-results" element={<FlightResultsPage />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/saved-flights" element={<SavedFlightsPage />} />
          </Routes>
        </div>
      </Router>
  );
};

export default AppRoutes;
