import express from 'express';
import dotenv from "dotenv";
import colors from "colors";
import bodyParser from 'body-parser';
import cors from "cors";
import morgan from 'morgan';
import connectDB from "./config/connectDB.js";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';




dotenv.config();

const app = express();
connectDB();
// Bodyparser middleware    
app.use(bodyParser.urlencoded({ extended:false }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());



app.use("/api/v1/auth", authRoutes);

app.use("/", (req, res)=>{
    res.send("Welcome");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`.bgCyan.white);
})