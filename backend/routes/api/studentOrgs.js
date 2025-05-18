const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const StudentOrgs = require("../../models/StudentOrgs");
const Profile = require("../../models/Profile");

// @route       GET api/studentOrgs/me
// @desc        Get current student Org
// @access      Private

router.get("/me", auth, async (req, res) => {
  try {
    const studentOrgs = await StudentOrgs.findOne({
      user: req.user.id,
    }).populate("user", ["email"]);

    if (!studentOrgs) {
      return res.json({ msg: "Student Organzation not found" });
    }

    res.json(studentOrgs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/studentOrgs
// @desc        Create or update studentsOrgs
// @access      Private

router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("collegeDepartment", "College Department is required")
        .not()
        .isEmpty(),
      check("category", "Category is required").not().isEmpty(),
      check("bio", "A short bio is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { name, collegeDepartment, category, bio, description } = req.body;

    //Build studentOrgs object
    const studentOrgsFields = {};
    studentOrgsFields.user = req.user.id;
    if (name) studentOrgsFields.name = name;
    if (category) studentOrgsFields.category = category;
    if (collegeDepartment)
      studentOrgsFields.collegeDepartment = collegeDepartment;
    if (bio) studentOrgsFields.bio = bio;
    studentOrgsFields.description = description;

    try {
      let studentOrgs = await StudentOrgs.findOne({ user: req.user.id });

      if (studentOrgs) {
        // Update studentOrgs

        studentOrgs = await StudentOrgs.findOneAndUpdate(
          { user: req.user.id },
          { $set: studentOrgsFields },
          { new: true }
        );

        return res.json(studentOrgs);
      }

      // Create
      studentOrgs = new StudentOrgs(studentOrgsFields);

      await studentOrgs.save();
      res.json(studentOrgs);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET api/studentOrgs
// @desc        Get all studentOrgs
// @access      Public

router.get("/", async (req, res) => {
  try {
    const studentOrgs = await StudentOrgs.find().populate("user", ["email"]);
    res.json(studentOrgs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/studentOrgs/:studentOrgId
// @desc        Add the profile to the org members list
// @access      Private

router.post("/:studentOrgId", auth, async (req, res) => {
  try {
    const studentOrgId = req.params.studentOrgId;

    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["email"]
    );

    const profileExists = await StudentOrgs.findOne({
      _id: studentOrgId,
    })
      .where("members")
      .equals(profile._id);

    console.log(profile._id);

    if (!profile) {
      return res.json({ msg: "Profile not found" });
    }

    if (profileExists) {
      console.log(profileExists);
      return res.json({ msg: "Already a member" });
    }

    const studentOrgs = await StudentOrgs.findOneAndUpdate(
      { _id: studentOrgId },
      {
        $push: {
          members: profile._id,
        },
      },
      { new: true }
    ).populate("members");

    const profileUpdate = await Profile.findOneAndUpdate(
      { user: req.user.id },
      {
        $push: {
          orgStatus: {
            orgID: studentOrgId,
            orgName: studentOrgs.name,
            orgRole: "follower",
          },
        },
      }
    );

    res.json({ msg: "Success" });
  } catch (error) {
    console.error(error.message);

    if (error.kind == "ObjectId") {
      return res.json({ msg: "Profile not found" });
    }

    res.status(500).send("Server error");
  }
});

module.exports = router;
