import flightModel from "../models/flightModel.js";
import hotelModel from "../models/hotelModel.js";
import User from "../models/User.js";

export default function setupRealTime(io) {
  const changeStream = flightModel.watch();
  const changeStreamHotel = hotelModel.watch();
  const userChangeStream = User.watch();

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const newFlight = change.fullDocument;

      try {
        const updatedFlight = await flightModel.findByIdAndUpdate(
          newFlight._id,
          { status: "newBooking" },
          { new: true }
        );

        io.emit("newFlightAdded", {
          success: true,
          message: "New flight data added with status",
          data: updatedFlight,
        });
      } catch (error) {
        console.error("Error updating flight status:", error);
        io.emit("error", {
          success: false,
          message: "Failed to update flight status",
          error: error.message,
        });
      }
    }
  });

  changeStreamHotel.on("change", async (change) => {
    if (change.operationType === "insert") {
      const newHotel = change.fullDocument;

      try {
        const updatedHotel = await hotelModel.findByIdAndUpdate(
          newHotel._id,
          { status: "newBooking" },
          { new: true }
        );

        io.emit("newHotelAdded", {
          success: true,
          message: "New hotel data added with status",
          data: updatedHotel,
        });
      } catch (error) {
        console.error("Error updating hotel status:", error);
        io.emit("error", {
          success: false,
          message: "Failed to update hotel status",
          error: error.message,
        });
      }
    }
  });

  // Real-time OTP insert or update
  userChangeStream.on("change", async (change) => {
    // For insert (new user with OTP)
    if (change.operationType === "insert" && change.fullDocument.otp) {
      io.emit("otpInserted", {
        success: true,
        message: "OTP inserted for new user",
        data: change.fullDocument,
      });
    }

    // For update (existing user's OTP updated)
    if (
      change.operationType === "update" &&
      change.updateDescription.updatedFields["otp"]
    ) {
      try {
        const updatedUser = await User.findById(change.documentKey._id);
        io.emit("otpUpdated", {
          success: true,
          message: "OTP updated for user",
          data: updatedUser,
        });
      } catch (error) {
        console.error("Error emitting OTP update:", error);
        io.emit("error", {
          success: false,
          message: "Failed to emit OTP update",
          error: error.message,
        });
      }
    }
  });
}
