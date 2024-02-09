const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const testSchema = new mongoose.Schema({
    
    testName: {
        type: String,
        require: true,
        unique: true
    },
    testLevel: {
        type: String,
        require: true,      
    },
    description: {
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

module.exports = Test = mongoose.model('test', testSchema);