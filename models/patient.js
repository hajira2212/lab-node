const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const patientSchema = new mongoose.Schema({
    
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    Images: [
        {
            imageUrl: {
                type: String
            },
            imageDescription: {
                type: String
            }
        }
    ],
    gender: {
        type: String,
        require: true
    },
    age: {
        type: String,
        require: true
    },
    height: {
        type: String,
        require: true
    },
    weight: {
        type: String,
        require: true
    },
    bp: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    contactNo: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },    
    
    createAt:{
        type: Date,
        default: Date.now,
        require: true
    },
    updatedAt:{
        type: Date,
        default: Date.now,
        require: true
    },
    isActive:{
        type: Boolean,
        require: true
    },
});

module.exports = Patient = mongoose.model('patient', patientSchema);