import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import Amadeus from "amadeus";
import flightRoutes from "./Routers/flights.mjs";
import authRoutes from "./users/auth.mjs";
import userRoutes from './users/users.mjs';
import SavedFlight from "./Routers/SavedFlights.mjs";
import testimonialRoutes from "./Routers/testimonials.mjs";
import contactRoutes from './Routers/contact.mjs';
import axios from 'axios';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure the environment variables are loaded properly
console.log('AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY);
console.log('API_SECRET:', process.env.API_SECRET);

// Initialize Amadeus client with proper credentials
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.API_SECRET,
});

// Function to get access token
const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials', // Required parameter
                client_id: process.env.AMADEUS_API_KEY, // API Key
                client_secret: process.env.API_SECRET, // API Secret
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );
        console.log('Token fetched successfully:', response.data.access_token);
        return response.data.access_token; // Return the access token
    } catch (error) {
        console.error('Error fetching token:', error.response?.data || error.message);
        return null; // Return null in case of error
    }
};

// Fetch token at server startup
const token = await getAccessToken();
if (!token) {
    console.error('Failed to fetch token');
} else {
    console.log('Amadeus client initialized successfully.');
}



// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flight");
        console.log("MongoDB connection established");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
main();

// Use routes
flightRoutes(app, amadeus);


app.use("/auth", authRoutes);
app.use('/users', userRoutes);
app.use('/flights', SavedFlight);
app.use("/testimonials", testimonialRoutes);
app.use('/contact', contactRoutes);

// Start server
const PORT = process.env.PORT || 6996;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
