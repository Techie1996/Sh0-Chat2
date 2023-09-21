const jwt = require('jsonwebtoken');
const User = require("../Models/userModel.js");
const asyncHandler = require('express-async-handler');

const protect =asyncHandler(async (req,res,next) => {
   let token;

   if(
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
   ) {
    try{
     token =req.headers.authorization.split(" ")[1];

     //decodes the id
     const decoded = jwt.verify(token, process.env.JWT_SECRET);

     req.user = await User.findById(decoded.id).select("-password");
     next();
    }
    catch(error){
     res.status(401);
     //console.log("Not authorized, token failed Accordingly");
     throw new Error("Not authorized, token failed Accordingly");
    }
   }

   if(!token){
    res.status(401);
     throw new Error("Not authorized, no token exists ");
   }
});

module.exports = { protect };
