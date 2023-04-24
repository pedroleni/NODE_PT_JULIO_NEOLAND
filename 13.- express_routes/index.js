/// Nos traemos la libreria
const express = require("express");

// creamos la constante del puerto
const PORT = 8080;
const app = express();

const router = express.Router();
/// vamos a definir el routing de nuestra aplicacion

router.get("/", (req, res) => {
  res.send("Hello world");
});

router.get("/movies", (req, res) => {
  const movies = ["Dune", "Harry Potter", "Matilda", "Doraemon"];
  const person = {
    name: "Peter",
    surname: "Parker",
  };
  res.send(person);
});

///VAMOS A CONFIGURAR EL PATH PRINCIPAL

app.use("/api/v1/", router);

// vamos a poner el servidor en marcha con el listen
app.listen(PORT, () => {
  console.log(`Server listening on port 🐱‍🚀 http://localhost:${PORT}/api/v1`);
});
