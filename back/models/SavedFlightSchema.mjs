import mongoose from 'mongoose';

const savedFlightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flightDetails: {
    id: { type: String, required: true },
    instantTicketingRequired: { type: Boolean, required: true },
    isUpsellOffer: { type: Boolean, required: true },
    itineraries: { type: Array, required: true },
    lastTicketingDate: { type: String, required: true },
    lastTicketingDateTime: { type: String, required: true },
    nonHomogeneous: { type: Boolean, required: true },
    numberOfBookableSeats: { type: Number, required: true },
    oneWay: { type: Boolean, required: true },
    price: {
      currency: { type: String, required: true },
      total: { type: String, required: true },
      base: { type: String, required: true },
      fees: { type: Array, required: true },
      grandTotal: { type: String, required: true },
    },
    pricingOptions: { type: Object, required: true },
    source: { type: String, required: true },
    travelerPricings: { type: Array, required: true },
    type: { type: String, required: true },
    validatingAirlineCodes: { type: Array, required: true },
  }
});

const SavedFlight = mongoose.model('SavedFlight', savedFlightSchema);

export { SavedFlight };
