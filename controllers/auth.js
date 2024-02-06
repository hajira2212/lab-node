const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.login = asyncHandler(async (req, res, next) => {
    const {email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide all details.', 400));
    }

    let user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials.', 201));
    }
    // console.log(user);
   
    if (!user.isActive) {
        return next(new ErrorResponse('Inactive User.', 201));
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials.', 201));
    }
    sendTokenResponse(user, 200, res);
    // const token = user.getSignedJwtToken();
    // // user = user.select('-password');
    // res.status(200).json({ success: true, user, token})
});

exports.admin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide all details.', 400));
    }

    let user = await User.findOne({ email }).select('+password').populate("company", [
        "company_name",
    ]);

    if (!user) {
        return next(new ErrorResponse('Invalid credentials.', 201));
    }
    if (user.role === 'company-admin' || user.role === 'company-user') {
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials.', 201));
        }
        sendTokenResponse(user, 200, res);
    } else {
        return next(new ErrorResponse('Not Authorized', 201));
    }
    // const token = user.getSignedJwtToken();
    // // user = user.select('-password');
    // res.status(200).json({ success: true, user, token})
});

exports.postUser = asyncHandler(async (req, res, next) => {
    const {name, email, password, mobileNo, role, isActive } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        mobileNo,
        role,
        isActive
    });

    sendTokenResponse(user, 200, res);
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
});


const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    var userObj = user.toObject();
    delete userObj.password;

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({ success: true, token, user: userObj });
}

