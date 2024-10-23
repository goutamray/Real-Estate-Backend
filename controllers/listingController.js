

import asyncHandler from "express-async-handler"; 
import Listing from "../models/Listing.js"; 
import { fileDeleteFromCloud, fileUploadToCloud } from "../utilis/cloudinary.js";
import { findPublicId } from "../helpers/helpers.js";

/**
 * @DESC GET ALL LISTING
 * @METHOD GET
 * @ROUTE /api/v1/listing
 * @ACCESS PUBLIC 
 * 
 */
export const getAllListing = asyncHandler(async(req, res) => {
   // get all listing 
    const listing = await Listing.find(); 
      
   // check listing data 
   if ( !listing) {
      return res.status(404).json({ listings : "", message : "Listing Not Found"});
   }; 

  res.status(200).json({ listing, message : "All Listing data"});
});  


/**
 * @DESC GET ALL SEARCH LISTING
 * @METHOD GET
 * @ROUTE /api/v1/listing/get
 * @ACCESS PUBLIC 
 * 
 */
export const getAllSearchListing = asyncHandler(async(req, res) => {
  try {
     const limit = parseInt(req.query.limit) || 9;
     const startIndex = parseInt(req.query.startIndex) || 0;

     // check furnished 
     let furnished = req.query.furnished;

     if (furnished === undefined || furnished === "false") {
       furnished = { $in : [false, true] };
     }

     // check parking 
     let parking = req.query.parking;

     if (parking === undefined || parking === "false") {
       parking = { $in : [false, true] };
     }

     // check type
     let type = req.query.type;

     if (type === undefined || type === "all") {
       type = { $in : ["sell", "rent"] };
     }

    const searchTerm = req.query.searchTerm || "";

    const listing = await Listing.find({
       name: { $regex: searchTerm, $options: "i" },
       furnished,
       parking,
       type
    }).limit(limit).skip(startIndex);

    return res.status(200).json({ listing });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Server error" });
  }
});




/**
 * @DESC GET SINGLE LISTING
 * @METHOD GET
 * @ROUTE /api/v1/listing/:id
 * @ACCESS PUBLIC 
 * 
 */
export const getSingleListing = asyncHandler(async(req, res) => {
  // get params 
  const { id } = req.params;

  // find single listing
  const listing = await Listing.findById(id); 
 
  // check single user 
  if (!listing) {
     return res.status(404).json({ message : "Single Listing Data Not Found"});
  }

  res.status(200).json({ listing, message : "Single Listing Data"});
});  

/**
 * @DESC CREATE NEW LISTING 
 * @METHOD POST
 * @ROUTE /api/v1/listing/create
 * @ACCESS PUBLIC 
 * 
 */
export const createListing = asyncHandler(async(req, res) => {
  // get form data 
  const { name, description, address, regularPrice, discountPrice, bedRoom, bathRoom, furnished, parking, type, offer, userRef, size } = req.body;

  // validation 
  if (!name || !description || !address) {
    return res.status(400).json({ listing : "", message : "All fileds are required"});
  };


    // Handle multiple file uploads
    let filedata = [];
      if (req.files && req.files.length > 0) {
          for (const file of req.files) {
              const data = await fileUploadToCloud(file.path);
              filedata.push(data.secure_url);
          }
      }

  // create listing 
  const listing = await Listing.create({ 
    name, description, address, regularPrice, discountPrice, bedRoom, bathRoom, furnished, parking, type, offer, userRef, size, 
    photo : filedata, 
  });

  res.status(201).json({ listing, message : "Listing Created Successfull", });
});  


/**
 * @DESC DELETE LISTING 
 * @METHOD DELETE
 * @ROUTE /api/v1/listing/:id
 * @ACCESS PUBLIC 
 * 
 */
export const deleteListing = asyncHandler(async(req, res) => {
  // get params 
  const { id } = req.params;

  // delete listing data 
  const listing = await Listing.findByIdAndDelete(id);

  // delete cloud file
   await fileDeleteFromCloud(findPublicId(listing.photo));  

  // response  
  res.status(200).json({ listing, message : "Listing deleted successfull"});
});  



/**
 * @DESC UPDATE LISTING
 * @METHOD PUT / PATCH
 * @ROUTE /api/v1/listing/:id 
 * @ACCESS PUBLIC 
 * 
 */
export const updateListing = asyncHandler(async(req, res) => {
  // get params 
  const { id } = req.params;

   // get form data 
   const { name, description, address, regularPrice, discountPrice, bedRoom, bathRoom, furnished, parking, type, offer,size, userRef } = req.body;

  // Fetch the existing product
  const listing = await Listing.findById(id);
  if (!listing) {
      return res.status(404).json({ message: "Listing Not Found" });
  }
  
  // Handle multiple file uploads (if any)
  let filedata = listing.photo; 
  if (req.files && req.files.length > 0) {
        filedata = [];
        for (const file of req.files) {
          const data = await fileUploadToCloud(file.path);
          filedata.push(data.secure_url);
        }
    }


   // update listing
   const listingUpdate = await Listing.findByIdAndUpdate(
    id, 
    { name, description, address, regularPrice, discountPrice, bedRoom, bathRoom, furnished, parking, type, offer, size, userRef, photo : filedata}, 
    {new : true});  

   return res.status(200).json({ listingUpdate,  message : "Listing Updated Successfull"}); 
}); 





