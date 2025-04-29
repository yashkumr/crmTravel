import cluster from 'cluster';
import os from 'os';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectDB.js';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io'; // Updated import for socket.io
import authRoutes from './routes/authRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import flightModel from './models/flightModel.js';
import mongoose from 'mongoose';
import setupRealTime from './services/realTime.js';

dotenv.config();

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;

    console.log(`Master process is running. Forking for ${numCPUs} CPUs.`.bgGreen.white);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Worker ${worker.process.pid} died with code ${code}, signal ${signal}. Forking a new worker.`.bgRed.white);
        cluster.fork();
    });
} else {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*', // Replace with your frontend origin for security
            methods: ['GET', 'POST'],
        },
    });

    connectDB();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(cookieParser());

    // Routes
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/otp', otpRoutes);
    app.use('/api/v1/flights', flightRoutes);
    app.use('/api/v1/hotels', hotelRoutes);

    // Socket.io Event Handling
    io.on('connection', (socket) => {

        console.log(`Socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

   
    // const changeStream = flightModel.watch();

    // changeStream.on('change', (change) => {
    //     console.log(`Change detected in flights collection: ${JSON.stringify(change)}`.bgBlue.white);

    //     if (change.operationType === 'insert') {
    //         const newFlight = change.fullDocument;
            
    //         io.emit('newFlightAdded', {
    //             success: true,
    //             message: 'New flight data added',
    //             data: newFlight,
    //         });
    //     }
    // });

    setupRealTime(io);

    const PORT = process.env.PORT || 5000;

    // Global Error Handlers
    process.on('uncaughtException', (err) => {
        console.error(`Uncaught Exception: ${err.message}`.bgRed.white);
        process.exit(1);
    });

    process.on('SIGTERM', () => {
        console.log(`Worker ${process.pid} is shutting down gracefully.`.bgYellow.white);
        process.exit(0);
    });

    // Start the server
    server.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on port ${PORT}`.bgCyan.white);
    });
} 