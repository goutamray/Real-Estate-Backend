
import asyncHandler from "express-async-handler"; 
import User from "../models/User.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
 * @DESC User Login
 * @ROUTE /api/v1/user/login
 * @method POST
 * @access public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password)
    return res.status(404).json({ message: "All fields are required" });

  // find login user by email
  const loginUser = await User.findOne({ email });

  // user not found
  if (!loginUser) return res.status(404).json({ message: "User not found" });

  // password check
  const passwordCheck = await bcrypt.compare(password, loginUser.password);

  // password check
  if (!passwordCheck)
    return res.status(404).json({ message: "Wrong password" });

  // create access token
  const token = jwt.sign(
    { email: loginUser.email },
    process.env.USER_LOGIN_SECRET,
    {
      expiresIn: "365d",
    }
  );


  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    token,
    user: loginUser,
    message: "User Login Successful",
  });
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
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      console.log('User not found:', id);
      return res.status(404).json({ message: "User not found" });
    }

    // Handle photo upload if file is provided
    let filedata = existingUser.photo;  // Keep existing photo if no new file is uploaded
    if (req.file) {
      const data = await fileUploadToCloud(req.file.path); // Upload new photo
      filedata = data.secure_url;  // Update filedata with new uploaded photo URL
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name || existingUser.name,     // Use new name or keep the old one
        email: email || existingUser.email,  // Use new email or keep the old one
        photo: filedata,  // Use the updated photo URL or keep the existing one
      },
      { new: true }  // Return the updated user document
    );

    res.status(200).json({ updatedUser, message: "User data updated successfully" });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}); 



/**
 * @DESC GOOGLE AUTHENTICATION
 * @METHOD GET
 * @ROUTE /api/v1/user/authwithgoogle
 * @ACCESS PUBLIC 
 * 
 */
export const loginWithGoogle = async (req, res) => {
  const { name, email, password, photo } = req.body; 

  try {
      // Check user
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
         const result = await User.create({
          name : name,
          email : email, 
          photo : photo,
          password : password,
         })

         const token = jwt.sign({ 
          email : result.email, 
          id: result._id 
        }, process.env.USER_LOGIN_SECRET); 
        
        return res.status(200).send({ user : result, token : token, msg : "User Login Successfull"}); 

      }else{
         // Check user
          const existingUser = await User.findOne({ email: email });
          const token = jwt.sign({ 
            email : existingUser.email, 
            id: existingUser._id 
          }, process.env.USER_LOGIN_SECRET); 

          return res.status(200).send({ user : existingUser, token : token, msg : "User Login Successfull"}); 
      }

  } catch (error) {
     console.log(error);
  }
}


