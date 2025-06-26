import React, { useState } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";
import toast from "react-hot-toast";
import axios from "axios";

const CreateCtmFlight = () => {
  const initialFormData = {
    transactionType: "",
    itineraryType: "",
    passengers: "",
    provider: "",
    airline: "",
    flight: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    class: "",
    alLocator: "",
    baseFare: "",
    taxes: "",
    totalAmount: "",
    currency: "USD",
    detailsType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    cardType: "",
    cchName: "",
    cardNumber: "",
    cvv: "",
    expiryMonth: "",
    expiryYear: "",
    billingPhoneNumber: "",
    contactNumber: "",
    billingAddress1: "",
    billingAddress2: "",
    email: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [step, setStep] = useState(1);

  const backondetailsec = () => {
    setStep(1);
  };
  const forwardToBillingSection = () => {
    setStep(2);
  };

  const handleSubmit = async (e, remarksText) => {
    if (e) e.preventDefault();

    try {
      console.log("Form Data:", formData);
      console.log("Remarks:", remarksText);
      const { data } = await axios.post(
        "/api/v1/ctmFlights/create-ctm-flight",
        formData
      );
      if (data?.message) {
        toast.success(data.message);
      }
      setFormData(initialFormData);
      setRemarks("");
      setStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const handleShowRemarksModal = (e) => {
    e.preventDefault();
    // Validate all required fields except remarks
    const requiredFields = [
      "transactionType",
      "itineraryType",
      "passengers",
      "provider",
      
      "airline",
      "flight",
      "from",
      "to",
      "departure",
      "arrival",
      "class",
      "alLocator",
      "baseFare",
      "taxes",
      "totalAmount",
      "currency",
      "detailsType",
      "firstName",
      "middleName",
      "lastName",
      "gender",
      "dob",
      "cardType",
      "cchName",
      "cardNumber",
      "cvv",
      "expiryMonth",
      "expiryYear",
      "billingPhoneNumber",
      "contactNumber",
      "billingAddress1",
      "billingAddress2",
      "email",
      "city",
      "state",
      "country",
      "zipCode",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || !formData[field].toString().trim()) {
        toast.error(`Please fill the ${field.replace(/([A-Z])/g, " $1")}`);
        return;
      }
    }
    setShowRemarksModal(true);
  };

  const validateForm = () => {
    // List all required fields for step 2
    const requiredFields = [
      "airline",
      "flight",
      "from",
      "to",
      "departure",
      "arrival",
      "class",
      "alLocator",
      "baseFare",
      "taxes",
      "totalAmount",
      "currency",
      "detailsType",
      "firstName",
      "middleName",
      "lastName",
      "gender",
      "dob",
      "cardType",
      "cchName",
      "cardNumber",
      "cvv",
      "expiryMonth",
      "expiryYear",
      "billingPhoneNumber",
      "contactNumber",
      "billingAddress1",
      "billingAddress2",
      "email",
      "city",
      "state",
      "country",
      "zipCode",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || !formData[field].toString().trim()) {
        toast.error(`Please fill the ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }
    if (!remarks.trim()) {
      toast.error("Please enter remarks.");
      return false;
    }
    return true;
  };

  // Update handleRemarksConfirm to use validation
  const handleRemarksConfirm = () => {
    if (!validateForm()) return;
    setShowRemarksModal(false);
    handleSubmit(null, remarks);
  };

  // Handler for modal cancel
  const handleRemarksCancel = () => {
    setShowRemarksModal(false);
    setRemarks("");
  };

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />

        <div className="flex-grow-1">
          <div className="flex-grow-1 p-4">
            <form onSubmit={handleSubmit}>
              <div className="queryparent">
                {step === 1 ? (
                  <div className="card shadow p-4">
                    <p className="text-start text-dark fw-bold mb-4">
                      Travel Details
                    </p>
                    <div className="row">
                      {/* Transaction Type */}
                      <div className="col-md-9 mb-3">
                        <label htmlFor="transactionType" className="form-label">
                          Transaction Type
                        </label>
                        <select
                          name="transactionType"
                          className="form-select"
                          value={formData.transactionType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="newBooking">New Booking</option>
                          <option value="exchange">Exchange</option>
                          <option value="seatAssignments">
                            Seat Assignments
                          </option>
                          <option value="upgrade">Upgrade</option>
                          <option value="cancellationRefund">
                            Cancellation for Refund
                          </option>
                          <option value="cancellationFutureCredit">
                            Cancellation for Future Credit
                          </option>
                          <option value="extraAddOn">Extra Add On</option>
                          <option value="ticketIssuance">
                            Ticket Issuance
                          </option>
                        </select>
                      </div>

                      {/* Itinerary Type */}
                      <div className="col-md-9 mb-3">
                        <label htmlFor="itineraryType" className="form-label">
                          Itinerary Type
                        </label>
                        <select
                          name="itineraryType"
                          className="form-select"
                          value={formData.itineraryType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="oneWay">One-Way</option>
                          <option value="roundTrip">Round-Trip</option>
                          <option value="multiCity">Multi-City</option>
                          <option value="dynamicItinerary">
                            Dynamic Itinerary
                          </option>
                        </select>
                      </div>

                      {/* Number of Passengers */}
                      <div className="col-md-9 mb-3">
                        <label htmlFor="passengers" className="form-label">
                          Number of Passengers
                        </label>
                        <select
                          name="passengers"
                          className="form-select"
                          value={formData.passengers}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>

                      {/* Provider */}
                      <div className="col-md-9 mb-3">
                        <label htmlFor="provider" className="form-label">
                          Select Provider
                        </label>
                        <select
                          name="provider"
                          className="form-select"
                          value={formData.provider}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="faresway">Faresway</option>
                          <option value="traveloways">Traveloways</option>
                          <option value="fareswilla">Fareswilla</option>
                        </select>
                      </div>
                    </div>

                    {/* Next Button */}
                    <div className="text-start">
                      <button
                        type="button"
                        className="btn btn-primary px-5"
                        onClick={forwardToBillingSection}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : step === 2 ? (
                  <>
                    {" "}
                    <button
                      onClick={backondetailsec}
                      className="btn btn-warning mb-4 px-5"
                    >
                      Back
                    </button>
                    <div className="card shadow p-4">
                      <div className="p-6 space-y-6 bg-gray-50 rounded-md shadow-md">
                        <h2 className="text-xl font-bold">Itinerary Details</h2>
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            name="airline"
                            placeholder="Airline"
                            value={formData.airline}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="flight"
                            placeholder="Flight"
                            value={formData.flight}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="from"
                            placeholder="From"
                            value={formData.from}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="to"
                            placeholder="To"
                            value={formData.to}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            type="date"
                            name="departure"
                            value={formData.departure}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            type="date"
                            name="arrival"
                            value={formData.arrival}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="class"
                            placeholder="Class"
                            value={formData.class}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="alLocator"
                            placeholder="AL Locator"
                            value={formData.alLocator}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                        </div>
                        <h2 className="text-xl font-bold">Price Details</h2>
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            name="baseFare"
                            placeholder="Base Fare"
                            value={formData.baseFare}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="taxes"
                            placeholder="Taxes & Fees"
                            value={formData.taxes}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="totalAmount"
                            placeholder="Total Amount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                        <h2 className="text-xl font-bold">Passenger Details</h2>
                        <div className="grid grid-cols-5 gap-4">
                          <select
                            name="detailsType"
                            value={formData.detailsType}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          >
                            <option value="">Type</option>
                            <option value="adult">Adult</option>
                            <option value="child">Child</option>
                          </select>
                          <input
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="middleName"
                            placeholder="Middle Name"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="gender"
                            placeholder="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                        </div>
                        <h2 className="text-xl font-bold">Billing Details</h2>
                        <div className="grid grid-cols-3 gap-4">
                          <select
                            name="cardType"
                            value={formData.cardType}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          >
                            <option value="">Card Type</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">MasterCard</option>
                          </select>
                          <input
                            name="cchName"
                            placeholder="C.C.H Name"
                            value={formData.cchName}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="cardNumber"
                            placeholder="Card Number"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="cvv"
                            placeholder="CVV"
                            value={formData.cvv}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="expiryMonth"
                            placeholder="MM"
                            value={formData.expiryMonth}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="expiryYear"
                            placeholder="YY"
                            value={formData.expiryYear}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="billingPhoneNumber"
                            placeholder="Billing Phone Number"
                            value={formData.billingPhoneNumber}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="billingAddress1"
                            placeholder="Billing Address 1"
                            value={formData.billingAddress1}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="billingAddress2"
                            placeholder="Billing Address 2"
                            value={formData.billingAddress2}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                          <input
                            name="zipCode"
                            placeholder="Zip Code"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="border p-2"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                          onClick={handleShowRemarksModal}
                        >
                          Submit
                        </button>
                        {/* Remarks Modal */}
                        {showRemarksModal && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              background: "rgba(0,0,0,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 9999,
                            }}
                          >
                            <div
                              style={{
                                background: "#fff",
                                padding: 24,
                                borderRadius: 8,
                                minWidth: 350,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                              }}
                            >
                              <h5 className="mb-3">Add Remarks</h5>
                              <textarea
                                className="form-control mb-3"
                                rows={3}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter remarks here..."
                                required
                              />
                              <div className="d-flex justify-content-end gap-2">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={handleRemarksCancel}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleRemarksConfirm}
                                  disabled={!remarks.trim()}
                                >
                                  Confirm & Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCtmFlight;
