import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors" ;
import cookieParser from "cookie-parser";

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



// app listen 
app.listen(PORT, () => {
  // mongoDbConnect(),
  console.log(` Server is running on port ${PORT} `.bgGreen.black);
}); 




