const express = require("express");
const router = express.Router();
const { check, validationResult, body } = require("express-validator");
const Profile = require("../../models/Profile");
const StudentOrgs = require("../../models/StudentOrgs");
const auth = require("../../middleware/auth");
const UsersModel = require("../../models/Users");

router.get("/", (req, res) => res.send("Admin route"));

// @route       POST api/admin/role
// @desc        give roles
// @access      Private

router.post(
  "/role",
  [
    auth,
    [
      check("orgId", "Org ID is required").not().isEmpty(),
      check("newRole", "New role is required").not().isEmpty(),
      check("profileId", "College Department is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { orgId, newRole, profileId } = req.body;

    const rolesField = {};
    if (newRole) rolesField.orgRole = newRole;

    try {
      const user = await UsersModel.findOne({ _id: req.user.id })
        .where("role")
        .equals("admin");

      if (!user) {
        return res.json({ errors: [{ msg: "Not an admin" }] });
      }

      let profile = await Profile.findById(profileId);
      const studentOrgs = await StudentOrgs.findById(orgId);
      console.log(profile);
      console.log(studentOrgs);
      if (profile && studentOrgs) {
        // Update posts

        profile = await Profile.findOneAndUpdate(
          {
            "orgStatus.orgID": orgId,
          },
          {
            $set: {
              "orgStatus.$.orgRole": newRole,
            },
          },
          { new: true }
        );
        // profile = await Profile.findOne({
        //   "orgStatus.orgID": orgId,
        // });

        console.log(profile);

        return res.json(profile);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
