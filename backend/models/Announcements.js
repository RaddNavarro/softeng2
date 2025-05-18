// models/Announcement.js
const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    /* who posted it -------------------------------------------------------- */
    author: {
      type: mongoose.Schema.Types.ObjectId, // user / profile making the post
      ref: "profiles",
      required: true,
    },

    /* scope / visibility --------------------------------------------------- */
    org: {
      type: String,          // e.g. “Musikalista”, “Student Council”
      ref: "student-orgs",   // keep the ref if you have a separate collection
      required: true,
    },

    /* core content --------------------------------------------------------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,          // longer, markdown-ready description
      required: true,
    },
    imageUrl: {
      type: String,          // optional hero/banner image
    },

    /* scheduling ----------------------------------------------------------- */
    eventDate: {
      type: Date,            // date the announcement applies to (used in Calendar)
      required: true,
    },
    expiryDate: {
      type: Date,            // optional “remove after” date
    },

    /* extra UX helpers ----------------------------------------------------- */
    sticky: {
      type: Boolean,
      default: false,        // true → always show at top/special styling
    },
    tags: [
      {
        type: String,        // quick client-side filtering (e.g. "deadline", "event")
        lowercase: true,
        trim: true,
      },
    ],
  },
  { timestamps: true }       // adds createdAt & updatedAt automatically
);

/* index to quickly grab upcoming announcements */
AnnouncementSchema.index({ eventDate: 1 });

module.exports = mongoose.model("announcements", AnnouncementSchema);
