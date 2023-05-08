const express = require("express");
const Events = require("../model/events.model");
const Calendar = require("../../Calendar/model/calendar.model");

const router = express.Router();

router.post("/:idCalendar", async (req, res, next) => {
  try {
    const newEvent = new Events(req.body);
    const postNewEvent = await newEvent.save();

    if (postNewEvent) {
      const calendar = await Calendar.findById(req.params.idCalendar);
      let updateCalendar;
      try {
        calendar.events.push(newEvent._id);
        updateCalendar = await Calendar.findByIdAndUpdate(
          req.params.idCalendar,
          calendar
        );
      } catch (error) {
        next(error);
      }

      return res.status(200).json({
        createEvent: postNewEvent,
        updateCalendar: await Calendar.findById(req.params.idCalendar).populate(
          "events"
        ),
      });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
