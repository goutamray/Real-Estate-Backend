

import express from "express";
import { 
  createListing, 
  deleteListing, 
  getAllListing, 
  getSingleListing, 
  updateListing ,
  getAllSearchListing
} from "../controllers/listingController.js";
import { listingPhotoMulter } from "../utilis/multer.js";



// init router from exxpress
const router = express.Router(); 


// routing
router.get("/", getAllListing); 
router.get("/get", getAllSearchListing); 
router.get("/:id", getSingleListing); 
router.post("/create", listingPhotoMulter, createListing); 
router.patch("/:id", listingPhotoMulter, updateListing); 
router.delete("/:id", deleteListing); 


// export default
export default router; 













