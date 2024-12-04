// backend/models/Contact.js
import mongoose from 'mongoose';

// Define the schema for the contact form submission
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the Contact model
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
