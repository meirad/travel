import express from "express";
import mongoose from "mongoose";
import { SavedFlight } from '../models/SavedFlightSchema.mjs';  // Import SavedFlight model

const router = express.Router();

// POST route to save flight for later
router.post('/save-flight', async (req, res) => {
    try {
        const { userId, flightDetails } = req.body;

        if (!userId || !flightDetails) {
            return res.status(400).json({ error: 'User ID and flight details are required' });
        }

        // Create and save the new saved flight document
        const savedFlight = new SavedFlight({
            userId,
            flightDetails,
        });

        await savedFlight.save();

        res.status(201).json({ message: 'Flight saved for later successfully', savedFlight });
    } catch (error) {
        console.error('Error saving flight:', error);
        res.status(500).json({ error: 'Error saving flight' });
    }
});

// GET route to fetch all saved flights
router.get('/saved-flights', async (req, res) => {
    try {
        // Make sure to query for the saved flights properly
        const savedFlights = await SavedFlight.find();

        if (savedFlights.length === 0) {
            return res.status(404).json({ message: 'No saved flights found' });
        }

        // Ensure the saved flights match the frontend expectations
        res.status(200).json(savedFlights);
    } catch (error) {
        console.error('Error fetching saved flights:', error);
        res.status(500).json({ error: 'Error fetching saved flights' });
    }
});

// Fetch a single saved flight by ID
router.get('/saved-flights/:flightId', async (req, res) => {
    try {
        const { flightId } = req.params;

        // Ensure flightId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(flightId)) {
            return res.status(400).json({ error: 'Invalid flightId format' });
        }

        // Fetch flight details using the flightId
        const flight = await SavedFlight.findById(flightId);

        if (!flight) {
            return res.status(404).json({ message: 'Saved flight not found' });
        }

        res.status(200).json(flight);
    } catch (error) {
        console.error('Error fetching saved flight:', error);
        res.status(500).json({ error: 'Error fetching saved flight' });
    }
});

// DELETE route to remove a saved flight
// DELETE route to remove a saved flight
router.delete('/saved-flights/:flightId', async (req, res) => {
    try {
        const { flightId } = req.params;

        // Validate that the flightId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(flightId)) {
            return res.status(400).json({ error: 'Invalid flightId format' });
        }

        const savedFlight = await SavedFlight.findByIdAndDelete(flightId);

        if (!savedFlight) {
            return res.status(404).json({ message: 'Saved flight not found' });
        }

        res.status(200).json({ message: 'Saved flight removed successfully' });
    } catch (error) {
        console.error('Error deleting saved flight:', error);
        res.status(500).json({ error: 'Error deleting saved flight' });
    }
});


// Attach the routes to the app
export default router;
