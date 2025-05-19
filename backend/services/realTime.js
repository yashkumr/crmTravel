import flightModel from '../models/flightModel.js';

export default function setupRealTime(io) {
    const changeStream = flightModel.watch();

    changeStream.on('change', async (change) => {
        if (change.operationType === 'insert') {
            const newFlight = change.fullDocument;

            try {
                // Save the real-time data with the default status in the database
                const updatedFlight = await flightModel.findByIdAndUpdate(
                    newFlight._id, 
                    { status: 'newBooking' }, 
                    { new: true } 
                );

                // Emit the updated data
                io.emit('newFlightAdded', {
                    success: true,
                    message: 'New flight data added with status',
                    data: updatedFlight,
                });
            } catch (error) {
                console.error('Error updating flight status:', error);

                // Optionally, emit an error event
                io.emit('error', {
                    success: false,
                    message: 'Failed to update flight status',
                    error: error.message,
                });
            }
        }
    });
}
