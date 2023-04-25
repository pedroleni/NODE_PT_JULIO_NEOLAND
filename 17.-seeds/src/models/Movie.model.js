const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema(
  {
    title: { type: String, required: true },
    poster: { type: String, required: true },
    year: { type: Number, required: true },
    released: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const MovieModel = mongoose.model("Movie", MovieSchema);

module.exports = MovieModel;
