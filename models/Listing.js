
import mongoose from "mongoose";

// create user schema
const listingSchema = mongoose.Schema({
  name : {
    type: String,
    trim : true,
  }, 
  description : {
    type : String,
    trim : true, 
  },
  address : {
    type : String,
    trim : true, 
  },
  regularPrice : {
    type : Number,
    default : null,
  },
  discountPrice : {
    type : Number,
    default : null,
  },
  bedRoom : {
    type : Number,
    default : null,
  },
  bathRoom : {
    type : Number,
    default : null,
  },
  furnished : {
    type : Boolean,
    default : false,
  },
  parking : {
    type : Boolean,
    default : false,
  },
  type : {
    type : String,
    default : null,
  },
  offer : {
    type : Number,
    default : null,
  },
  photo : [
    {
      type : String,
      default : null,
    }
  ],
  size : {
    type : String,
    default : null,
  },
  userRef : {
    type : String,
    default : null,
  }
}, 
{
  timestamps : true,
}
); 

// export default schema
export default mongoose.model("Listing", listingSchema)

