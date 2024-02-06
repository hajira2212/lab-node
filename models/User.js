const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password:{
            type: String,
            require: true,
            minlength: 6,
            select: false
    },
    mobileNo: {
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
    role:{
        type: String,
        enum:['super-admin','admin', 'user','manager'],
        default: 'user',
        require: true
    },
    isActive:{
        type: Boolean,
        require: true
    },
    resetPasswordToken: {type: String},
    resetPasswordExpiry: {type: Date}
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = User = mongoose.model('user', userSchema);