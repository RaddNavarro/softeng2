const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Posts = require("../../models/Posts");
const Profile = require("../../models/Profile");

// @route       POST api/posts
// @desc        Create posts
// @access      Private

router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("studentOrgs", "Student Orgs is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const { title, description, studentOrgs } = req.body;
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["email"]
    );
    console.log(profile._id);

    //Build posts object
    const postsFields = {};
    postsFields.profile = profile._id;
    if (title) postsFields.title = title;
    if (description) postsFields.description = description;
    if (studentOrgs) postsFields.studentOrgs = studentOrgs;

    try {
      // let posts = await Posts.findOne({ profile: profile._id });

      // if (posts) {
      //   // Update posts

      //   posts = await Posts.findOneAndUpdate(
      //     { profile: profile._id },
      //     { $set: postsFields },
      //     { new: true }
      //   );

      //   return res.json(posts);
      // }

      // Create
      let posts = new Posts(postsFields);

      await posts.save();
      res.json(posts);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET api/posts
// @desc        Get all posts
// @access      Public

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find().populate("profile");
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/posts/:postsId
// @desc        delete a post
// @access      Private

router.delete("/:postsId", async (req, res) => {
  try {
    const postsId = req.params.postsId;

    let posts = await Posts.findOneAndDelete({ _id: postsId });
    if (!posts) {
      return res.json({ msg: "Post not found" });
    }

    posts = await Posts.find();

    res.send(posts);
  } catch (error) {
    console.error(error.message);

    if (error.kind == "ObjectId") {
      return res.json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
