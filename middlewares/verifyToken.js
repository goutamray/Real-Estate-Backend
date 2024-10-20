import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"

// create verify token 
const verifyToken = (req, res, next) => {
    // get cookie 
    const accessToken = req.cookies.accessToken;

    // check token
    if (!accessToken) {
      return res.status(400).json({  message : "Unauthorized"}); 
    }; 

    // verify token user
    jwt.verify(accessToken, process.env.USER_LOGIN_SECRET, 
      asyncHandler(async(error, user) => {
         
        if (error) {
           return res.status(400).json({ message : "Invalid Token"})
        }

       // get login user data 
        req.user = user;
        next(); 

      })
      );

  }

// export default 
export default verifyToken;
















