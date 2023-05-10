const express = require("express");
const Calendar = require("../model/calendar.model");
const Events = require("../../Events/model/events.model");

const router = express.Router();

//! -------------------------------------------------------------------
//? ---------------------------POST --------------------------------
//! -------------------------------------------------------------------
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

//! -------------------------------------------------------------------
//? ---------------------------DELETE --------------------------------
//! -------------------------------------------------------------------

// TODO -----------------------------------------------------------------
// ? -----------------------EJERCICIO-------------------------------------
// TODO -----------------------------------------------------------------

// intenta hacer el ejercio que si falla el borrar los eventos que vuelva a meter
// en la base de datos el objeto dee calendario borrado y asi dejar la bdo de la misma
// forma que estaba antes del error dando feedback al cliente para que sepa como
// gestionar el error
// - Puedes hacerlo con redireccionamientos
// - O puedes hacerlo directamente en el delete aunque no es la mejor practica
/// -------- ver como guardar de nuevo --------
router.delete("/:id", async (req, res, next) => {
  try {
    //res.redirect(307, "http://localhost:8081/api/v1/calendar/hola");
    const { id } = req.params;
    const deleteCalendar = await Calendar.findByIdAndDelete(id);

    //! PISTA: ¿Hace falta realmente un array? --- recuerda podemos acceder a unas posiciones de un objeto con el objeto.clave ...
    const arrayMap = [deleteCalendar];
    const saveDelete = arrayMap.map((element) => ({
      date: element.date,
      description: element.description,
      img: element.img,
      events: element.events,
    }));
    //! PISTA: en un save, se hace de una nueva instancia del modelo, y esa instancia le pone un id nuevo
    //! realmente quiero un id nuevo o le ponemos el anterior?
    if (deleteCalendar) {
      deleteCalendar.events.forEach(async (event, index) => {
        try {
          const prueba = await Events.deleteMany({ _id: event });
        } catch (error) {
          try {
            // todo tenemos que hacer un post para que funcione por redirect el .save en un post
            //! fatan cosas, mira las pistas y los otros save que hemos hecho en otras paginas
            // todo const reSaveCalendar = await saveDelete.save();
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

//! ----------------------------------------------------------------------------------------
//! ---------------------------------STOP MY FRIENDS ❌------------------------------------
//! ---------SOLUCION SIN REDIRECCIONAMIENTO MIRAR ANTES DE PROBAR VOSTROS LA SOLUCION------
//! ----------------------------------------------------------------------------------------
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteCalendar = await Calendar.findByIdAndDelete(id);
    // comprobamos si  se ha producido el delete correctamente
    if (deleteCalendar) {
      /// si se ha borrado correctamente pasamos a borrar los eventos asociados a este dia
      // esto es por nuestra logica de negocio, aunque puede no quiera borrarlos sino simplemente modificarlos

      deleteCalendar.events.forEach(async (event, index) => {
        try {
          const prueba = await Events.deleteMany({ _id: event });
        } catch (error) {
          /// Si hay un error en el borrado de los eventos entonces volvemos a crear el calendario

          try {
            // para crearlo hay que hacer de nuevo un modelo y este modelo tiene que recibir un objeto sin el id
            const newCalendar = {
              img: deleteCalendar.img,
              date: deleteCalendar.date,
              description: deleteCalendar.description,
            };
            // creamos un nuevo modelo del calendario
            const newCalendarClon = new Calendar(newCalendar);

            // le ponemos el id del objeto original para que no se cambie
            newCalendarClon._id = id;

            // lo guardamos en la base de datos
            await newCalendarClon.save();

            // por ultimo devolvemos una respuesta de que se a vuelto a resubir
            return res.status(500).json({
              status: "error in deleteMany - reSaveCalendar",
              reSave: reSaveCalendar,
            });
          } catch (error) {
            // el guardar el objeto a su vez, lanza un error y esto puede causar inconsistencias
            return next(error);
          }
        }
      });

      return res.status(200).json({
        deleteCalendar,
        test:
          (await Calendar.findById(id)) === null
            ? "Test ok, delete calendar 👌"
            : "error in second step ❌",
      });
    } else {
      return res
        .status(404)
        .json("error in first step, Not found calendar byId");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
