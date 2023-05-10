const express = require("express");
const Calendar = require("../model/calendar.model");
const Events = require("../../Events/model/events.model");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const newCalendarDay = new Calendar(req.body);
    const postCalendarDay = await newCalendarDay.save();
    return postCalendarDay
      ? res.status(200).json(postCalendarDay)
      : res.status(404).json("Error create Calendar");
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const getAllCalendar = await Calendar.find();
    if (getAllCalendar) {
      return res.status(200).json(getAllCalendar);
    } else {
      return res.status(404).json("Error to getAll CONTROLLER");
    }
  } catch (error) {
    return next(error);
  }
});

router.get("/hola", async (req, res, next) => {
  return res.status(200).json("hola");
});

/// -------- ver como guardar de nuevo --------
router.delete("/:id", async (req, res, next) => {
  try {
    //res.redirect(307, "http://localhost:8081/api/v1/calendar/hola");
    const { id } = req.params;
    const deleteCalendar = await Calendar.findByIdAndDelete(id);
    const arrayMap = [deleteCalendar];
    const saveDelete = arrayMap.map((element) => ({
      date: element.date,
      description: element.description,
      img: element.img,
      events: element.events,
    }));

    if (deleteCalendar) {
      deleteCalendar.events.forEach(async (event, index) => {
        try {
          const prueba = await Events.deleteMany({ _id: event });
        } catch (error) {
          try {
            // tenemos que hacer un post para que funcione por redirect el .save en un post
            ///const reSaveCalendar = await saveDelete.save();
            return res.status(500).json({
              reSave: reSaveCalendar,
            });
          } catch (error) {
            return next(error);
          }
        }
      });

      return res.status(200).json({
        deleteCalendar,
        test:
          (await Calendar.findById(id)) === null
            ? "Test ok, delete calendar check"
            : "error in second step",
      });
    } else {
      return res.status(404).json("error in first step");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
