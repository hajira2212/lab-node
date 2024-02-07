const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcryptjs");
const Temple = require("../models/Temple");

exports.allUsers = asyncHandler(async (req, res, next) => {

    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = User.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createAt');
    }

    let users = await query;

    return res.status(200).json({ success: true, data: users });
});

exports.updateUser = asyncHandler(async (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    //const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let userValue = await User.findById(req.params.id)

    let users = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!users) {
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }
    return res.status(200).json({ success: true, data: users });
});

exports.updateUserById = asyncHandler(async (req, res, next) => {
    let userValue = await User.findById(req.body.id)

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(req.body.password, salt);

    let users = await User.findByIdAndUpdate(req.body.id, { name: req.body.name, password: this.password }, {
        new: true,
        runValidators: true,
    });
    if (!users) {
        return next(new ErrorResponse(`User not found with id ${req.body.id}`, 404));
    }
    return res.status(200).json({ success: true, data: users });
});

