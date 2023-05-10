const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalendarSchema = new Schema(
  {
    date: { type: Date, required: true, unique: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
    events: [{ type: mongoose.Types.ObjectId, ref: "Events" }],
  },
  {
    timestamps: true,
  }
);

const Calendar = mongoose.model("Calendar", CalendarSchema);
module.exports = Calendar;
