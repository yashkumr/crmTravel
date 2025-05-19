import flightModel from '../models/flightModel.js';
import hotelModel from '../models/hotelModel.js';

export default function setupRealTime(io) {
    const changeStream = flightModel.watch();
    const changeStreamHotel = hotelModel.watch();

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
        
    changeStreamHotel.on('change', async(change)=>{

        if(change.operationType === 'insert'){
            const newHotel = change.fullDocument;

            try{
                //Save the real-time data with the default status in the database
                const updatedHotel = await hotelModel.findByIdAndUpdate(
                    newHotel._id,
                    { status:'newBooking'},
                    {new : true}
                );

                //emit the updated data
                io.emit('newHotelAdded',{
                    success:true,
                    message:'New hotel data added with status',
                    data:updatedHotel
                })

            }catch(error){
                console.error("Error updating hotel status:",error);

                //Optionally, emit and error event
                io.emit('error',{
                    success:false,
                    message:"Failed to update hotel status",
                    error:error.message,
                })
            }
        }
    })

}
