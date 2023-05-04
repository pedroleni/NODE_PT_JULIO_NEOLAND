const express = require("express");
const dotenv = require("dotenv");
const connect = require("./src/utils/db");

dotenv.config();

//Creamos el servidor
const server = express();
//Le decimos que la información que le llega al server por el body es de tipo json y que la codifique por url
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//Recuperamos la variable de entorno PORT
const PORT = process.env.PORT;
//Nos conectamos a la base de datos
connect();

//Controlar las rutas de Albums

// A partir de /albums empiezan las rutas de albumRoutes
const albumsRouter = require("./src/api/routes/albums.routes");
server.use("/api/v1/albums", albumsRouter);

const router = require("./src/api/routes/artist.routes");
server.use("/api/v1", router);

//Controlamos las rutas "not found";
server.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
