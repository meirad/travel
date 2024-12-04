// backend/routes/contact.mjs
import express from 'express';
import Contact from '../models/Contact.mjs';  // Import the Contact model

const router = express.Router();

// POST route to save contact form data
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate the fields
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // Create a new contact entry in MongoDB
        const newContact = new Contact({
            name,
            email,
            message,
        });

        // Save the contact entry to the database
        await newContact.save();

        // Send a success response
        res.status(200).json({ message: 'Thank you for your message! We will get back to you soon.' });
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).json({ error: 'Failed to save contact. Please try again.' });
    }
});

export default router;
