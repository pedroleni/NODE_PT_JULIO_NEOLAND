//! ------- CREAMOS EL SERVIDOR WEB CON EXPRESS -------------

const express = require("express");
const dotenv = require("dotenv");
const connect = require("./src/utils/db");

dotenv.config();

//! ------TRAERNOS EL PORT, CREAR EL SERVER WEB Y POR ULTIMO CONECTAR LA DB
const PORT = process.env.PORT;
const app = express();
connect();

//! ----- DECIRLE EL TIPO DE SERVE WEB QUE VAMOS A TENER, UNA CONFIG BASICA INICIAL -----

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//! ------ LAS ROUTAS -------------------------------------------

const calendarRouter = require("./src/api/Calendar/route/calendar.route");
const eventsRouter = require("./src/api/Events/route/events.route");

app.use("/api/v1/calendar", calendarRouter);
app.use("/api/v1/events", eventsRouter);

app.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

//! ------VAMOS A ESCUCHAR EL SERVIDOR WEB EN SU PUERTO CORRESPONDIENTE------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
