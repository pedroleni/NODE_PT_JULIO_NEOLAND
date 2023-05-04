const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumsSchema = new Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    artist: { type: String, required: true },
    year: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Albums = mongoose.model("Albums", AlbumsSchema);

module.exports = Albums;
