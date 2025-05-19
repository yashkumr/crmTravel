import flightModel from "../models/flightModel.js";
import hotelModel from "../models/hotelModel.js";
import User from "../models/User.js";
import moment from "moment"
import nodemailer from 'nodemailer';



// Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD 
//   },
// });
const adminEmailMapping = {
  "webUrl1": {
    email: "vimleshkumarvimlesh63@gmail.com",
    password: "sinv xric rxoq mxju",
  },
  "webUrl2": {
    email: "gadscampaignleads@gmail.com",
    password: "qjpn ahdv ddvx ucys",
  },
  // "webUrl3": {
  //   email: "admin3@gmail.com",
  //   password: "app_password_3",
  // },

};



export const getFlightController = async (req, res) => {
  try {
    const { startDate, endDate, bookingId } = req.query;

    let filter = {};

    // Filter by date range
    if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) }; // Convert to Date object
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filter.createdAt = {
        ...filter.createdAt,
        $lte: endOfDay,
      };
    }

    // Filter by booking ID
    if (bookingId) {
      filter.bookingId = bookingId;
    }

    const flightData = await flightModel.find(filter).sort({ createdAt: -1 });

    if (flightData.length === 0) {
      return res.status(404).send({ message: 'No flight data found for the given filters.' });
    }

    res.status(200).send({
      success: true,
      message: 'Flight data fetched successfully',
      data: flightData,
      totalCount: flightData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while fetching flight data.' });
  }
};


export const getAllAgentController = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' });
    // const agents = await User.find({ role: 'agent' }).populate('flights');
    res.status(200).send({
      success: true,
      message: 'Agents fetched successfully',
      data: agents,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching agents',
      error: error.message,
    });
  }
}

export const updateFlightStatusController = async (req, res) => {
  

  const { id } = req.params;
  const { status } = req.body;

  try {
    const flight = await flightModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!flight) {
      return res.status(404).json({ success: true, message: 'Flight not found' });
    }
    res.status(200).send({ success: true, message: 'Flight status updated successfully', flight });
  } catch (error) {
    res.status(500).json({ message: 'Error updating flight status', error: error.message });
  }
}

// BookingMailsController

export const BookingMailsController = async (req, res) => {
  try {

    const flightMails = await flightModel.aggregate([
      {
        $project: {
          email: 1,
          mobile: 1,
          webUrl: 1,
          webMail: 1,
          _id: 0,
          type: { $literal: 'Flight' },
        },
      },
    ]);

    const hotelMails = await hotelModel.aggregate([
      {
        $project: {
          email: 1,
          mobile: 1,
          webUrl: 1,
          webMail: 1,
          _id: 0,
          type: { $literal: 'Hotel' },
        },
      },
    ]);


    // Combine results
    const combinedData = [...flightMails, ...hotelMails];

    res.status(200).send({
      success: true,
      message: 'Booking mails fetched successfully',
      combinedData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching booking mails',
      error: error.message,
    });
  }
};

// export const webUrlController = async (req, res) => {
//   try {
//     const { webUrl } = req.body;


//     const flights = await flightModel.find({ webUrl });
//     const hotels = await hotelModel.find({ webUrl });


//     const emailSet = new Set();
//     flights.forEach((flight) => emailSet.add(flight.email));
//     hotels.forEach((hotel) => emailSet.add(hotel.email));

//     const emailPromises = Array.from(emailSet).map(async (email) => {
//       const userFlights = flights.filter((flight) => flight.email === email);
//       const userHotels = hotels.filter((hotel) => hotel.email === email);

//       let emailContent = `Hello,\n\nHere are your booked deals:\n\n`;

//       if (userFlights.length) {
//         emailContent += `Flights:\n`;
//         userFlights.forEach((flight) => {

//           emailContent += `  We hope this message finds you well. This is a gentle reminder regarding your recent flight booking. Below are your booking details:\n\n`;
//         });
//       } else {
//         emailContent += `No flights booked yet.\n`;
//       }

//       if (userHotels.length) {
//         emailContent += `\nHotels:\n`;
//         userHotels.forEach((hotel) => {

//          details:
//           emailContent += `  We hope this message finds you well. This is a gentle reminder regarding your recent Hotel booking. Below are your booking details:\n\n`;
//         });
//       } else {
//         emailContent += `\nNo hotels booked yet.\n`;
//       }

//       emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;


//          console.log("emailContent", emailContent)

//       const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Update on Your Booked Deals',
//         text: emailContent,
//       };

//       return transporter.sendMail(mailOptions);
//     });


//     await Promise.all(emailPromises);

//     res.status(200).send({
//       success: true,
//       message: "Emails sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in flight webUrlController",
//       error: error.message,
//     });
//   }
// };

export const webUrlController = async (req, res) => {
  try {
    const { webUrl, webMail } = req.body;
   
    

    // Find adminConfig by webMail
    const adminConfig = Object.values(adminEmailMapping).find(
      (config) => config.email === webMail
    );

  

    if (!adminConfig) {
      return res.status(400).send({
        success: false,
        message: `Invalid webMail: ${webMail}. No matching configuration found.`,
      });
    }

    // Create transporter with the specific admin email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminConfig.email,
        pass: adminConfig.password,
      },
    });

    // Fetch flights and hotels
    const flights = await flightModel.find({ webUrl });
    const hotels = await hotelModel.find({ webUrl });

    const emailSet = new Set();
    flights.forEach((flight) => emailSet.add(flight.email));
    hotels.forEach((hotel) => emailSet.add(hotel.email));

    // Prepare email promises
    const emailPromises = Array.from(emailSet).map(async (email) => {
      const userFlights = flights.filter((flight) => flight.email === email);
      
      const userHotels = hotels.filter((hotel) => hotel.email === email);

      let emailContent = `Hello,\n\nHere are your booked deals:\n\n`;

      if (userFlights.length) {
        emailContent += `Flights:\n`;
        userFlights.forEach((flight) => {
          emailContent += `  - Flight Booking Details\n`;
        });
      } else {
        emailContent += `No flights booked yet.\n`;
      }

      if (userHotels.length) {
        emailContent += `\nHotels:\n`;
        userHotels.forEach((hotel) => {
          emailContent += `  - Hotel Booking Details\n`;
        });
      } else {
        emailContent += `\nNo hotels booked yet.\n`;
      }

      emailContent += `\nThank you for choosing our service!\n\nBest regards,\nYour Team`;

      const mailOptions = {
        from: adminConfig.email,
        to: email,
        subject: 'Update on Your Booked Deals',
        text: emailContent,
      };

      return transporter.sendMail(mailOptions);
    });

    // Execute all email promises concurrently
    await Promise.all(emailPromises);

    res.status(200).send({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in flight webUrlController",
      error: error.message,
    });
  }
};
