
import express from "express";
import { 
  createUser, 
  deleteUser, 
  getAllUsers, 
  getSingleUser, 
  updateUser ,
  loginUser,
  loginWithGoogle
} from "../controllers/userController.js";
import { userPhotoMulter } from "../utilis/multer.js";
import verifyToken from "../middlewares/verifyToken.js";


// init router from exxpress
const router = express.Router(); 


// routing
router.get("/", getAllUsers); 
router.post("/register", userPhotoMulter, createUser); 
router.post("/login", loginUser); 
router.post("/authwithgoogle", loginWithGoogle); 

router
.route("/:id")
.delete(deleteUser)
.patch(userPhotoMulter, verifyToken, updateUser)
.get(getSingleUser); 

// export default
export default router; 
