import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout/Layout.jsx";
import SideBar from "../../components/SideBar.jsx";

const DetailsPnrFlight = () => {
  const { id: flightId } = useParams();
  const [flightDetails, setFlightDetails] = useState({});

  // Fetch flight details function moved outside useEffect for reuse
  const fetchFlightDetails = async () => {
    try {
      const response = await axios.get(
        `/api/v1/flights/get-single-flight/${flightId}`
      );
      console.log("Flight Details Response:", response.data);
      if (response.data.success) {
        setFlightDetails(response.data.data);
      } else {
        console.error("Failed to fetch flight details.");
      }
    } catch (error) {
      console.error("Error fetching flight details:", error);
    }
  };

  useEffect(() => {
    fetchFlightDetails();
  }, [flightId]);

  const handleProviderUpdate = async () => {
    try {
      await axios.patch(`/api/v1/ctmFlights/update-provider/${flightId}`, {
        provider: flightDetails?.provider,
      });
      alert("Provider updated successfully!");
      fetchFlightDetails();
    } catch (error) {
      console.error(error);
      alert("Error updating provider.");
    }
  };

  const handleBidStatusUpdate = async () => {
    try {
      await axios.patch(`/api/v1/ctmFlights/update-bid-status/${flightId}`, {
        ticketmco: flightDetails?.ticketmco,
        adminAuthorize: flightDetails?.adminAuthorize,
        bidStatus: flightDetails?.bidStatus,
      });
      alert("Bid status updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating bid status.");
    }
  };

  const handleMailInvice = async () => {
    try {
      await axios.get(
        `/api/v1/ctmFlights/update-send-mail-invoice-details/${flightId}`,
        {
          flightDetails,
          language: flightDetails.language,
          transactionType: flightDetails.transactionType,
        }
      );
      alert("Mail invoice sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Error sending mail invoice.");
    }
  };

  const formattedCreatedAt = flightDetails.createdAt
    ? new Date(flightDetails.createdAt).toLocaleString()
    : "N/A";

  return (
    <Layout>
      <div className="d-flex">
        <SideBar />

        <div className="flex-grow-1 p-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Provider Details</h5>
                <div>
                  <button className="btn btn-danger btn-sm mx-2">
                    Close Booking
                  </button>
                  <button
                    className="btn btn-primary btn-sm mx-2"
                    onClick={async () => {
                      try {
                        await axios.patch(
                          `/api/v1/ctmFlights/update-auth-flight/${flightId}`
                        );
                        alert("provider details updated!");
                      } catch (err) {
                        alert("Failed to update charging details.");
                      }
                    }}
                  >
                    Auth
                  </button>
                  <button className="btn btn-success btn-sm">Refresh</button>
                </div>
              </div>

              <div>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>BID</th>
                      <td>{flightDetails.bookingId || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Provider</th>
                      <td>
                        <div className="d-flex justify-content-between align-items-center text-center">
                          <div>
                            <select
                              id="providerSelect"
                              className="form-select"
                              value={flightDetails?.provider || ""}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  provider: e.target.value,
                                }))
                              }
                              required
                            >
                              <option value="">Choose...</option>
                              <option value="faresway">Faresway</option>
                              <option value="TravelPro">TravelPro</option>
                              <option value="SkyHigh">SkyHigh</option>
                            </select>
                          </div>

                          <div>
                            <button
                              className="btn btn-success mt-2"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                if (!flightDetails?.provider) {
                                  alert("Please select a provider!");
                                  return;
                                }
                                handleProviderUpdate();
                              }}
                            >
                              Submit Provider
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th>Transaction Type</th>
                      <td>{flightDetails.transactionType || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Date Created</th>
                      <td>{formattedCreatedAt}</td>
                    </tr>
                    <tr>
                      <th>Auth Status</th>
                      <td
                        className={`text-${
                          flightDetails.pnrStatus === "approved"
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {flightDetails.pnrStatus}
                      </td>
                    </tr>
                    <tr>
                      <th>Bid Status</th>
                      <td>
                        <div className="d-flex justify-content-between text-align-center text-center">
                          <div>
                            <select
                              id="bidStatusSelect"
                              className="form-select"
                              value={flightDetails?.bidStatus}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  bidStatus: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select</option>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="approved">Approved</option>
                            </select>
                          </div>
                          <div>
                            <select
                              id="ticketmco"
                              className="form-select"
                              value={flightDetails?.ticketmco}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  ticketmco: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="underFollowup">
                                Under Followup
                              </option>
                              {flightDetails?.chargingStatus === "charged" && (
                                <option value="ticketmco">
                                  Ticketed & MCO
                                </option>
                              )}
                            </select>
                          </div>
                          {/* <div>
                            <select
                              id="adminAuthorize"
                              className="form-select"
                              value={flightDetails?.adminAuthorize}
                              onChange={(e) =>
                                setFlightDetails((prev) => ({
                                  ...prev,
                                  adminAuthorize: e.target.value,
                                }))
                              }
                            >
                              <option value="">Select</option>
                              <option value="adminAuthorize">Authorized</option>
                            </select>
                          </div> */}

                          <div>
                            <button
                              className="btn btn-success"
                              onClick={(e) => {
                                e.preventDefault(); // Prevent default form submission
                                if (
                                  !flightDetails?.bidStatus ||
                                  !flightDetails?.ticketmco
                                ) {
                                  alert(
                                    "Please select both Bid Status and Ticket MCO!"
                                  );
                                  return;
                                }
                                handleBidStatusUpdate();
                              }}
                            >
                              Submit Bid Status
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ITINERARY DETAILS FOR FLIGHT ID */}
              <div className="mt-3">
                <h5>ITINERARY DETAILS FOR FLIGHT ID</h5>
                <table className="table table-bordered mt-4">
                  <thead>
                    <tr>
                      <th>Airline</th>
                      <th>Flight</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Departure</th>
                      <th>Arrival</th>
                      <th>Class</th>
                      <th>AL Locator</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.airline || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              airline: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.flight || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              flight: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.from || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              from: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.to || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              to: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={
                            flightDetails?.departure
                              ? new Date(flightDetails.departure)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              departure: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={
                            flightDetails?.arrival
                              ? new Date(flightDetails.arrival)
                                  .toISOString()
                                  .slice(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              arrival: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.class || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              class: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.alLocator || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              alLocator: e.target.value,
                            }))
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-end">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        await axios.patch(
                          `/api/v1/ctmFlights/update-itinerary-details/${flightId}`,
                          {
                            airline: flightDetails.airline,
                            flight: flightDetails.flight,
                            from: flightDetails.from,
                            to: flightDetails.to,
                            departure: flightDetails.departure,
                            arrival: flightDetails.arrival,
                            cabinClass: flightDetails.class,
                            alLocator: flightDetails.alLocator,
                          }
                        );
                        alert("Itinerary details updated!");
                      } catch (err) {
                        alert("Failed to update itinerary details.");
                      }
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="mt-3">
                <h5>Price Details</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Base Fare</th>
                      <th>Tax & Fees</th>
                      <th>Total Amount</th>
                      <th>Currency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.baseFare || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              baseFare: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.taxes || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              taxes: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.totalAmount || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              totalAmount: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.currency || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              currency: e.target.value,
                            }))
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-end">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        await axios.patch(
                          `/api/v1/ctmFlights/update-price-details/${flightId}`,
                          {
                            baseFare: flightDetails.baseFare,
                            taxes: flightDetails.taxes,
                            totalAmount: flightDetails.totalAmount,
                            currency: flightDetails.currency,
                          }
                        );
                        alert("Price details updated!");
                      } catch (err) {
                        alert("Failed to update price details.");
                      }
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Charging Details */}
              <div className="mt-3">
                <h5>Charging Details</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Charged On</th>
                      <th>Charged By</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Base Fare</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargingBaseFare || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingBaseFare: e.target.value,
                            }))
                          }
                        />
                      </td>

                      <td>
                        <select
                          className="form-control"
                          value={flightDetails?.chargingStatus || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingStatus: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select </option>
                          <option value="declined">Declined</option>
                          <option value="charged">Charged</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargedOn || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargedOn: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargedBy || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargedBy: e.target.value,
                            }))
                          }
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Taxes & Fees</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargingTaxes || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingTaxes: e.target.value,
                            }))
                          }
                        />
                      </td>
                      {/* <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargingTaxStatus || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingTaxStatus: e.target.value,
                            }))
                          }
                        />
                      </td> */}
                      <td>
                        <select
                          className="form-control"
                          value={flightDetails?.chargingTaxStatus || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingTaxStatus: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select</option>
                          <option value="declined">Declined</option>
                          <option value="charged">Charged</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargingTaxchargedOn || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingTaxchargedOn: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={flightDetails?.chargingTaxchargedBy || ""}
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargingTaxchargedBy: e.target.value,
                            }))
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-end">
                  <button
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        await axios.patch(
                          `/api/v1/ctmFlights/update-charging-details/${flightId}`,
                          {
                            chargingBaseFare: flightDetails.chargingBaseFare,
                            chargingStatus: flightDetails.chargingStatus,
                            chargedOn: flightDetails.chargedOn,
                            chargedBy: flightDetails.chargedBy,

                            chargingTaxes: flightDetails.chargingTaxes,
                            chargingTaxStatus: flightDetails.chargingTaxStatus,
                            chargingTaxchargedOn:
                              flightDetails.chargingTaxchargedOn,
                            chargingTaxchargedBy:
                              flightDetails.chargingTaxchargedBy,
                          }
                        );
                        alert("Charging details updated!");
                      } catch (err) {
                        alert("Failed to update charging details.");
                      }
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Passenger Details */}
              {/* <div className="mt-3">
                <h5>Passenger Details</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Passport Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{flightDetails?.name || "N/A"}</td>
                      <td>{flightDetails?.age || "N/A"}</td>
                      <td>{flightDetails?.gender || "N/A"}</td>
                      <td>{flightDetails?.passportNumber || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}

              {/* Billing Details */}
              {/* <div className="mt-3">
                <h5>Billing Details</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Billing Name</th>
                      <th>Billing Address</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{flightDetails?.billingName || "N/A"}</td>
                      <td>{flightDetails?.billingAddress || "N/A"}</td>
                      <td>{flightDetails?.contactNumber || "N/A"}</td>
                      <td>{flightDetails?.email || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}

              <div className="container mt-4">
                {/* Passenger Details */}
                <h1 className="h4 mb-4">Passenger Details</h1>
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Type</label>
                        <input
                          type="text"
                          value={flightDetails?.detailsType || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              detailsType: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          value={flightDetails?.firstName || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Middle Name</label>
                        <input
                          type="text"
                          value={flightDetails?.middleName || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              middleName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          value={flightDetails?.lastName || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        <input
                          type="text"
                          value={flightDetails?.gender || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Date of Birth (DOB)
                        </label>
                        <input
                          type="text"
                          value={flightDetails?.dob || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              dob: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Ticket Number</label>
                        <input
                          type="text"
                          value={flightDetails?.ticketNumber || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              ticketNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="text-end">
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `/api/v1/ctmflights/update-passenger-details/${flightId}`,
                                {
                                  detailsType: flightDetails?.detailsType,
                                  firstName: flightDetails?.firstName,
                                  middleName: flightDetails?.middleName,
                                  lastName: flightDetails?.lastName,
                                  gender: flightDetails?.gender,
                                  dob: flightDetails?.dob,
                                  ticketNumber: flightDetails?.ticketNumber,
                                }
                              );
                              alert("Charging details updated!");
                            } catch (err) {
                              alert("Failed to update charging details.");
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Details */}
                <h1 className="h4 mb-4">Billing Details</h1>
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Card Type</label>
                        <input
                          type="text"
                          value={flightDetails?.cardType || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              cardType: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">C.C.H. Name</label>
                        <input
                          type="text"
                          value={flightDetails?.cchName || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              cchName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Card Number</label>
                        <input
                          type="password"
                          value={flightDetails?.cardNumber || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              cardNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">CVV</label>
                        <input
                          type="password"
                          value={flightDetails?.cvv}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              cvv: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Expiry</label>
                        <input
                          type="text"
                          value={flightDetails?.expiry || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              expiry: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          value={flightDetails?.email || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Billing Number</label>
                        <input
                          type="text"
                          value={flightDetails?.billingNumber || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              billingNumber: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Billing Address</label>
                        <input
                          type="text"
                          value={flightDetails?.billingAddress1 || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              billingAddress1: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Billing Address 2</label>
                        <input
                          type="text"
                          value={flightDetails?.billingAddress2 || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              billingAddress2: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          value={flightDetails?.city || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          value={flightDetails?.state || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          value={flightDetails?.country || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              country: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Pin Code</label>
                        <input
                          type="text"
                          value={flightDetails?.pinCode || ""}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              pinCode: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="text-end">
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `/api/v1/ctmFlights/update-billing-details/${flightId}`,
                                {
                                  cardType: flightDetails?.cardType,
                                  cchName: flightDetails?.cchName,
                                  cardNumber: flightDetails?.cardNumber,
                                  cvv: flightDetails?.cvv,
                                  expiry: flightDetails?.expiry,
                                  email: flightDetails?.email,
                                  billingNumber: flightDetails?.billingNumber,
                                  billingAddress1:
                                    flightDetails?.billingAddress1,
                                  billingAddress2:
                                    flightDetails?.billingAddress2,
                                  city: flightDetails?.city,
                                  state: flightDetails?.state,
                                  country: flightDetails?.country,
                                  pinCode: flightDetails?.pinCode,
                                }
                              );
                              alert("Charging details updated!");
                            } catch (err) {
                              alert("Failed to update charging details.");
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Details */}
                <h1 className="h4 mb-4">Refund Details</h1>
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="text"
                          value={flightDetails?.amount}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Refund Requested On
                        </label>
                        <input
                          type="text"
                          value={flightDetails?.refundRequestedOn}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              refundRequestedOn: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Reason for Refund</label>
                        <input
                          type="text"
                          value={flightDetails?.reasonForRefund}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              reasonForRefund: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Refund Status</label>
                        <input
                          type="text"
                          value={flightDetails?.refundStatus}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="text-end">
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `/api/v1/ctmFlights/update-refund-details/${flightId}`,
                                {
                                  amount: flightDetails?.amount,
                                  refundRequestedOn:
                                    flightDetails?.refundRequestedOn,
                                  reasonForRefund:
                                    flightDetails?.reasonForRefund,
                                  refundStatus: flightDetails?.refundStatus,
                                }
                              );
                              alert("Refund  details updated!");
                            } catch (err) {
                              alert("Failed to update Refund details.");
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chargeback Details */}
                <h1 className="h4 mb-4">Chargeback Details</h1>
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="text"
                          value={flightDetails?.chargeAmount}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargeAmount: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Chargeback Date</label>
                        <input
                          type="text"
                          value={flightDetails?.chargebackDate}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargebackDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Reason for Chargeback
                        </label>
                        <input
                          type="text"
                          value={flightDetails?.reasonForChargeback}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              reasonForChargeback: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Chargeback Status</label>
                        <input
                          type="text"
                          value={flightDetails?.chargebackStatus}
                          className="form-control"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              chargebackStatus: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="text-end">
                        <button
                          className="btn btn-primary"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `/api/v1/ctmFlights/update-chargeBack-details/${flightId}`,
                                {
                                  chargeAmount: flightDetails?.chargeAmount,
                                  chargebackDate: flightDetails?.chargebackDate,
                                  reasonForChargeback:
                                    flightDetails?.reasonForChargeback,
                                  chargebackStatus:
                                    flightDetails?.chargebackStatus,
                                }
                              );
                              alert("Charging details updated!");
                            } catch (err) {
                              alert("Failed to update charging details.");
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send Email */}
                <h1 className="h4 mb-4">Send Email</h1>
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Language</label>
                        <select
                          value={flightDetails?.language}
                          className="form-select"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              language: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select</option>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Transaction Type</label>
                        <select
                          value={flightDetails?.transactionType}
                          className="form-select"
                          onChange={(e) =>
                            setFlightDetails((prev) => ({
                              ...prev,
                              transactionType: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select</option>
                          <option value="refund">Refund</option>
                          <option value="chargeback">Chargeback</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 text-end">
                      <button
                        className="btn btn-success"
                        onClick={handleMailInvice}
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsPnrFlight;
