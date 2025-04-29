import flightModel from '../models/flightModel.js';

export default function setupRealTime(io) {
    const changeStream = flightModel.watch();

    changeStream.on('change', (change) => {
       

        if (change.operationType === 'insert') {
            const newFlight = change.fullDocument;

            io.emit('newFlightAdded', {
                success: true,
                message: 'New flight data added',
                data: newFlight,
            });
        }
    });
}
