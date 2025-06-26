import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ctmFlightModel from "../models/ctmFlightModel.js";
import htmlDocx from "html-docx-js";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, 
  },
});

export const createCtmFlightController = async (req, res) => {
  try {
    const {
      transactionType,
      itineraryType,
      passengers,
      provider,
      airline,
      flight,
      from,
      to,
      departure,
      arrival,
      class: flightClass,
      alLocator,
      baseFare,
      taxes,
      totalAmount,
      currency,
      detailsType,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      billingPhoneNumber,
      contactNumber,
      billingAddress1,
      billingAddress2,
      email,
      city,
      state,
      country,
      zipCode,
    } = req.body;

    const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `BID-${randomNum}`;

    // Save booking data to the database
    const newBooking = new ctmFlightModel({
      transactionType,
      itineraryType,
      passengers,
      provider,
      airline,
      flight,
      from,
      to,
      departure,
      arrival,
      class: flightClass,
      alLocator,
      baseFare,
      taxes,
      totalAmount,
      currency,
      detailsType,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      billingPhoneNumber,
      contactNumber,
      billingAddress1,
      billingAddress2,
      email,
      city,
      state,
      country,
      zipCode,
      bookingId,
    });

    await newBooking.save();

    const getTime = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);

      // Format as HH:mm (24-hour)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const departureTime = getTime(departure);
    const arrivalTime = getTime(arrival);

    const htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
        <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.baratoflight.us/images/auth/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.baratoflight.us/images/auth/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;"><a href="tel:+1-888-209-3035" style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.baratoflight.us/images/auth/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b> +1-888-209-3035</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

            <div style="text-align: center;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;margin-top: -6px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Name</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Type</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                1</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${firstName}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${detailsType}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${dob}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Itinerary Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Airline Name</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Airline Code</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                <span>${airline}</span> | <span> ${flightClass} </span>
                            </td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${flight} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            From</th>
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            To</th>

                    </thead>
                    <tbody>
                        <td
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            ${from} </td>
                        <td
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            ${to}</td>
                    </tbody>
                </table>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            Departs On | Time</th>
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            Arrive On | Time</th>
                    </thead>
                    <tbody>
                        <td
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                           ${
                             departure ? departure.split("T")[0] : ""
                           } | ${departureTime}</td>
                        <td
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            <span> ${
                              arrival ? arrival.split("T")[0] : ""
                            }</span> | <span>${arrivalTime}</span>
                        </td>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${contactNumber}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I TEST
                    TEST, authorize Faresvilla to charge my Debit/Credit card for 200.00 USD as per given details for
                    New booking . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at +1-888-209-3035.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="http://localhost:8000/api/v1/ctmFlights/confirm-ctm-booking/${
                  newBooking._id
                }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="#"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>

    `;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Booking Confirmation Required",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      message: "Booking created successfully. Confirmation email sent.",
      bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCtmFlightController = async (req, res) => {
  try {
    const { flightId } = req.params;

    const singleBooking = await ctmFlightModel.findById(flightId);

    console.log("singleBooking", singleBooking);

    const getTime = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);

      // Format as HH:mm (24-hour)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const departureTime = getTime(singleBooking?.departure);
    const arrivalTime = getTime(singleBooking?.arrival);

    const htmlTemplate = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
        <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.baratoflight.us/images/auth/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.baratoflight.us/images/auth/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;"><a href="tel:+1-888-209-3035" style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.baratoflight.us/images/auth/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b> +1-888-209-3035</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

            <div style="text-align: center;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;margin-top: -6px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Name</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Type</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                1</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.firstName}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.detailsType}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.dob}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Itinerary Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Airline Name</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Airline Code</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                <span>${
                                  singleBooking?.airline
                                }</span> | <span> ${
      singleBooking?.class
    } </span>
                            </td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.flight} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            From</th>
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            To</th>

                    </thead>
                    <tbody>
                        <td
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            ${singleBooking?.from} </td>
                        <td
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            ${singleBooking?.to}</td>
                    </tbody>
                </table>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            Departs On | Time</th>
                        <th
                            style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                            Arrive On | Time</th>
                    </thead>
                   
                      <tbody>
                        <td
                          style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                          ${
                            singleBooking?.departure
                              ? typeof singleBooking?.departure === "string"
                                ? singleBooking?.departure.split("T")[0]
                                : new Date(singleBooking?.departure).toISOString().split("T")[0]
                              : ""
                          } | ${departureTime}
                        </td>
                        <td
                          style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                          <span>${
                            singleBooking?.arrival
                              ? typeof singleBooking?.arrival === "string"
                                ? singleBooking?.arrival.split("T")[0]
                                : new Date(singleBooking?.arrival).toISOString().split("T")[0]
                              : ""
                          }</span> | <span>${arrivalTime}</span>
                        </td>
                      </tbody>

                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
      singleBooking?.expiryYear
    }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.contactNumber}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I TEST
                    TEST, authorize Faresvilla to charge my Debit/Credit card for 200.00 USD as per given details for
                    New booking . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at +1-888-209-3035.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="http://localhost:8000/api/v1/ctmFlights/confirm-ctm-booking/${
                  singleBooking?._id
                }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="#"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>

    `;

    const mailOptions = {
      from: process.env.EMAIL,
      to: singleBooking?.email,
      subject: "Booking Confirmation Required",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).send({
      message: "Booking created successfully. Confirmation email sent.",
      bookingId: singleBooking?.bookingId,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Confirm Booking Controller
export const confirmCtmBookingController = async (req, res) => {
  try {
    const { flightId } = req.params;

    // Find booking by ID
    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Confirm booking
    booking.bookingConfirmed = true;
    booking.pnrStatus = "approved";
    await booking.save();

    // HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CREDIT CARD AUTHORIZATION</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container mt-4">
          <div class="row">
            <div class="col-md-12">
              <h2 class="text-center" style="font-size: 36px; font-weight: 700; font-family: serif; color: #4285f4; margin-top: 10px;">CREDIT CARD AUTHORIZATION</h2>
              <p class="text-center" style="font-size: 32px; font-family: serif; font-weight: 900; padding: 10px;">Dear ${booking?.firstName},</p>
              <div class="text-center" style="width: 85%; font-family: serif; margin: 0 auto; border: 1px solid black; padding: 20px;">
                <p style="font-size: 34px; font-weight: 500; font-family: serif;">Thanks for Authorization</p>
                <p style="font-size: 25px; font-family: serif;">For your protection, our Authorized Payment Verification department may require additional documentation. Please check your email for a notification from</p>
                <p style="font-size: 25px; font-family: serif;"> <a href="mailto:Support@myreservationdetail.com">Support@myreservationdetail.com</a>.</p>
                <p style="font-size: 25px; font-family: serif;">We may also contact you via the phone number on file.</p>
              </div>
              <div class="text-center" style="margin-top: 20px;">
                <p style="font-size: 25px; font-family: serif;">©2024  <a href="mailto:Support@myreservationdetail.com">Support@myreservationdetail.com</a> All rights reserved.</p>
              </div>
              
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return res.status(200).send(htmlTemplate);

    // return res
    //   .status(200)
    //   .send({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("Error confirming booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// generatePnrFlightController

export const generatePnrFlightController = async (req, res) => {
  try {
    const pnrs = await ctmFlightModel.find();

    if (!pnrs || pnrs.length === 0) {
      return res.statu(200).send({ message: "No PNRs found" });
    }

    res.status(200).send({
      success: true,
      message: "PNRs generated successfully",
      pnrs,
    });
  } catch (error) {
    console.error("Error generating PNRs:", error);
    res.status(200).send({ message: "Internal server error" });
  }
};

export const updateProviderController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { provider } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.provider = provider;
    booking.pnrStatus = "pending";
    await booking.save();

    res.status(200).send({
      success: true,
      message: "provder updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateBidStatusController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { ticketmco, adminAuthorize, bidStatus } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.ticketmco = ticketmco;
    booking.adminAuthorize = adminAuthorize;
    booking.bidStatus = bidStatus;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateItineraryController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      airline,
      flight,
      from,
      to,
      departure,
      arrival,
      cabinClass,
      alLocator,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.airline = airline;
    booking.flight = flight;
    booking.from = from;
    booking.to = to;
    booking.departure = departure;
    booking.arrival = arrival;
    booking.class = cabinClass;
    booking.alLocator = alLocator;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};
export const updatePriceController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { baseFare, taxes, totalAmount, currency } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.baseFare = baseFare;
    booking.taxes = taxes;
    booking.totalAmount = totalAmount;
    booking.currency = currency;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateChargingController = async (req, res) => {
  try {
    console.log("updateProviderController...");
    console.log("Request Params:", req.params);

    const { flightId } = req.params;
    const {
      chargingBaseFare,
      chargingStatus,
      chargedOn,
      chargedBy,
      chargingTaxes,
      chargingTaxStatus,
      chargingTaxchargedOn,
      chargingTaxchargedBy,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);
    if (booking) {
      console.log(booking);
    }

    booking.chargingBaseFare = chargingBaseFare;
    booking.chargingStatus = chargingStatus;
    booking.chargedOn = chargedOn;
    booking.chargedBy = chargedBy;
    booking.chargingTaxes = chargingTaxes;
    booking.chargingTaxStatus = chargingTaxStatus;
    booking.chargingTaxchargedOn = chargingTaxchargedOn;
    booking.chargingTaxchargedBy = chargingTaxchargedBy;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updatePassengerController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      detailsType,
      firstName,
      middleName,
      lastName,
      gender,
      dob,
      ticketNumber,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.detailsType = detailsType;
    booking.firstName = firstName;
    booking.middleName = middleName;
    booking.lastName = lastName;
    booking.gender = gender;
    booking.dob = dob;
    booking.ticketNumber = ticketNumber;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateBillingController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      cardType,
      cchName,
      cardNumber,
      cvv,
      expiry,
      email,
      billingNumber,
      billingAddress1,
      billingAddress2,
      city,
      state,
      country,
      pinCode,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.cardType = cardType;
    booking.cchName = cchName;
    booking.cardNumber = cardNumber;
    booking.cvv = cvv;
    booking.expiry = expiry;
    booking.email = email;
    booking.billingNumber = billingNumber;
    booking.billingAddress1 = billingAddress1;
    booking.billingAddress2 = billingAddress2;
    booking.city = city;
    booking.state = state;
    booking.pinCode = pinCode;
    booking.country = country;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateRefundController = async (req, res) => {
  try {
    console.log("updateProviderController...");
    console.log("Request Params:", req.params);

    const { flightId } = req.params;
    const { amount, refundRequestedOn, reasonForRefund, refundStatus } =
      req.body;
    const booking = await ctmFlightModel.findById(flightId);
    if (booking) {
      console.log(booking);
    }

    booking.amount = amount;
    booking.refundRequestedOn = refundRequestedOn;
    booking.reasonForRefund = reasonForRefund;
    booking.refundStatus = refundStatus;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

export const updateChargeBackController = async (req, res) => {
  try {
    const { flightId } = req.params;
    const {
      chargeAmount,
      chargebackDate,
      reasonForChargeback,
      chargebackStatus,
    } = req.body;
    const booking = await ctmFlightModel.findById(flightId);

    booking.chargeAmount = chargeAmount;
    booking.chargebackDate = chargebackDate;
    booking.reasonForChargeback = reasonForChargeback;
    booking.chargebackStatus = chargebackStatus;

    await booking.save();

    res.status(200).send({
      success: true,
      message: "Bid status updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error),
      res.status(200).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
  }
};

const translations = {
  en: {
    greeting: "Dear",
    thanks:
      "Thank you for choosing Couper Travels for your flight ticket change.",
    review: "Please take a moment to review your booking details.",
    team: "Best Regards, Your Couper Travels Team",
    congrats: "Congratulations! Your flight has been changed.",
    airlineLocator: "Airline Locator",
    bookingReference: "Booking Reference",
    bookingDate: "Booking Date",
    billingDetails: "Billing Details",
    email: "Email",
    phone: "Phone",
    card: "Card",
    flightSummary: "Flight Summary",
    airline: "Airline",
    from: "From",
    to: "To",
    departure: "Departure",
    arrival: "Arrival",
    footer:
      "© Couper Travels. All rights reserved. For more information, visit our website or contact us at",
    translate: "Translate to Spanish",
  },
  es: {
    greeting: "Estimado",
    thanks:
      "Gracias por elegir a Couper Travels para cambiar su boleto de avión.",
    review:
      "Por favor, tómese un momento para revisar el resumen de su reserva.",
    team: "Gracias, Equipo de Couper Travels",
    congrats: "¡Felicidades! Su vuelo ha sido cambiado.",
    airlineLocator: "Localizador de Aerolínea",
    bookingReference: "Referencia de Reserva",
    bookingDate: "Fecha de Reserva",
    billingDetails: "Detalles de Facturación",
    email: "Correo Electrónico",
    phone: "Teléfono",
    card: "Tarjeta",
    flightSummary: "Resumen del Vuelo",
    airline: "Aerolínea",
    from: "Desde",
    to: "Hasta",
    departure: "Salida",
    arrival: "Llegada",
    footer:
      "© Couper Travels. Todos los derechos reservados. Para más información, visite nuestro sitio web o contáctenos en",
    translate: "Traducir al inglés",
  },
};

const translateContent = (language, key) =>
  translations[language][key] || translations["en"][key];

const generateEmailTemplate = (flightDetails, language) => {
  // Determine the opposite language for translation
  const oppositeLang = language === "en" ? "es" : "en";
  const oppositeLangLabel =
    language === "en"
      ? translations["en"].translate
      : translations["es"].translate;

  // Use the same URL, just change the lang param, and do not set target="_blank" (no new tab)
  // const translateUrl = `http://localhost:8000/api/v1/ctmFlights/update-send-mail-invoice-details/${flightDetails._id}?lang=${oppositeLang}`;
  // <div style="margin: 20px 0;">
  //   <a
  //     href="${translateUrl}"
  //     style="background: #125B88; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;"
  //   >
  //     ${oppositeLangLabel}
  //   </a>
  // </div>;

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">

   
      <div style="background-color: #083d77; color: #fff; padding: 20px; text-align: center;">
        <img src="https://via.placeholder.com/120" alt="Logo" style="width: 120px; margin-bottom: 10px;" />
        <h4 style="margin: 0; font-size: 16px;">Reserve online or call us 24/7</h4>
        <p>+1-888-209-3035</p>
      </div>
      <div style="padding: 20px;">
        <h3>${translateContent(language, "greeting")} ${
    flightDetails.firstName
  } ${flightDetails.lastName},</h3>
        <h4>${translateContent(language, "thanks")}</h4>
        <p style="font-size: 16px; line-height: 1.5;">${translateContent(
          language,
          "review"
        )}</p>
        <h3>${translateContent(language, "team")}</h3>
      </div>
      <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>${translateContent(language, "congrats")}</strong></p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "airlineLocator"
            )}</th>
            <td style="padding: 8px;">${flightDetails.alLocator}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "bookingReference"
            )}</th>
            <td style="padding: 8px;">${flightDetails.bookingId}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "bookingDate"
            )}</th>
            <td style="padding: 8px;">${new Date(
              flightDetails.createdAt
            ).toLocaleDateString()}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h4>${translateContent(language, "billingDetails")}</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "email"
            )}</th>
            <td style="padding: 8px;">${flightDetails.email}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "phone"
            )}</th>
            <td style="padding: 8px;">${flightDetails.billingPhoneNumber}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "card"
            )}</th>
            <td style="padding: 8px;">xxxx-xxxx-xxxx-${
              flightDetails.cardNumber?.slice(-4) || ""
            }</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
        <h4>${translateContent(language, "flightSummary")}</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "airline"
            )}</th>
            <td style="padding: 8px;">${flightDetails.airline}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "from"
            )}</th>
            <td style="padding: 8px;">${flightDetails.from}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "to"
            )}</th>
            <td style="padding: 8px;">${flightDetails.to}</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "departure"
            )}</th>
            <td style="padding: 8px;">${
              flightDetails.departure
                ? new Date(flightDetails.departure).toLocaleString()
                : ""
            }</td>
          </tr>
          <tr>
            <th style="text-align: left; padding: 8px;">${translateContent(
              language,
              "arrival"
            )}</th>
            <td style="padding: 8px;">${
              flightDetails.arrival
                ? new Date(flightDetails.arrival).toLocaleString()
                : ""
            }</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f3f3f3; padding: 10px; text-align: center; font-size: 14px;">
        <p>${translateContent(
          language,
          "footer"
        )} <a href="mailto:support@example.com" style="color: #046c9a;">support@example.com</a>.</p>
      </div>
      
    </div>
  `;
};

export const updateSendMailInvoiceController = async (req, res) => {
  try {
    const { flightId } = req.params;
    // Accept language from either body or query for translation link support
    const language = req.body.language || req.query.lang || "en";

    // Fetch the booking details from the database
    const booking = await ctmFlightModel.findById(flightId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update and save booking details
    booking.language = language;
    await booking.save();

    // Generate the email content
    const emailContent = generateEmailTemplate(booking, language);

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: booking.email,
      subject: "Booking Invoice Update",
      html: emailContent,
    });

    return res.status(200).json({
      success: true,
      message: "Booking updated and email sent successfully",
      booking,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
