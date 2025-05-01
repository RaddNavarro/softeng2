const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult, body } = require("express-validator");

const Profile = require("../../models/Profile");
const Users = require("../../models/Users");

// @route       GET api/profile/me
// @desc        Get current users profile
// @access      Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["email"]
    );

    if (!profile) {
      return res.json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/profile
// @desc        Create or update user profile
// @access      Private

router.post(
  "/",
  [
    auth,
    [
      check("firstName", "First Name is required").not().isEmpty(),
      check("lastName", "Last Name is required").not().isEmpty(),
      check("collegeDepartment", "College Department is required")
        .not()
        .isEmpty(),
      check("yearLvl", "Year Level is required").not().isEmpty(),
      // check("orgStatus.*.orgName", " Org name is required").not().isEmpty(),
      // check("orgStatus.*.orgRole", " Org role is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      contactNum,
      bio,
      collegeDepartment,
      yearLvl,
      orgStatus,
    } = req.body;

    // const {
    //   orgStatus: [{ orgName, orgRole }],
    // } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (firstName) profileFields.firstName = firstName;
    if (lastName) profileFields.lastName = lastName;
    if (collegeDepartment) profileFields.collegeDepartment = collegeDepartment;
    if (orgStatus) profileFields.orgStatus = orgStatus;
    if (yearLvl) profileFields.yearLvl = yearLvl;
    profileFields.contactNum = contactNum;
    profileFields.bio = bio;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update profile

        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile.populate("orgStatus.orgID"));
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET api/profile
// @desc        Get all profiles
// @access      Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/profile/user/:user_id
// @desc        Get by user ID
// @access      Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name"]);

    if (!profile) {
      return res.json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);

    if (error.kind == "ObjectId") {
      return res.json({ msg: "Profile not found" });
    }

    res.status(500).send("Server error");
  }
});

module.exports = router;
