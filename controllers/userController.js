
import asyncHandler from "express-async-handler"; 
import User from "../models/User.js"; 
import bcrypt from "bcrypt";
import { fileDeleteFromCloud, fileUploadToCloud } from "../utilis/cloudinary.js";
import { findPublicId, isEmail } from "../helpers/helpers.js";


/**
 * @DESC GET ALL USER 
 * @METHOD GET
 * @ROUTE /api/v1/user
 * @ACCESS PUBLIC 
 * 
 */
export const getAllUsers = asyncHandler(async(req, res) => {
   // get all users 
    const users = await User.find(); 
      
   // check users data 
   if ( !users) {
      return res.status(404).json({ users : "", message : "Users Not Found"});
   }; 

  res.status(200).json({ users, message : "All users data"});
});  


/**
 * @DESC GET SINGLE USER 
 * @METHOD GET
 * @ROUTE /api/v1/user/:id
 * @ACCESS PUBLIC 
 * 
 */
export const getSingleUser = asyncHandler(async(req, res) => {
    // get params 
    const { id } = req.params;

    // find single user
    const user = await User.findById(id); 
   
    // check single user 
    if (!user) {
       return res.status(404).json({ message : "Single User Data Not Found"});
    }
  
    res.status(200).json({user : user, message : "Single User Data"});
});  

/**
 * @DESC CREATE NEW USER 
 * @METHOD POST
 * @ROUTE /api/v1/user
 * @ACCESS PUBLIC 
 * 
 */
export const createUser = asyncHandler(async(req, res) => {
  // get form data 
  const { name, email, password } = req.body;

  // validation 
  if (!name || !email || !password) {
    return res.status(400).json({ users : "", message : "All fileds are required"});
  };

  // hash password 
  const hassPass = await bcrypt.hash(password, 10); 

  // check valid email 
  if (!isEmail(email)) {
    return res.status(400).json({users : "", message : "Invalid Email Address"});
  };
 

  // check email existance
   const emailCheck = await User.findOne({ email });

  if (emailCheck) {
     return res.status(400).json({ users : "", message : "Email Already Exisits"});
  };


   // photo manage 
   let filedata = null;

   if(req.file){
    const data = await fileUploadToCloud(req.file.path)
    filedata = data.secure_url;
   }; 

  // create user 
  const user = await User.create({ 
    name, 
    email, 
    password : hassPass, 
    photo : filedata, 
  });

  res.status(201).json({ user, message : "User Created Successfull", });
});  


/**
 * @DESC DELETE USER 
 * @METHOD DELETE
 * @ROUTE /api/v1/user/:id
 * @ACCESS PUBLIC 
 * 
 */
export const deleteUser = asyncHandler(async(req, res) => {
   // get params 
   const { id } = req.params;

   // delete user data 
   const user = await User.findByIdAndDelete(id);

   // delete cloud file
    await fileDeleteFromCloud(findPublicId(user.photo));  

   // response  
   res.status(200).json({ user, message : "User deleted successfull"});
});  

/**
 * @DESC UPDATE USER 
 * @METHOD UPDATE
 * @ROUTE /api/v1/user/:id
 * @ACCESS PUBLIC 
 * 
 */
export const updateUser = asyncHandler(async(req, res) => {
   // get params data
   const { id } = req.params;

   // get body data
   const { name, email } = req.body; 

   // check valid email 
    if (!isEmail(email)) {
      return res.status(400).json({users : "", message : "Invalid Email Address"});
    };
   

    // update user 
    const updateUser = await User.findByIdAndUpdate(id, { name, email }, {new : true});

    // response 
     res.status(200).json({ user : updateUser, message : "User Data updated Successfull"});
});  

