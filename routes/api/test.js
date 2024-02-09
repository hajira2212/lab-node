const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { createTest} = require("../../controllers/test");
const { protect } = require("../../middleware/auth");


router.route("/").post(protect, createTest);

module.exports = router;