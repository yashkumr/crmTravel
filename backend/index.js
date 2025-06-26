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
import packageRoutes from './routes/packageRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import ctmFlightRoutes from './routes/ctmFlightRoutes.js';
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
    app.use("/api/v1/package", packageRoutes);
    app.use("/api/v1/business", businessRoutes);
    app.use("/api/v1/ctmFlights", ctmFlightRoutes);

    // Socket.io Event Handling
    io.on('connection', (socket) => {

        console.log(`Socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });


    setupRealTime(io);

    const PORT = process.env.PORT || 8080;

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