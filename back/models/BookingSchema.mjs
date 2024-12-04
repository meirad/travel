import mongoose from 'mongoose';
const travelerSchema = new mongoose.Schema({
    name: {
        firstName: String,
        lastName: String,
    },
    dateOfBirth: String,
    contact: {
        emailAddress: String,
        phones: [{
            deviceType: String,
            countryCallingCode: String,
            number: String,
        }],
    },
    documents: [{
        documentType: String,
        number: String,
        expiryDate: String,
        issuanceCountry: String,
        nationality: String,
        holder: Boolean,
    }],
});

const flightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: String,
    destination: String,
    departureDate: Date,
    price: Number,
    airline: String,
    travelers: [travelerSchema], // This should allow the array of traveler info including name
    paymentInfo: {
        cardNumber: String,
        expiryDate: String,
        cvv: String,
    },
    bookingDate: { type: Date, default: Date.now },
});


export const Flight = mongoose.model('Flight', flightSchema);
