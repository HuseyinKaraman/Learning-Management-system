import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../constants/environment";

export class CustomError extends Error {
    statusCode: Number;
    isOperational: Boolean;
    constructor(message: any, statusCode: Number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const devErrors = (error:any, res:Response) => {
    console.log('Error: ', error);
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stack: error.stack,
        error
    });
};

const prodErrors = (error:any, res:Response) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        console.log('Error: ', error);
        res.status(500).json({
            status: 500,
            message: 'Something went wrong'
        });
    }
};

const handleCastError = (error:any) => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new CustomError(message, 400);
};

const handleDuplicateError = (error:any) => {
    const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new CustomError(message, 400);
};

const handleValidationError = (error:any) => {
    const errors = Object.values(error.errors).map((el:any) => el?.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new CustomError(message, 400);
};

const jsonWebTokenHandler = (error:any) => {
    const message = `Json web token is invalid, try again`;
    return new CustomError(message, 400);
};

const jwtExpiredHandler = (error:any) => {
    const message = `Json web token is expired, try again`;
    return new CustomError(message, 400);
};


export const globalErrorHandler = (error:any, req:Request, res:Response, next:NextFunction) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    error.message = error.message || 'Internal Server Error';

    if (NODE_ENV === 'development') {
        devErrors(error, res);
    } else if (NODE_ENV === 'production') {
        let err = {...error};
        if (err.name === 'CastError') err = handleCastError(err);
        if (err.code === 11000) err = handleDuplicateError(err);
        if (err.name === 'ValidationError') err = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') err = jsonWebTokenHandler(err);
        if (err.name === 'TokenExpiredError') err = jwtExpiredHandler(err);
        prodErrors(err, res);
    }
};