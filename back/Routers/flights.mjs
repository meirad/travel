import express from "express";
import { Flight } from '../models/BookingSchema.mjs';
import mongoose from 'mongoose';
import { guard } from "../guard.mjs";


const router = express.Router();


// Fetch all bookings by all users and show the users that 
router.get('/bookings', guard, async (req, res) => {
    try {
        const bookings = await Flight.find();
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Error fetching bookings' });
    }
});

// delete booking by bookingId
router.delete('/bookings/:bookingId', guard, async (req, res) => {
    try {
        const { bookingId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ error: 'Invalid bookingId format' });
        }

        const booking = await Flight.findByIdAndDelete(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or already deleted.' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default function flightRoutes(app, amadeus) {

    app.get('/flight-offers', async (req, res) => {
        const { origin, destination, departureDate } = req.query;

        // Validate query parameters
        if (!origin || !destination || !departureDate) {
            return res.status(400).json({
                error: "Missing required query parameters: origin, destination, or departureDate",
            });
        }

        try {
            // Fetch flight offers using Amadeus API
            const response = await amadeus.shopping.flightOffersSearch.get({
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate,
                adults: "1", // Default to 1 adult for simplicity
            });

            // Respond with flight offers
            res.json(response.data);
        } catch (error) {
            console.log('Error fetching flight offers:', error);
            console.error('Error fetching flight offers:', error);
            res.status(500).json({ error: 'Error fetching flight offers' });
        }
    });
 
    // Book flight route
    app.post('/book-flight/:flightId', async (req, res) => {
        try {
            console.log('Request Body:', req.body);
            const { userId, travelerInfo, origin, destination, departureDate, price, airline } = req.body;

            if (!userId || !travelerInfo) {
                return res.status(400).json({ error: 'User ID and traveler info are required' });
            }

            const flightBooking = new Flight({
                userId,
                origin,
                destination,
                departureDate,
                price,
                airline,
                travelers: travelerInfo,
            });

            await flightBooking.save();

            res.status(201).json({ message: 'Flight booked successfully', flightBooking });
        } catch (error) {
            console.error('Error in /book-flight:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });



    // Fetch bookings by userId
    app.get('/users/:userId/bookings', async (req, res) => {
        try {
            const userId = req.params.userId;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ error: 'Invalid userId format' });
            }

            const bookings = await Flight.find({ userId: new mongoose.Types.ObjectId(userId) });
            if (!bookings.length) {
                return res.status(404).json({ message: 'No bookings found for this user.' });
            }

            res.status(200).json({ bookings });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


    // Fetch all bookings
    



    //edit booking by userId and bookingId
    app.put('/users/:userId/bookings/:bookingId', async (req, res) => {
        try {
            const { userId, bookingId } = req.params;
    
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookingId)) {
                return res.status(400).json({ error: 'Invalid userId or bookingId' });
            }
    
            const updatedBooking = await Flight.findOneAndUpdate(
                { userId, _id: bookingId },
                { $set: req.body },
                { new: true }
            );
    
            if (!updatedBooking) {
                return res.status(404).json({ error: 'Booking not found' });
            }
    
            res.status(200).json({ updatedBooking });
        } catch (error) {
            console.error('Error updating booking:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    });



    
    // Delete booking by userId and bookingId
    app.delete('/users/:userId/bookings/:bookingId', async (req, res) => {
        try {
            const { userId, bookingId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookingId)) {
                return res.status(400).json({ error: 'Invalid userId or bookingId' });
            }

            const booking = await Flight.findOneAndDelete({ userId, _id: bookingId });
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found or already deleted.' });
            }

            res.status(200).json({ message: 'Booking deleted successfully' });
        } catch (error) {
            console.error('Error deleting booking:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Attach the routes to the app
    app.use('/flights', router);
}
