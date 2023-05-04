const express = require("express");
const Artist = require("../models/artist.model");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const artistGetAll = await Artist.find();
    return res.status(200).json(artistGetAll);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
