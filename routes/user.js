
import express from "express";
import { 
  createUser, 
  deleteUser, 
  getAllUsers, 
  getSingleUser, 
  updateUser ,
  loginUser
} from "../controllers/userController.js";
import { userPhotoMulter } from "../utilis/multer.js";


// init router from exxpress
const router = express.Router(); 


// routing
router.get("/", getAllUsers); 
router.post("/register", userPhotoMulter, createUser); 
router.post("/login", loginUser); 

router
.route("/:id")
.delete(deleteUser)
.patch(userPhotoMulter, updateUser)
.get(getSingleUser); 

// export default
export default router; 
