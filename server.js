import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors" ;
import cookieParser from "cookie-parser";
import mongoDbConnect from "./config/mongoDb.js";

import userRouter from "./routes/user.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// initialization 
dotenv.config();
const app = express();  

// invironment var 
const PORT = process.env.PORT || 6060;


// set middleware 
app.use(express.json());
app.use(express.urlencoded({ extended : false}));
app.use(cookieParser());
app.use(cors({
  origin : "http://localhost:3000",
  credentials : true,
}));

// static folder 
app.use(express.static("public"));

// routes 
app.use("/api/v1/user", userRouter); 

// error handler 
app.use(errorHandler);   

// app listen 
app.listen(PORT, () => {
  mongoDbConnect(),
  console.log(` Server is running on port ${PORT} `.bgGreen.black);
}); 




