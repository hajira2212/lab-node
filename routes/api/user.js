const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { allUsers, updateUser,updateUserById } = require("../../controllers/user");
const { protect } = require("../../middleware/auth");


router.route("/").get(protect, allUsers);

router.route("/edit/:id").put(protect, updateUser);

router.route("/edit/account").post(protect, updateUserById);

module.exports = router;