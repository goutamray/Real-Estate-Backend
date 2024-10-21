
import multer from "multer";

// multer setup 
const storage = multer.diskStorage({
  filename : (req, file, cb) => {
    cb(null, Date.now() + "_" + file.fieldname);
  }
});

// multer middleware 
export const userPhotoMulter = multer({ storage }).single("photo"); 
export const listingPhotoMulter = multer({ storage }).array("photo", 6); 


