
import mongoose from "mongoose";

// create user schema
const userSchema = mongoose.Schema({
  name : {
    type: String,
    trim : true,
  }, 
  email : {
    type : String,
    trim : true, 
    unique : true,
  },
  password : {
    type : String,
    trim : true, 
  },
  phone : {
    type : String,
    trim : true,
    default : null,
  },
  photo : {
    type : String,
    trim : true,
    default : null,
  },
}, 
{
  timestamps : true,
}
); 

// export default schema
export default mongoose.model("User", userSchema)

