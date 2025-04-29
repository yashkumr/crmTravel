import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    firstName: {
        type: String, required: true
    },
    middleName: {
        type: String
    },
    mobile: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    dob: {
        type: Date
    },
    cardHolderName: {
        type: String
    },
    cardNumber: {
        type: String
    },
    cardDetails: {
        type: String
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    postalCode: {
        type: String
    },
    adult: {
        type: Number, required: true
    },
    infant: {
        type: Number
    },
    child: {
        type: Number
    },
    // totalAmount: { type: Number, required: true },
    currency: {
        type: String
    },
    rooms: {
        type: Number
    },
    org: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"

    }


}, { timestamps: true });

export default mongoose.model('Hotels', hotelSchema);
