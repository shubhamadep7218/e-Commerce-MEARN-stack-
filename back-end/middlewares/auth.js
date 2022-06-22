const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncError')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


exports.isAunthenticated = catchAsyncErrors( async(req,res,next)=>{
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to access this resorce", 401))
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id);

    next();
})

exports.authorizeRoles = (...roles)=>{
    return (req, res,next) => {

        if( !roles.includes(req.user.role)){
           return next(
            new ErrorHandler(
                `${req.user.role} Role is not access to this resource`,403
            )
           )
        }

        next();

    }
}