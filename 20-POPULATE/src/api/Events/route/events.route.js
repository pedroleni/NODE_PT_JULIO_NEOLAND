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

    // recordar que el find nos permite traernos todosl os elementos que nosotros pongamos en las condicones de sus parentesis
    //! EL FIND DEVUELVE UN ARRAY DE ELMENTOS
    //! EL FINDBYID DEVUELVE O UN OBJETO O DEVUELVE UN NULL SI NO LO HA ENCONTRADO
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

    /// populate nos sirve para que los elementos del Schema del modelo que esten
    //con objectID podamos acceder a su info de otro modelo
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
  //patch es un metodo para hacer una modificacion partial de los elementos de la coleccion
  try {
    // lo primero es muy importante es que actualicemos los indexes de los elementos unique de nuestra bdo
    await Events.syncIndexes();

    // nos traemos el id de los param y hacemos la actualizacion metiendole la info del req.body
    const { id } = req.params;
    const updateEvent = await Events.findByIdAndUpdate(id, req.body);

    /// evaluamos que la operacion sea ok
    if (updateEvent) {
      // si es ok devolvemos una respuesta con el evento actualizado con el findById
      return res.status(200).json(await Events.findById(id));
    } else {
      // sino devolvemos una respuesta con que no hemos podido actualizar el elemento
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
      // si se ha producido el borrado lo que vamos a hacer es actualizar Calendar
      // Vamos a sacarle todos los id del array de events a calendar, el id del evento borrado
      await Calendar.updateMany({ events: id }, { $pull: { events: id } });

      //hacemos un pequeño test con un ternario para saber si se ha borrado correctamente y que el cliente tenga feedback
      return res.status(200).json({
        finally: "ok operation delete event",
        deleteEvent: deleteEvent,
        test:
          (await Events.findById(id)) === null
            ? "Ok borrado correctamente"
            : "error delete event",
      });
    } else {
      // si se lanza esto quiere decir que no se ha encontrado por id y por ello no ha podido borrar
      return res.status(404).json("error in first step, Not found event by id");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
