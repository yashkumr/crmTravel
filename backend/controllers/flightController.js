import flightModel from "../models/flightModel.js";
import User from "../models/User.js";
import moment from "moment"

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
    console.log("updateFlightStatusController")

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