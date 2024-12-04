// models/BookingSchema.mjs
import mongoose from 'mongoose';

const travelerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    passportNumber: { type: String, required: false }, // Optional
});

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    travelerInfo: [travelerSchema],
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: Date, required: true },
    price: { type: Number, required: true },
    airline: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now },
    paymentInfo: {
        cardNumber: { type: String, required: true },
        expiryDate: { type: String, required: true },
        cvv: { type: String, required: true },
    },
});

export const Booking = mongoose.model('Booking', bookingSchema);
