const express = require("express");
const Events = require("../model/events.model");
const Calendar = require("../../Calendar/model/calendar.model");

const router = express.Router();
//! -------------------------------------------------------------------
//? ---------------------------POST -----------------------------------
//! -------------------------------------------------------------------

router.post("/:idCalendar", async (req, res, next) => {
  try {
    // actualizamos los indexe-> recordar que los indexes son los elementos unique en el Schema del modelo
    await Events.syncIndexes();
    const newEvent = new Events(req.body);
    const postNewEvent = await newEvent.save();
    //! tenemos que evaluar que el evento se ha guardado correctamente

    if (postNewEvent) {
      const calendar = await Calendar.findById(req.params.idCalendar);
      let updateCalendar;
      try {
        // -- aqui le puseo al array el id del evento creado y guardado
        calendar.events.push(newEvent._id);

        // despues cojo y lo actualizo con el metodo dde buscar por id y actualizar
        updateCalendar = await Calendar.findByIdAndUpdate(
          req.params.idCalendar,
          calendar
        );
      } catch (error) {
        return next(error);
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

//! -------------------------------------------------------------------
//? ---------------------------GETALL --------------------------------
//! -------------------------------------------------------------------
router.get("/", async (req, res, next) => {
  try {
    const eventsAll = await Events.find().populate("day");
    if (eventsAll) {
      return res.status(200).json(eventsAll);
    } else {
      return res.status(404).json("Failed getAll controller to events");
    }
  } catch (error) {
    return next(error);
  }
});

//! -------------------------------------------------------------------
//? ---------------------------GET by name --------------------------------
//! -------------------------------------------------------------------

// IMPORTANTE -- si tenemos varios get que reciben parametros hay que meterle un paso antes con un /*css*/
// para que no se confunda con el mismo controlador del mismo typo get que recibe un paramentro
// por eso el controlador de by Name lleva en el path /name/:name para que no se confunda con el
// con el controlar de getById que es un get y tiene y solo tiene el path "/:id"

router.get("/name/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const eventByName = await Events.find({ name }).populate("day");
    if (eventByName) {
      return res.status(200).json(eventByName);
    } else {
      return res.status(404).json("Error to controller getByname Events");
    }
  } catch (error) {
    return next(error);
  }
});

//! -------------------------------------------------------------------
//? ---------------------------GET by id --------------------------------
//! -------------------------------------------------------------------

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const eventById = await Events.findById(id).populate("day");
    if (eventById) {
      return res.status(200).json(eventById);
    } else {
      return res.status(404).json("Error controller GetById Event");
    }
  } catch (error) {
    return next(error);
  }
});

//! -------------------------------------------------------------------
//? ---------------------------PATCH --------------------------------
//! -------------------------------------------------------------------
router.patch("/:id", async (req, res, next) => {
  try {
    await Events.syncIndexes();
    const { id } = req.params;
    const updateEvent = await Events.findByIdAndUpdate(id, req.body);
    if (updateEvent) {
      return res.status(200).json(await Events.findById(id));
    } else {
      return res.status(404).json(" Error updateEvents");
    }
  } catch (error) {
    return next(error);
  }
});

//! -------------------------------------------------------------------
//? ---------------------------DELETE --------------------------------
//! -------------------------------------------------------------------

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteEvent = await Events.findByIdAndDelete(id);
    if (deleteEvent) {
      await Calendar.updateMany({ events: id }, { $pull: { events: id } });
      return res.status(200).json({
        finally: "ok operation delete event",
        deleteEvent: deleteEvent,
        test:
          (await Events.findById(id)) === null
            ? "Ok borrado correctamente"
            : "error delete event",
      });
    } else {
      return res.status(404).json("error in first step");
    }
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
