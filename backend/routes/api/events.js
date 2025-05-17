const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const Events = require("../../models/Events");

router.post(
  "/:currentOrgId",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      //   check("eventDate", "Event Date is required").not().isEmpty(),
      check("eventDateFrom", "Event Date From is required").not().isEmpty(),
      check("eventDateTo", "Event Date To is required").not().isEmpty(),
      check("eventPlace", "Event Place is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    let currentOrgId = req.params.currentOrgId;

    const {
      title,
      description,
      //   eventDate,
      eventDateFrom,
      eventDateTo,
      eventPlace,
      image,
    } = req.body;

    //Build events object
    const eventsFields = {};
    eventsFields.studentOrg = currentOrgId;
    if (title) eventsFields.title = title;
    if (description) eventsFields.description = description;
    // if (eventDate) eventsFields.eventDate = eventDate;
    if (eventDateFrom) eventsFields.eventDateFrom = eventDateFrom;
    if (eventDateTo) eventsFields.eventDateTo = eventDateTo;
    if (eventPlace) eventsFields.eventPlace = eventPlace;
    if (image) eventsFields.image = image;
    try {
      // Create
      let events = new Events(eventsFields);
      await events.save();
      res.json(events);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const events = await Events.find().populate("studentOrg");
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
