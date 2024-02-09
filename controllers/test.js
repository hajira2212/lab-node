const asyncHandler = require("../middleware/async");
const Test = require("../models/Test");
const ErrorResponse = require("../utils/errorResponse");
var mongoose = require('mongoose');



//@route  POST api/test
//@access Private
exports.createTest = asyncHandler(async (req, res, next) => {

  let query;
  const queryStr = JSON.stringify({
    testName: req.body.testName
  });

  query = Test.find(JSON.parse(queryStr));
  let test = await query;
  if (test.length > 0) {

    return res.status(201).json({ success: false, data: "Test already exist, try with another name." });
  } else {
    let test = await Test.create(req.body);
    return res.status(201).json({ success: true, data: test });
  }
});

