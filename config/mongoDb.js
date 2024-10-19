

import mongoose from "mongoose";

// create mongodb connection
const mongoDbConnect = async(req, res) => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(` MongoDB connection Successfully Done `.bgBlue.black);
  } catch (error) {
    console.log(`MongoDB connection Failed`.bgRed.black);
  }
}

// export default connection
export default mongoDbConnect; 
