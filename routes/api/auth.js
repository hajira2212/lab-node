const express = require("express");
const router = express.Router();
// const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { postUser, login, getUser, admin } = require("../../controllers/auth");

const { protect } = require('../../middleware/auth');

//@route  GET api/auth
//@access Public
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
     res.status(500).json({ msg: "server error" });
  }
});

//@route  POST api/auth
//@access Public
router.post(
    "/",
    [
      check("email", "Email is not valid.").isEmail(),
      check("password", "Password is required").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: [{ msg: "Invalid credentials" }] });
        }
       
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: [{ msg: "Invalid credentials" }] });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };
  
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          {
            expiresIn: 36000,
          },
          (err, token) => {
              if(err) throw err;
              var userObj = user.toObject();
              delete userObj.password;
              userObj.token = token;
              res.json({ users : userObj});
          }
        );

      //   res.send(user);
      } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
      }
    }
  );

  router.post('/login', login).post('/admin', admin).post('/register', postUser);
  router.get('/user', protect, getUser);
  // router.get
  
module.exports = router;
