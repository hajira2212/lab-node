const ErrorResponse = require("../utils/errorResponse");

const errorHandler  = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    if(err.name === 'CastError'){
        const message = `Data not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400)
    }
    if(error.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    // console.log(err);
    res.status(error.statusCode || 500).json({ 
        success: false, 
        error: error.message || 'server error'
    })
}

module.exports = errorHandler;