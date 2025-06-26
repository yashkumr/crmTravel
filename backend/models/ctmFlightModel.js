import mongoose from "mongoose";

const ctmFlightSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      
    },
    itineraryType: {
      type: String,
      required: true,
    },
    passengers: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    airline: {
      type: String,
      required: true,
    },
    flight: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    departure: {
      type: Date,
      required: true,
    },
    arrival: {
      type: Date,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    alLocator: {
      type: String,
    },
    baseFare: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    // Passenger Details
    detailsType: { type: String },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true }, // Use String for consistency with frontend
    ticketNumber: { type: String },
    // Billing Details
    cardType: { type: String, required: true },
    cchName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    expiry: { type: String }, // Use String for MM/YY or MM/YYYY
    billingPhoneNumber: { type: String },
     contactNumber: { type: String },
    billingAddress1: { type: String },
    billingAddress2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String },
    zipCode: { type: String },
    email: { type: String, required: true },
    // Charging Details
    chargingBaseFare: { type: String },
    chargingStatus: { type: String },
    chargedOn: { type: String },
    chargedBy: { type: String },
    chargingTaxes: { type: String },
    chargingTaxStatus:{type:String},
    chargingTaxchargedOn:{type:String},
    chargingTaxchargedBy:{type:String},
    // Refund Details
    amount: { type: String },
    refundRequestedOn: { type: String },
    reasonForRefund: { type: String },
    refundStatus: { type: String },
    // Chargeback Details
    chargeAmount: { type: String },
    chargebackDate: { type: String },
    reasonForChargeback: { type: String },
    chargebackStatus: { type: String },
    // Email/Language
    language: { type: String },
    // Bid/Auth Status
    pnrStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bidStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "approved",
        "rejected",
      ],
      default: "pending",
    },
    ticketmco: { type: String },
    adminAuthorize: { type: String },
    approvedBy: { type: String },
    bookingConfirmed: { type: Boolean, default: false },
    bookingId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("CtmFlight", ctmFlightSchema);
