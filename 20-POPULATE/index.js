//! ------- CREAMOS EL SERVIDOR WEB CON EXPRESS -------------

const express = require("express");
const dotenv = require("dotenv");
const connect = require("./src/utils/db");

dotenv.config();

//! ------TRAERNOS EL PORT, CREAR EL SERVER WEB Y POR ULTIMO CONECTAR LA DB
const PORT = process.env.PORT;
const app = express();
connect();

//! --------CONFIGURAMOS LAS CORS QUE SON LOS LIMITES AL ACCESO DE NUESTRA API
const cors = require("cors");

app.use(cors());

app.use((req, res, next) => {
  // con el asterisco les estamos diendo en la header que puede entrar a nuestro backend cualquier cliente
  res.header("Access-Control-Allow-Origen", "*");

  // Primero decimos que las header ayudar a  controlar el acceso de nuestra api
  //Segundo puede haber authorizaciones mediante las request que acepten un contenido concreto en nuestra api
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  /// VERBOS  PERMITIDOS EN NUESTRA
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

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
