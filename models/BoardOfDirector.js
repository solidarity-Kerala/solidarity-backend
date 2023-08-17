const mongoose = require("mongoose");

const BoardOfDirectorSchema = new mongoose.Schema(
  {
    enName: {
      type: String,
    },
    enDesignation: {
      type: String,
    },
    enDescription: {
      type: String,
    },
    image: {
      type: String,
    },
    arName: {
      type: String,
    },
    arDesignation: {
      type: String,
    },
    arDescription: {
      type: String,
    },
    urName: {
      type: String,
    },
    urDesignation: {
      type: String,
    },
    urDescription: {
      type: String,
    },
    instaId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    twitterId: {
      type: String,
    },
    linkedinId: {
      type: String,
    },
    pinterestId: {
      type: String,
    },
    youtubeId: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BoardOfDirector", BoardOfDirectorSchema);
