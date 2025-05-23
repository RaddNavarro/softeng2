const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");

const User = require("../../models/Users");

// @route       GET api/auth
// @desc        Test route
// @access      Public

router.get("/", auth, async (req, res) => {
  try {
    // fetching data from database only getting the email
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/auth
// @desc        Authenticate user log in & get token
// @access      Public

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Passwordd is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See IF users exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      // expiresIn change it back to 3600 when in production
      jwt.sign(
        payload,
        config.get("jwtUsersToken"),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    // fetching data from database only getting the email
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/auth/updateUsers
// @desc        Authenticate user log in & get token
// @access      Public

router.post("/updateUsers", auth, async (req, res) => {
  try {
    // See IF users exists
    let user = await User.findById(req.user.id);

    if (user) {
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { hasLoggedIn: true },
        { new: true }
      );
      console.log(user);
      return res.json(user);
    } else {
      return res.json({ msg: "Empty" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
