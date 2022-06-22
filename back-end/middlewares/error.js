const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal server error"

    //mongodb type error
    if(err.name === 'CastError'){
        const message = `Resource not found invalid : ${err.path}`
        err = new ErrorHandler(message, 400);
    }
    
    //Wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `JSON web token is invalid please try again`
        err = new ErrorHandler(message, 400);
    }

    //Wrong jwt expire error
    if(err.name === "TokenExpiredError"){
        const message = `JSON web token is expired please try again`
        err = new ErrorHandler(message, 400);
    }

    //duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}